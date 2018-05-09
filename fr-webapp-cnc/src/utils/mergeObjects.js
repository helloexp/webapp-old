/**
 * merge two objects such that undefined and null is handled
 * @param {Array} keys - keys to be mapped from primary or secondary object
 * @param {Array} keyNames - keys to be used for the resulting object. If nothing is passed, keys will be used.
 * @param {Object} primObj
 * @param {Object} secObj
 */
export function mergeObjects({ keys = [], primObj = {}, secObj = {}, keyNames = [], considerEmpty = false }) {
  keyNames = (keyNames && keyNames.length) ? keyNames : keys;

  return keys.reduce(
    (initial, key = '', index) => {
      const propValue = considerEmpty && primObj && primObj[key] === ''
        ? primObj[key]
        : (primObj && primObj[key]) || (secObj && secObj[key]);

      if (propValue !== undefined) {
        const keyName = keyNames[index];

        initial[keyName] = propValue;
      }

      return initial;
    }, {}
  );
}
