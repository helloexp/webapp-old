/**
 * List of values that will be removed
 * @type {Array<*>}
 */
const paramValuesToRemove = [undefined, null, NaN];

/**
 * Removes empty keys-value parameter pairs
 * @example <caption>Example usage of removeEmptyKeys.</caption>
 *  // returns { a: "aaa", d: 0 }
 *  removeEmptyKeys({ a: 'aaa', b: undefined, c: null, d: 0, e: NaN });
 * @param {Object} obj
 * @return {Object}
 */
export const removeEmptyKeys = obj =>
  Object.keys(obj).reduce((acc, key) =>
    (!paramValuesToRemove.includes(obj[key]) ? { ...acc, [key]: obj[key] } : acc), {});
