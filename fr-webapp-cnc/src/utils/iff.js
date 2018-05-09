/**
 * IIF - Immediate If
 * A function that returns the second or third parameter
 * based on the evaluation of the first parameter
 * @param {Boolean} condition - value/expression that evaluates to be a boolean
 * @param {*} then - value to be returned if condition is satisfied
 * @param {*} otherwise - value to be returned if condition fails
 */
export default function iff(condition, then, otherwise) {
  return condition ? then : otherwise;
}
