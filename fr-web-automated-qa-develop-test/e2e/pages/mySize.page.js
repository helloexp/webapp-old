let Page = require('./page');

/**
 * Account Page Object
 *
 * @class e2e/pages/AccountPage
 * @type {Page}
 */

let MySizePage = {

  /**
   * define elements
   */
  newMySizeName: {get: function () { return browser.element('//div[contains(@class, "drawerBody")]//input');}},
  mySizeCreateButton: {get: function () { return browser.element('//div[contains(@class, "drawerBody")]/button');}},
  mySizeFields: {value: function (text) {return browser.element(`//label[contains(., "${text}")]//following-sibling::div/input`); }},
  mySizeFieldCupSize: {value: function (text, index) {return browser.element(`(//label[contains(., "${text}")]/../..//select)[${index}]`); }},
  mySizeDetails: {value: function (text) {return browser.element(`//dt[contains(., "${text}")]/../dd`); }},
  mySizeErrorToolTip: {value: function (elm, text) {return browser.element(`//label[contains(., "${elm}")]/span[contains(., "${text}")]`); }},
  mySizeButton: {value: function (text) {return browser.element(`//button[contains(., "${text}")]`); }},
  confirmationMessage: {value: function (text) {return browser.element(`//div[contains(., "${text}")]`); }},

  /**
   * Overridden open function.
   * Opens / application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/mysize/view';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   * Validates My Size creation button
   */
  validateMySizeCreation: {
    value: function () {
      this.newMySizeName.waitForEnabled();
      expect(this.mySizeCreateButton.isEnabled()).to.equal(false);
      this.newMySizeName.addValue('dummy');
      expect(this.mySizeCreateButton.isEnabled()).to.equal(true);
    }
  },

  /**
   * Create a new my size
   * @params {Object} mySizeData, New My Size Details
   */
  createNewMySize: {
    value: function (mySizeData) {
      browser.params.featureContext.mySizedetails = mySizeData;
      this.newMySizeName.waitForEnabled();
      this.newMySizeName.setValue(mySizeData.name);
      this.mySizeCreateButton.click();
    }
  },

  /**
   * Fill New My Size Details
   */
  fillMySizeFields: {
    value: function () {
      const mySizeData = browser.params.featureContext.mySizedetails;
      Object.keys(i18n.mySize.attributes).forEach((item) => {
        if(item === 'cupSize') {
          this.mySizeFieldCupSize(i18n.mySize.attributes[item], 1).selectByValue(mySizeData[item][0]);
          this.mySizeFieldCupSize(i18n.mySize.attributes[item], 2).selectByValue(mySizeData[item][1]);
        } else {
          this.mySizeFields(i18n.mySize.attributes[item]).setValue(mySizeData[item]);
        }
      });
    }
  },

  /**
   * Validates My Size Fields
   */
  validateMySizeFields: {
    value: function () {
      const mySizeData = browser.params.featureContext.mySizedetails;
      Object.keys(i18n.mySize.attributes).forEach((item) => {
        if(item !== 'cupSize') {
          this.mySizeFields(i18n.mySize.attributes[item]).setValue('9999');
          this.mySizeErrorToolTip(i18n.mySize.attributes[item], i18n.mySize.numberCountErrorMessage).isVisible();
          this.mySizeFields(i18n.mySize.attributes[item]).setValue('');
        }
      });
    }
  },

  /**
   * Submit My Size Form
   */
  submitMySizeForm: {
    value: function () {
      const btn = i18n.mySize.submitMySizeForm;
      this.mySizeButton(btn).waitForEnabled();
      this.mySizeButton(btn).click();
    }
  },

  /**
   * Validates My Size Details Entered
   */
  validateMySizeDetails: {
    value: function () {
      const mySizeData = browser.params.featureContext.mySizedetails;
      Object.keys(i18n.mySize.attributes).forEach((item) => {
        if(item !== 'cupSize') {
          expect(this.mySizeDetails(i18n.mySize.attributes[item]).getText()).to.include(mySizeData[item]);
        }
      });
    }
  },

  /**
   * Confirms My Size details
   */
  confirmsMySizeDetails: {
    value: function () {
      const btn = i18n.mySize.confirmMySizeForm;
      this.mySizeButton(btn).waitForEnabled();
      this.mySizeButton(btn).click();
    }
  },

  /**
   * Validates My Size confirmation message
   */
  validateMySizeConfirmation: {
    value: function () {
      this.confirmationMessage(i18n.mySize.confirmationMessage).isVisible();
    }
  },

  /**
   * Validates whether My Size Submit button is disabled with invalid data
   */
  submitButtonDisabled: {
    value: function () {
      const btn = i18n.mySize.submitMySizeForm;
      expect(this.mySizeButton(btn).isEnabled()).to.equal(false);
    }
  }
};

module.exports = Object.create(Page, MySizePage);
