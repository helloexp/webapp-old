/**
 * Check if value is plain object
 * @param {*} value
 * @returns {boolean}
 */
export default function isObject(value) {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}
