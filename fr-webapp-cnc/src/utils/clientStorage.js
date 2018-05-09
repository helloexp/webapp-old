/**
 * Local caching with expiry support
 *
 * Examples:
 * ---------
 * Import:
 *   import ClientStore from 'helpers/ClientStore';
 *
 * Save {foo: 1} object under key 'foo'.
 *   ClientStore.set('foo',{foo: 1}).then(storedVal => console.log(storedVal));
 *
 * Save {foo: 1} object under key 'foo'. Expire in 10 minutes
 *   ClientStore.set('foo',{foo: 1}, 10).then(storedVal => console.log(storedVal));
 *
 * Get from store
 *   ClientStore.get('foo').then(value => console.log(value))
 *
 * After ten minutes the response will be null.
 *
 * Expires argument can also be a string:
 *   'H' (Hour)
 *   'D' (Day)
 *   'W' (Week)
 *   'M' (Month)
 *   'Y' (Year)
 */

import ClientStorage from './clientStorageHelper';

const clientStoreCfg = {
  name: 'fr-client-store',
  version: 1.0,
  storeName: 'store',
};

const store = new ClientStorage(clientStoreCfg);

// 1 day default expiry
store.defaultExpire = 24 * 60;

export default store;
