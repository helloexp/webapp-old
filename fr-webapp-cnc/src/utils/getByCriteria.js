/**
 * @typedef {*} getByCriteriaItem
 */

/**
 * Returns single item or multiple items selected by criteria
 * @example return first found item
 * // returns { a: 1, b: 1 }
 * getByCriteria(
 *   [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }],
 *   { a: 1 }
 * );
 * @example return all found item
 * // returns [{ a: 1, b: 1 }, { a: 2, b: 1 }]
 * getByCriteria(
 *   [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 1 }, { a: 2, b: 2 }],
 *   { b: 1 },
 *   true
 * );
 *
 * @param {Array<getByCriteriaItem>} items
 * @param {Object} criteria - filter criteria
 * @param {boolean} [multiple=false] - flag says if single item or multiple items should be returned
 * @returns {getByCriteriaItem|Array<getByCriteriaItem>}
 */
export default function getByCriteria(items, criteria, multiple = false) {
  const criteriaKeys = Object.keys(criteria);

  return items[multiple ? 'filter' : 'find'](item =>
    criteriaKeys.every(key => item[key] === criteria[key]));
}
