/**
 * Find intersecting values between two arrays
 * @param  {Array} array1 Array 1
 * @param  {Array} array2 Array 2
 * @return {Array}        Array of intersecting values
 */
export function intersect(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }

  return array1.filter(item => array2.includes(item));
}

/**
 * Find out if two arrays have at least one equal value
 * @param  {Array} array1 Array 1
 * @param  {Array} array2 Array 2
 * @return {Bool}         True if there's a match
 */
export function areIntersecting(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }

  return !!array1.find(item => array2.includes(item));
}
