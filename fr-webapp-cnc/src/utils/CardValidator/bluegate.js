
/**
 * This method checks if the giving credit card is saved on bluegate,
 * it will check for the card number and dbKey, this data will come from GDS.
 *
 * @param {Object} card The credit card object from GDS
 * @return {Boolean} True if credit card is saved on bluegate
 */
export function isCreditCardSaved(card) {
  return !!(card && card.maskedCardNo && card.dbKey);
}
