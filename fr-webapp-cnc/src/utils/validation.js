import { TWO_DIGITS_AND_DECIMAL_NUMBER, DECIMAL_NUMBER, NUMBER, ALPHA_SPACE, VALID_CREDIT_CARD, STORE_STAFF_EMAIL } from 'helpers/regex';

const isEmpty = value => value === undefined || value === null || value === '';

export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }

  return undefined;
}

export function isTwoDigitsAndDecimalNumber(value) {
  return TWO_DIGITS_AND_DECIMAL_NUMBER.test(value);
}

export function isDecimal(value) {
  return DECIMAL_NUMBER.test(value);
}

export function isNumber(value) {
  return NUMBER.test(value);
}

export function alphaWithSpace(value) {
  return !!value && ALPHA_SPACE.test(value);
}

export function isValidCreditCardNumber(value) {
  return VALID_CREDIT_CARD.test(value);
}

export function isValidCreditCard(creditCard = {}) {
  const cardFields = Object.keys(creditCard);
  // rules for enabling credit card form submit button.
  const allDigits = creditCard.ccLastFourDigits && creditCard.ccLastFourDigits.length <= 16;
  const ccRules = allDigits
    && (creditCard && creditCard.ccLastFourDigits && isValidCreditCardNumber(creditCard.ccLastFourDigits))
    && (creditCard && creditCard.cardType)
    && (creditCard && creditCard.cardCvv && creditCard.cardCvv.length > 2 && isNumber(creditCard.cardCvv))
    && (creditCard && creditCard.name && alphaWithSpace(creditCard.name));

  return !(cardFields.length < 6 || cardFields.some(field => required(creditCard[field]))) && ccRules;
}

export function isStoreStaffEmail(email) {
  return STORE_STAFF_EMAIL.test(email);
}
