import isObject from './isObject';

/**
 * Clone just selected keys from an object
 * @param  {Object}    target Object that receives properties
 * @param  {Object}    source Clone from this object
 * @param  {...String} keys   List of keys to copy
 * @return {Object}           Mutated target object
 *
 * Sample:
 *   var a = {a: 1, b:2, c: 3, d:4};
 *   partial({}, a, 'a', 'b'); // Object {a: 1, b: 2}
 * or just
 *   partial(a, 'a', 'b'); // Object {a: 1, b: 2}
 */
export default function partialClone(target, source, ...keys) {
  if (!isObject(source)) {
    return partialClone.apply(null, [{}, ...arguments]); // eslint-disable-line prefer-rest-params
  }

  keys.forEach(key => target[key] = source[key]); // eslint-disable-line no-return-assign

  return target;
}
