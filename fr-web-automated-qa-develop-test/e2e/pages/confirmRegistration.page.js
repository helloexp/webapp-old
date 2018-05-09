let Page = require('./page');

/**
 * ConfirmRegistration Page Object
 *
 * @class e2e/pages/ConfirmRegistrationPage
 * @type {Page}
 */
let ConfirmRegistrationPage = {
  /**
   * define elements
   */

  submitButton: { get: function () { return browser.element('//input[@name="submitForward"]'); } },

  /**
   * Overridden open function.
   * Opens /member/registry/confirmation application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/member/registry/confirmation';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   * Clicks Register button
   */
  submit: {
    value: function () {
      browser.pause(1000);
      this.submitButton.waitForEnabled();
      this.submitButton.click();
    }
  }
};

module.exports = Object.create(Page, ConfirmRegistrationPage);
