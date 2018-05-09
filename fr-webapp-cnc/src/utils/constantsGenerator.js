/**
 * Constants set generator factory
 * @example
 * // returns {
 * //   SOME_ACTION: "MY_BASE/SOME_ACTION",
 * //   SOME_ACTION_SUCCESS: "MY_BASE/SOME_ACTION_S",
 * //   SOME_ACTION_FAIL: "MY_BASE/SOME_ACTION_F"
 * // }
 *
 * const generateConstants = constantsGenerator('MY_BASE');
 * const { SOME_ACTION, SOME_ACTION_SUCCESS, SOME_ACTION_FAIL } = generateConstants('SOME_ACTION');
 *
 * @param {string} base
 */
export default function constantsGenerator(base) {
  /**
   * Constants set generator
   * @param {string} name - constant base name
   * @returns {Object<string, string>}
   */
  return name => ({
    [name]: `${base}/${name}`,
    [`${name}_SUCCESS`]: `${base}/${name}_S`,
    [`${name}_FAIL`]: `${base}/${name}_F`,
  });
}
