/**
 * Debug utility
 *
 * Four functions to use for debugging the app: dbg, log, warn, error
 * Based on the `debug` npm module.
 *
 * For server side logging start the app with DEBUG environmental variable
 *   DEBUG=log:* node ./bin/server.js
 * or
 *   DEBUG=log:warn node ./bin/server.js
 *
 * For client side, set `debug` key in LocalStorage to show log
 *
 * Use as such:
 *
 *  import log from 'utils/logger';
 *
 *
 *  log.log('Hello Uniqlo');
 *  log.dbg('Hello Uniqlo');
 *  log.warn('Hello Uniqlo');
 *  log.error('Hello Uniqlo');
 */
import ls from 'utils/localStorageWrapper';
import noop from 'utils/noop';

const namespace = window || global || {};

const shouldShowErrors = () => ls.get('debug') || namespace.DEBUG;

/* eslint-disable no-console */
const dbg = (...args) => shouldShowErrors() && console.log('Log:', ...args);
const log = dbg;
const warn = (...args) => shouldShowErrors() && console.warn('Warning:', ...args);
const error = (...args) => shouldShowErrors() && console.error('Error:', ...args);
/* eslint-enable */

const exportObject = {
  dbg,
  log,
  warn,
  error,
};

exportObject.enable = noop;

export default exportObject;
