import { createSelector } from 'reselect';
import { isTwoDigitsAndDecimalNumber, isDecimal } from 'utils/validation';

export const getSelectedSize = state => state.mySize.selected;

export const getSizes = state => state.mySize.sizes;

export const getSections = state => state.mySize.sections;

export const getTransactions = state => state.purchaseHistory && state.purchaseHistory.purchaseHistoryList || [];

export const getLoaded = state => state.mySize.loaded;

export const isMySizeValid = createSelector(
  [getSelectedSize],
  (mySize) => {
    let valid = true;
    const mySizeFields = Object.keys(mySize);

    mySizeFields.splice(mySizeFields.indexOf('size_id'), 1);
    mySizeFields.splice(mySizeFields.indexOf('cup_int'), 1);
    mySizeFields.splice(mySizeFields.indexOf('cup'), 1);
    mySizeFields.splice(mySizeFields.indexOf('size_title'), 1);

    if (!mySize.size_title) {
      valid = false;
    }

    return valid && mySizeFields.filter((field) => {
      if (mySize[field] !== '') {
        return ['inseam', 'foot'].includes(field)
          ? !isTwoDigitsAndDecimalNumber(mySize[field])
          : !isDecimal(mySize[field]);
      }

      return false;
    }).length === 0;
  }
);

export const checkIfAddNewUserButtonShown = createSelector(
  [getLoaded, getSizes],
  (loaded, sizes) => {
    const length = Object.keys(sizes).length;

    return !!(loaded && length && length < 10);
  }
);

export const areSizesAdded = createSelector(
  [getSizes],
  sizes => !!Object.keys(sizes).length);
