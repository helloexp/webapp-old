let idCounter = 0;

/**
 * Generate unique id, mostly for DOM elements ids
 * @param {string} prefix - Prefix to be added to generated id
 * @returns {string} - Unique id
 */
export default function uniqueId(prefix = '') {
  const id = ++idCounter;

  return `${prefix}${id}`;
}
