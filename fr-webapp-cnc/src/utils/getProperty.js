import isObject from './isObject';

/**
 * Extracts deeply nested object value by path
 * @param {Object} obj - base object
 * @param {string} path - property path
 * @param {*} fallback - return if not found instead of default null
 * @returns {*}
 */
export default function getProperty(obj, path, fallback = null) {
  let result = obj;

  for (const prop of path.split('.')) {
    if (isObject(result) && result.hasOwnProperty(prop)) {
      result = result[prop];
    } else {
      return fallback;
    }
  }

  if (result === null || result === undefined) {
    return fallback;
  }

  return result;
}
