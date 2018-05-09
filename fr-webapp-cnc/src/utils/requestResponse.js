import noop from 'utils/noop';

/**
 * GDS APIs returns an error response when data is not been entered by the user,
 * user doesn't have a credit card or giftcards assigned.
 * This utility function will be called only when loading data from APIs, currently if
 * one API fails (which it's very common unless the user selected all the available options) then
 * all APIs that successfully return the data will be rejected. This utility fix this problem by
 * ignoring the promises tht fails.
 *
 * @param {Array<Promise>} promises  The promises to ignore if there's an error
 * @return {Promise} An array of promises ignoring failures.
 */
export function ignoreResponseFailures(promises) {
  return Promise.all(promises.map(promise => (promise.catch ? promise.catch(noop) : promise)));
}
