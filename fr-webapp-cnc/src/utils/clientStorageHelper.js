import ls from 'utils/localStorageWrapper';
import noop from 'utils/noop';
import { MINUTE, HOUR, DAY, WEEK, MONTH, YEAR } from 'utils/formatDate';

function calcExpire(expire) {
  switch (expire) {
    case 'H':
      return HOUR;
    case 'D':
      return DAY;
    case 'W':
      return WEEK;
    case 'M':
      return MONTH;
    case 'Y':
      return YEAR;
    default:
      return ~~expire * MINUTE; // eslint-disable-line no-bitwise
  }
}

export default class ClientStorage {
  /**
   * Flags when the last purge happened.
   * We don't want to purge on every save/read
   * so purging is done every purgeDelay
   * @type {Number}
   */
  lastPurge = 0;

  /**
   * How often should we purge cache
   * @type {Number}
   */
  // every 15 minutes
  purgeDelay = 15 * MINUTE;

  /**
   * When to expire by defualt.
   * In minutes
   * @type {Number}
   */
  // expire in 60 minutes by default
  defaultExpire = HOUR;

  db = ls;

  /**
   * Calculate the expire timestamp. Now + duration.
   * @param  {Number} expire Time in minutes
   * @return {Number}        Timesetamp
   */
  getExpireTimestamp(expire = this.defaultExpire) {
    return Date.now() + calcExpire(expire);
  }

  /**
   * Find all keys that should have expired
   * @private
   * @param  {Object} expires Metadata from the 'expires' key
   * @return {Object}         Reduced metadata to only the expired keys
   */
  findExpiredValues(expires) { // eslint-disable-line class-methods-use-this
    const purgeBefore = Date.now();

    return Object.keys(expires).reduce((expired, key) => {
      if (expires[key] < purgeBefore) {
        expired.push(key);
      }

      return expired;
    }, []);
  }

  /**
   * Find expired values and remove them
   * @private
   * @param  {Object} expires All expires metadata
   * @return {Promise}        Result of deletion of all expired keys
   */
  doPurgeExpiredValues(expires) {
    const toPurge = this.findExpiredValues(expires);
    const purgePromises = [];

    toPurge.forEach((key) => {
      purgePromises.push(this.db.removeItem(key));
      delete expires[key];
    });

    purgePromises.push(this.db.setItem('expires', expires));

    return Promise.all(purgePromises);
  }

  /**
   * Calculate the last timestamp before expires, find expires and remove them
   * @private
   * @return {Promise} Result of deletion
   */
  purgeAllExpires() {
    const now = Date.now();
    const shouldPurge = now - this.lastPurge > this.purgeDelay;

    if (shouldPurge) {
      this.lastPurge = now;

      return this.db
        .getItem('expires')
        .then(expires => (expires ? this.doPurgeExpiredValues(expires) : noop));
    }

    return Promise.resolve(false);
  }

  /**
   * Purge all expires even more asyncrhonously. After get/set so it doesn't
   * impact the time to retrieve/set cache.
   */
  deferPurge() {
    setTimeout(() => this.purgeAllExpires(), 100);
  }

  /**
   * Invalidate a single key, byt only if it has expired
   * @param  {String} key Key to invalidate
   * @return {Promise}    Result of invalidation
   */
  invalidateExpire(key) {
    return this.db
      .getItem('expires')
      .then(expires => (expires ? this.doPurgeExpiredValues({ [key]: expires[key] }) : noop));
  }

  /**
   * Set expiry time for a key
   * @param {Object} expires  All expires
   * @param {String} key      Key
   * @param {Number} lifetime How long it should be cached
   */
  setExpiry(expires, key, lifetime) {
    if (!expires) {
      expires = {}; // eslint-disable-line no-param-reassign
    }

    expires[key] = this.getExpireTimestamp(lifetime);

    return this.db.setItem('expires', expires);
  }

  /**
   * Save a value to db
   * @param {String} key      Key
   * @param {Any}    value    Value to cache (any JS type)
   * @param {Number} lifetime Lifetime in minutes (Optional. Default to @defaultExpire)
   * @return {Promise}        Value in Promise
   */
  set(key, value, lifetime) {
    this.deferPurge();

    return this.db
      .setItem(key, value)
      .then(() => this.db.getItem('expires'))
      .then(expires => this.setExpiry(expires, key, lifetime))
      .then(() => value);
  }

  /**
   * Get value from db
   * @param  {String}  key Key
   * @return {Promise}     Value in Promise
   */
  get(key) {
    this.deferPurge();

    return this.invalidateExpire(key)
      .then(() => this.db.getItem(key));
  }

  /**
   * Remove value from db
   * @param  {String}  key Key
   * @return {Promise}     Value in Promise
   */
  remove(key) {
    this.deferPurge();

    return this.db.removeItem(key);
  }
}
