import noop from 'utils/noop';

const win = (typeof window !== 'undefined' ? window : global);
const localStorageName = 'localStorage';
let storage;

const store = {
  version: '1.3.20',
  disabled: false,

  /**
   * Set value
   * @param {String} key   LS key property
   * @param {Any}    value LS value
   */
  set: noop,

  /**
   * Get value
   * @param  {String} key        LS Key
   * @param  {Object} defaultVal Default if key is not found
   * @return {Object}            LS Value
   */
  get: noop,

  /**
   * Remove item from LS
   * @param  {String} key Key to delete
   */
  remove: noop,

  /**
   * Clear LS
   */
  clear: noop,

  /**
   * Set-type of has where we try to see if a value exists in LS
   * @param  {String}  key  LS Key
   * @return {Boolean}      True if value exists
   */
  has: function has(key) { return store.get(key) !== undefined; },

  /**
   * Transaction
   * @param  {String}    key           LS Key
   * @param  {Object}    defaultVal    Default value
   * @param  {Function}  transactionFn Function that modifies LS item
   */
  transact: function transact(key, defaultVal, transactionFn) {
    if (transactionFn === null) {
      transactionFn = defaultVal;
      defaultVal = null;
    }
    if (defaultVal === null) {
      defaultVal = {};
    }
    const val = store.get(key, defaultVal);
    const ret = transactionFn(val);

    store.set(key, ret === undefined ? val : ret);
  },

  /**
   * Get the entire LS dump
   * @return {Object} LS dump
   */
  getAll: function getAll() {
    const ret = {};

    store.forEach((key, val) => {
      ret[key] = val;
    });

    return ret;
  },

  /**
   * Iterator
   * @return {[type]} [description]
   */
  forEach: noop,

  /**
   * Serialize value
   * @param  {Object} value Object to serialize
   * @return {String}       Serialized version of object
   */
  serialize: function serialize(value) {
    return JSON.stringify(value);
  },

  /**
   * De-serialized value
   * @param  {String} value Serialized string
   * @return {Object}       De-serialized object
   */
  deserialize: function deserialize(value) {
    if (typeof value !== 'string') { return undefined; }
    try { return JSON.parse(value); } catch (e) { return value || undefined; }
  },

  // Support for localforage-type promise API
  setItem: (...args) => Promise.resolve(store.set(...args)),
  removeItem: (...args) => Promise.resolve(store.remove(...args)),
  getItem: (...args) => Promise.resolve(store.get(...args)),
};

/**
 * Check if localstorage is supported
 * @return {Boolean} True if reported
 */
function isLocalStorageNameSupported() {
  try {
    return (localStorageName in win && win[localStorageName]);
  } catch (err) {
    return false;
  }
}

if (isLocalStorageNameSupported()) {
  storage = win[localStorageName];

  store.set = function set(key, val) {
    if (store.disabled) {
      return val;
    }

    if (val === undefined) { return store.remove(key); }
    storage.setItem(key, store.serialize(val));

    return val;
  };

  store.get = function get(key, defaultVal) {
    const val = store.deserialize(storage.getItem(key));

    return (val === undefined ? defaultVal : val);
  };

  store.remove = function remove(key) { storage.removeItem(key); };

  store.clear = function clear() { storage.clear(); };

  store.forEach = function forEach(callback) {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);

      callback(key, store.get(key));
    }
  };
}

/**
 * Even if supported, browsers may disable LS in private mode
 */
try {
  const testKey = '__storejs__';

  store.set(testKey, testKey);
  if (store.get(testKey) !== testKey) { store.disabled = true; }
  store.remove(testKey);
} catch (e) {
  // private mode (most likely)
  // mock store so it uses object
  store.disabled = true;

  let mockStore = {};

  store.set = function set(key, val) {
    if (val === undefined) { return store.remove(key); }
    mockStore[key] = store.serialize(val);

    return val;
  };

  store.get = function get(key, defaultVal) {
    const val = store.deserialize(mockStore[key]);

    return (val === undefined ? defaultVal : val);
  };

  store.remove = function remove(key) { delete mockStore[key]; };

  store.clear = function clear() { mockStore = {}; };

  store.forEach = function forEach(callback) {
    Object.keys(mockStore)
    .forEach(key => callback(key, store.get(key)));
  };
}
store.enabled = !store.disabled;

export default store;
