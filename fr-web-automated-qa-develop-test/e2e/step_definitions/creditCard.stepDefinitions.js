let creditCardPage  = require('../pages/creditCard.page');
let creditCardList = require('../data/creditCard');

module.exports = function () {
 
  this.Then(/^User registers new credit card from credit card page$/, () => {
 	  let creditcard = creditCardList.valid[0];
 	  creditCardPage.addNewCreditCard();
 	  creditCardPage.fillCreditCardForm(creditcard);
	  creditCardPage.registerCreditCard();
    browser.params.featureContext.paymentMethods.push(creditcard);
  });
  
  this.When(/^User changes the existing credit card from credit card page$/, () => {
    let creditcard = creditCardList.valid[1];
	  creditCardPage.changeCreditCardDetails(creditcard);
	  creditCardPage.registerCreditCard();
  });

  this.Then(/^The credit card is successfully registered$/, () => {
  	creditCardPage.validateCreditCardRegistration();
  });

};
