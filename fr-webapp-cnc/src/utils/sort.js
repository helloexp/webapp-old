/**
 * functions to sort an array of objects, according
 * to the particular key of type number
 */

// Sorts the array of objects in ascending order
export function sortInAscendingOrder(list, key) {
  return list.sort((item1, item2) => item1[key] > item2[key]);
}

// Sorts the array of objects in descending order
export function sortInDescendingOrder(list, key) {
  return list.sort((item1, item2) => item1[key] < item2[key]);
}
