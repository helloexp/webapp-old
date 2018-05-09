/**
 * Cache object that contains selector branches
 * @type {Object}
 */
const trunks = {};

/**
 * Factory for creating a cached selector for when selector are reused for different data
 * Example is when we need to call selectors for various brands that appear on the same page
 * Then caching is lost because brand changes
 * This function creates multiple versions of the same selector
 *
 * @param  {String}   name                   Name selector type. Used for caching.
 * @param  {Function} diffCallback           Function to call to determine selector variation. E.g. getBrand
 * @param  {Function} createSelectorCallback Function that creates selector. Usually arrow function
 * @return {selector}                        Selector function variation per diffCallback
 */
export default function createBranchedSelector(name, diffCallback, createSelectorCallback) {
  if (!trunks[name]) {
    trunks[name] = {};
  }

  const memoStorage = trunks[name];

  return function branchSelector(...args) {
    const branch = diffCallback.apply(this, args);

    if (!memoStorage[branch]) {
      memoStorage[branch] = createSelectorCallback();
    }

    return memoStorage[branch].apply(this, args);
  };
}
