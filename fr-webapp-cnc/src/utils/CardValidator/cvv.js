const DEFAULT_LENGTH = 2;

function verification(isValid, isPotentiallyValid) {
  return { isValid, isPotentiallyValid };
}

function cvv(value, _minLength) {
  let minLength = _minLength || DEFAULT_LENGTH;

  minLength = Array.isArray(minLength) ? minLength : [minLength];

  if (!(/^\d*$/).test(value)) {
    return verification(false, false);
  }

  /**
   * If the CVV field has less than the min length then show warning.
   */
  if (value.length <= Math.max.apply(null, minLength)) {
    return verification(false, false);
  }

  return verification(true, true);
}

module.exports = cvv;
