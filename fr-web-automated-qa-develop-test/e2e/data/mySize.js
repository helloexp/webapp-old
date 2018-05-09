/*
 * CreditCard test data used for the test cases
 TODO
 * Need to update the test bed according to page modifications
 */

module.exports = {
  valid:   {
    name:    'automation' + new Date().getTime(),
    height: 10,
    weight: 10,
    head: 10,
    neck: 10,
    shoulder: 10,
    dressLength: 10,
    sleeve: 10,
    sleeveBack: 10,
    chest: 10,
    bustTop: 10,
    bustUnder: 10,
    cupSize: ['B' , 65],
    waist: 10,
    hip: 10,
    inseam: 10,
    footSize: 10,
  },
  invalid: {
    name:    'automation' + new Date().getTime(),
    height: '9999.99',
    weight: '9999.99',
    head: '9999.99',
    neck: '9999.99',
    shoulder: '9999.99',
    dressLength: '9999.99',
    sleeve: '9999.99',
    sleeveBack: '9999.99',
    chest: '9999.99',
    bustTop: '9999.99',
    bustUnder: '9999.99',
    cupSize: ['B' , 65],
    waist: '9999.99',
    hip: '9999.99',
    inseam: '9999.99',
    footSize: '9999.99',
  }
};
