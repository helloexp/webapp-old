let Page = require('./page');

/**
 * Credit Card Page Object
 *
 * @class e2e/pages/CreditCardPage
 * @type {Page}
 */

let CreditCardPage = {

  /**
   * define elements
   */

  changeCreditCardDetailsButton: {get: function () {return browser.element('//div[contains(@class,"editCreditCardContainer")]//button[contains(@class,"SavedCreditCard")]');}},
  addnewCreditCardButton: {get: function () {return browser.element('//button[contains(@class,"addButton")]');}},
  backToAccountPageButton: {get: function () { return browser.element('//button[contains(@class,"backButton")]');}},
  removeExistingCreditCardButton: {get: function () { return browser.element('//div[contains(@class,"removeCreditCardCell")]');}},
  popUpCancelButton: {get: function () { return browser.element('//button[contains(@class,"MessageBox")][1]');}},
  popUpConfirmButton: {get: function () { return browser.element('//button[contains(@class,"MessageBox")][2]');}},
  confirmCreditCardButton: {get: function () { return browser.element('//button[contains(@class,"acceptBtn")]');}},
  cancelCreditCardButton: {get: function () { return browser.element('//button[contains(@class,"cancelBtn")]');}},
  returnToInputButton: {get: function () { return browser.element('//button[contains(@class, "boldWithBorder")]');}},
  confirmRegistrationButton: {get: function () { return browser.element('//button[contains(@class, "undefined")]');}},
  backToCreditCardInfoButton: {get: function () { return browser.element('//button[contains(@class, "backButton")]');}},
  registrationCompleted: {get: function () { return browser.element('//div[contains(@class,"YBO8W")]');}},
  cardNumber: {get: function () { return browser.element('//input[@name="card"]');}},
  expiryMonth: {get: function () { return browser.element('//select[@name="expMonth"]');}},
  expiryYear: {get: function () { return browser.element('//select[@name="expYear"]');}},
  cvv: {get: function () { return browser.element('//input[@name="cvv"]');}},
  cardHolder: {get: function () { return browser.element('//input[@name="name"]');}},

  /**
   * Overridden open function.
   * Opens / application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/creditcards';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   * Adds new gift card
   */
  addNewCreditCard: {
  	value: function () {
  	  this.addnewCreditCardButton.waitForEnabled();
  	  this.addnewCreditCardButton.click();
  	}
  },

  /**
   * Confirms Registration of the Credit Card
   */
  registerCreditCard: {
    value: function () {
      this.confirmCreditCardButton.waitForEnabled();
      this.confirmCreditCardButton.click();
      this.confirmRegistrationButton.waitForEnabled();
      this.confirmRegistrationButton.click();
    }
  },

  /**
   * Update/Change the Credit Card details
   */
  changeCreditCardDetails: {
  	value: function (creditCardDetails) {
      this.changeCreditCardDetailsButton.waitForVisible();
      this.changeCreditCardDetailsButton.click();
  	  this.fillCreditCardForm(creditCardDetails);
      this.registerCreditCard();
  	}
  },

  /**
   * Fills credit card form
   *
   * @param {Object} creditCardDetails
   * @param {String} creditCardDetails.cardNumber
   * @param {String} creditCardDetails.expiryMonth
   * @param {String} creditCardDetails.expiryYear
   * @param {String} creditCardDetails.cvv
   * @param {String} creditCardDetails.cardHolder
  */
  fillCreditCardForm: {
    value: function (creditCardDetails) {
      this.cardNumber.waitForEnabled();
      this.cardNumber.setValue(creditCardDetails.cardNumber);
      this.expiryMonth.selectByValue(creditCardDetails.expirationMonth);
      this.expiryYear.selectByValue(creditCardDetails.expirationYear);
      this.cvv.setValue(creditCardDetails.cvv);
      this.cardHolder.setValue(creditCardDetails.cardHolder);
    }
  },

  /**
   * Validate the successful registration of credit card
   */
  validateCreditCardRegistration: {
  	value: function () {
      browser.waitForLoading();
   		expect(this.registrationCompleted.isVisible()).to.equal(true);
  	}
  }
};

module.exports = Object.create(Page, CreditCardPage);
