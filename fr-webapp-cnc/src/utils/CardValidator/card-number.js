// logic is taken from card-validator
// Ref: https://www.npmjs.com/package/card-validator
const luhn10 = require('./luhn-10');
const getCardTypes = require('./credit-card-type');

const NUMBER_REGEX = /^\d*$/;

function verification(card, isPotentiallyValid, isValid) {
  return { card, isPotentiallyValid, isValid };
}

function cardNumber(value) {
  let number = String(value);
  let isPotentiallyValid;
  let isValid;

  const potentialTypes = getCardTypes(number);
  const cardType = potentialTypes[0] || {};
  const maxLength = Math.max.apply(null, cardType.lengths);

  number = number.replace(/-|\s/g, '');

  if (!NUMBER_REGEX.test(number)) {
    return verification(null, false, false);
  }

  if (potentialTypes.length === 0) {
    return verification(null, false, false);
  } else if (potentialTypes.length !== 1) {
    return verification(null, true, false);
  }

  // UnionPay is not Luhn 10 compliant
  if (cardType.type === 'unionpay') {
    isValid = true;
  } else {
    isValid = luhn10(parseInt(number, 10)) || luhn10(number);
  }

  for (let count = 0; count < cardType.lengths.length; count++) {
    if (cardType.lengths[count] === number.length) {
      isPotentiallyValid = (number.length !== maxLength) || isValid;

      return verification(cardType, isPotentiallyValid, isValid);
    }
  }

  return verification(cardType, number.length < maxLength, false);
}

module.exports = cardNumber;
