let Page = require('./page');

/**
 * Login Page Object
 *
 * @class e2e/pages/LoginPage
 * @type {Page}
 */
let LoginPage = {
  /**
   * define elements
   */
  username: { get: function () { return browser.element('//input[@name="login_id"]'); } },
  password: { get: function () { return browser.element('//input[@name="password"]'); } },
  loginButton: { get: function () { return browser.element('//div[@class="button-box"]'); } },
  newMemberRegistrationButton: {get: function () { return browser.element('//div[contains(@class,"card-box")][2]//input[@type="submit"]');}},

  /**
   * Overridden open function.
   * Opens /login application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/login';
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
   */
  fillForm: {
    value: function (user) {
      this.username.waitForVisible();
      browser.pause(2000);
      this.username.setValue(user.email);
      this.password.setValue(user.password);
    }
  },

  /**
   * Clicks login button
   */
  submit: {
    value: function () {
      this.loginButton.waitForEnabled();
      this.loginButton.click();
    }
  },

  /**
   * Clicks on New Member Registration button
   */
  goToRegistration: {
    value: function () {
      browser.waitForLoading();
      this.newMemberRegistrationButton.waitForEnabled();
      browser.pause(1000);
      const newMemberRegistrationButtonPos = browser.elementIdLocation(this.newMemberRegistrationButton.value.ELEMENT);
      browser.scroll(newMemberRegistrationButtonPos.value.x, newMemberRegistrationButtonPos.value.y);
      this.newMemberRegistrationButton.click();
    }
  },

  /**
   * To Validate the Login Url
   */
  validateLoginUrlPath: {
    value: function () {
      browser.urlValidation('/auth/login');
    }
  }
};

module.exports = Object.create(Page, LoginPage);
