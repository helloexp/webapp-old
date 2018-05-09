/*
 * CreditCard test data used for the test cases
 TODO
 * Need to update the test bed according to page modifications
 */

module.exports = {
  valid: [
    {
      type:            'creditCard',
      cardNumber:      '4484500000000005',
      cardType:        'visa',
      expirationMonth: '5',
      expirationYear:  '2020',
      cvv:             '123',
      cardHolder:      'Uniqlo'
    },
    {
      type:            'creditCard',
      cardNumber:      '4484500000000000',
      cardType:        'Visa',
      expirationMonth: '8',
      expirationYear:  '2018',
      cvv:             '125',
      cardHolder:      'Uniqlo'
    }
  ]
};
