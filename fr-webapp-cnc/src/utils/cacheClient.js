/**
 * Local caching with expiry support
 *
 * Examples:
 * ---------
 * Import:
 *   import { toCache, fromCache } from 'helpers/CacheClient';
 *
 * Save {foo: 1} object under key 'foo'. Expire in 10 minutes
 *   toCache('foo',{foo: 1}, 10).then(storedVal => console.log(storedVal));
 *
 * Get from cache
 *   fromCache('foo').then(value => console.log(value))
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

const cacheStore = {
  name: 'fr-uniqlo',
  version: 1.0,
  storeName: 'cache',
};

export const cache = new ClientStorage(cacheStore);
export const toCache = cache.set.bind(cache);
export const fromCache = cache.get.bind(cache);
export const rmCache = cache.remove.bind(cache);

