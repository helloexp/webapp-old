let Page = require('./page');

/**
 * Registration Page Object
 *
 * @class e2e/pages/RegistrationPage
 * @type {Page}
 */
let RegistrationPage = {
  /**
   * define elements
   */
  emailField: { get: function () { return browser.element('//input[@name="email"]'); } },
  passwordField: { get: function () { return browser.element('//input[@name="password"]'); } },
  zipButton: {get: function() { return browser.element('//div[contains(@class,"postalcode__wrapper")]'); }},
  zipField: {get: function() { return browser.element('//input[@name="zipCode"]'); } },
  yearSelector: {get: function() { return browser.element('//select[@name="birthday[year]"]'); } },
  monthSelector: {get: function() { return browser.element('//select[@name="birthday[month]"]'); } },
  daySelector: {get: function() { return browser.element('//select[@name="birthday[date]"]'); } },
  submitButton: { get: function () { return browser.element('//input[@type="submit"]'); } },

  /**
   * Overridden open function.
   * Opens /member/registry application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/member/registry';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   * Fills login form
   *
   * @param {Object} user
   * User object used for login
   * @param {String} user.email
   * User email
   * @param {String} user.password
   * User password
   * @param {String} user.zip
   * User zip
   * @param {String} user.year
   * User year
   * @param {String} user.month
   * User month
   * @param {String} user.day
   * User day
   */
  fillForm: {
    value: function (user) {
      this.emailField.waitForVisible();
      browser.pause(1000);
      this.emailField.setValue(user.email);
      this.passwordField.setValue(user.password);
      this.zipButton.click();
      this.zipField.setValue(user.zip);
      this.yearSelector.selectByValue(user.year);
      this.monthSelector.selectByValue(user.month);
      this.daySelector.selectByValue(user.day);

    }
  },

  /**
   * Clicks Agree and Submit button
   */
  submit: {
    value: function () {
      this.submitButton.waitForEnabled();
      this.submitButton.click();
    }
  }
};

module.exports = Object.create(Page, RegistrationPage);
