// logic is taken from card-validator
// Ref: https://www.npmjs.com/package/card-validator
const types = [
  {
    niceType: 'Visa',
    type: 'visa',
    regex: /^4\d*$/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVV',
      size: 2,
    },
  },
  {
    niceType: 'MasterCard',
    type: 'master-card',
    regex: /^5([1-5]\d*)?$/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVC',
      size: 2,
    },
  },
  {
    niceType: 'American Express',
    type: 'american-express',
    regex: /^3([47]\d*)?$/,
    isAmex: true,
    gaps: [4, 10],
    lengths: [15],
    code: {
      name: 'CID',
      size: 2,
    },
  },
  {
    niceType: 'Diners Club',
    type: 'diners-club',
    regex: /^3((0([0-5]\d*)?)|[689]\d*)?$/,
    gaps: [4, 10],
    lengths: [14],
    code: {
      name: 'CVV',
      size: 2,
    },
  },
  {
    niceType: 'Discover',
    type: 'discover',
    regex: /^6(0|01|011\d*|5\d*|4|4[4-9]\d*)?$/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CID',
      size: 2,
    },
  },
  {
    niceType: 'JCB',
    type: 'jcb',
    regex: /^((2|21|213|2131\d*)|(1|18|180|1800\d*)|(3|35\d*))$/,
    gaps: [4, 8, 12],
    lengths: [16],
    code: {
      name: 'CVV',
      size: 2,
    },
  },
  {
    niceType: 'UnionPay',
    type: 'unionpay',
    regex: /^6(2\d*)?$/,
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
      name: 'CVN',
      size: 2,
    },
  },
  {
    niceType: 'Maestro',
    type: 'maestro',
    regex: /^((5((0|[6-9])\d*)?)|(6|6[37]\d*))$/,
    gaps: [4, 8, 12],
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    code: {
      name: 'CVC',
      size: 2,
    },
  },
];

module.exports = function getCardTypes(cardNumber) {
  if (cardNumber === '') { return types; }

  // the customer credit card number getting from API,
  // will have ****s in the middle to hide the actual number.
  // Replacing those ***s with 000s to get correct card type.
  const realCardNumber = cardNumber.replace(/\*/g, '0');
  const result = types.reduce((prevVal, value) => {
    if (value.regex.test(realCardNumber)) {
      prevVal.push(value);
    }

    return prevVal;
  }, []);

  return result;
};
