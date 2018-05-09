let Page = require('./page');
/**
 * Coupon Page
 *
 * @class e2e/pages/couponPage
 */
let CouponPage = {

  chooseCouponButton: {value: function (t) { return browser.element(`//div[contains(@class, "CouponList") and contains(.,"${t}")]//button`); }},
  couponNameInput: {get: function () { return browser.element('//div[contains(@class,"couponForm")]//input'); }},
  couponApplyButton: {get: function () { return browser.element('//div[contains(@class,"couponForm")]//button'); }},
  closeCouponPage: {get: function () { return browser.element('//button[contains(@class,"noMarginClose")]');}},
  /**
   * To select a coupon from the list
   * @params {String} couponName, coupon name to be selected
   */
  selectCouponFromList: {
    value: function (couponName) {
      this.chooseCouponButton(couponName).waitForEnabled();
      this.chooseCouponButton(couponName).click();
    }
  },

  /**
   * Add coupon by name
   * @params {String} couponName, coupon name to be added
   */
  addCouponByName: {
    value: function (couponName) {
      this.couponNameInput.waitForVisible();
      this.couponNameInput.setValue(couponName);
      this.couponApplyButton.waitForEnabled();
      this.couponApplyButton.click();
      browser.waitForLoading();
      browser.pause(2000); // There is an API call here
    }
  },

  /**
   * Deletes the applied coupon
   */

  deleteCoupon: {
    value: function () {
      this.couponNameInput.waitForVisible();
      this.couponNameInput.click();
      this.couponNameInput.keys('\uE009'+ 'A');
      this.couponNameInput.keys('\uE003');
      this.couponApplyButton.waitForEnabled();
      this.couponApplyButton.click();
      browser.waitForLoading();
      this.closeCouponPage.waitForEnabled();
      this.closeCouponPage.click();
    }
  }

};

module.exports = Object.create(Page, CouponPage);
