import cx from 'classnames';
import ImmutabilityHelper from '../utils/immutabilityHelper';

// Moved this function to ImmutabilityHelper.merge
export function mergeStyles() {
  return ImmutabilityHelper.merge.apply(this, arguments);  // eslint-disable-line prefer-rest-params
}

export function mergeClasses(...rest) {
  return cx(...rest);
}
