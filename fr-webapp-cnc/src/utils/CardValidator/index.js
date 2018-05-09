const cardNumber = require('./card-number');
const cvvNumber = require('./cvv');
const cardType = require('./credit-card-type');

module.exports = {
  number: cardNumber,
  cvv: cvvNumber,
  crediCardType: cardType,
};
