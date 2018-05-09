let Page = require('./page');
let testPrerequisites = require('../utilities/testPrerequisites');

/**
 * Delivery Page Object
 *
 * @class e2e/pages/ReviewOrderPage
 * @type {Page}
 */
let ReviewOrderPage = {

  /**
   * define elements
   */
  placeOrderButton: {get: function () {return browser.element('//button[contains(@class, "placeOrderButton")]');}},
  issueReceiptCheckbox: {get: function () {return browser.element('//label[@for="OrderSummarySegment"]');}},
  issueReceiptCheckboxLabel: {get: function () {return browser.element('//input[@id="OrderSummarySegment"]/..');}},
  giftingOptionEditButton: {get: function () {return browser.element('//div[contains(@class, "GiftPanel")]//button');}},
  giftingOptionAddButton: {get: function () {return browser.element('//div[contains(@class,"GiftPanel")]//a');}},
  editDeliveryButton: {get: function () { return browser.element('(//div[contains(@class, "headingWrapper")]//button)[1]');}},
  editPaymentMethosButton: {get: function () { return browser.element('(//div[contains(@class, "headingWrapper")]//button)[2]');}},
  alertChangeButton: {get: function () { return browser.element('//div[contains(@class, "stickyBoxFooter")]/button[2]');}},
  editShippingMethodButton: {get: function () { return browser.element('//button[@analytics-label="Change Address"]')}},
  editPaymentOptionButton: {value: function (index) {return browser.element(`(//div[contains(@class,"PaymentMethodTile")]//a[contains(@class,"editLink")])[${index}]`); }},
  editCreditCardBtn: {get: function () { return browser.element('(//div[contains(@class, "Container-z8")]//a)'); } },
  creditCardHeader: {value: function (text) { return browser.element(`//div[.="${text}"]`);}},
  otherCardBtn: {get: function () { return browser.element('//button[contains(@class, "otherCardBtn")]');}},
  couponPanel: {get: function () { return browser.element('//a[contains(@class, "couponReviewPanel")]');}},
  appliedCoupons: {get: function () { return browser.element('//div[contains(@class, "CouponPanel")]'); }},
  changeCouponButton: {get: function () { return browser.element('//div[contains(@class,"couponActivePanel")]//button');}},
  productCount:{get: function () { return browser.elements('//div[contains(@class, "cartPoints")]'); }},
  errorPanel: {get: function () { return browser.element('//div[contains(@class, "errorMessage")]'); }},
  atStorePopUp: {get: function () { return browser.element('(//button[contains(@class,"btnStyle")])[2]'); }},
  receiveInfo: {get: function () { return browser.element('//div[contains(@class,"cvsInfoHeadView")]'); }},
  deliveryStoreName: {get: function () { return browser.element('(//address[contains(@class, "AddressPanel-styles-address")]/div)[1]'); }},
  paymentStoreName: {get: function () { return browser.element('(//div[contains(@class, "Text-Text-blockText")])[3]'); }},
  /**
   * MiniBag
   */
  miniBagButton: {get: function () { return browser.element('//*[contains(@class, "miniBagCaret")]'); }},
  miniBagPriceDetails: {value: function (priceType) { return browser.element(`//div[contains(@class, "miniBagWrapper")]//div[contains(text(),"${priceType}")]/../div[contains(translate(@class, "ITEMPRC", "itemprc"),"itemprice")]`);}},
  miniBagChangeButton: {get: function () { return browser.element('//div[contains(@class,"itemsWrap")]//button[contains(@class,"footerBtn")]'); }},
  totalProductCount: {get: function () { return browser.element('//div[contains(@class, "count")]'); }},
  popUp: {get: function () { return browser.element('(//button[contains(@class,"btnStyle")])[2]'); }},
  receiptTootTipButton: {get: function () { return browser.element('(//a[contains(@class,"ProxyLink")])[1]'); }},
  FAQPageButton: {get: function () { return browser.element('(//a[contains(@class,"btn-question")])[1]'); }},
  /**
   * Overridden open function.
   *
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/checkout/order/review';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   *  Add the gifting option
   */
  addGiftingOption: {
    value: function () {
      browser.pause(1000);
      browser.waitForLoading();
      this.giftingOptionAddButton.waitForEnabled();
      this.giftingOptionAddButton.click();
    }
  },

  /**
   *  Validate Email in Review Order Page
   */
  validateEmailInOrderConfirmationPage: {
    value: function () {
    testPrerequisites.setLoginCookies();
    testPrerequisites.setCartCookies();
    let JSESSIONIDCookie = browser.params.JSESSIONIDCookie;
    let uniqloTokenCookie = browser.params.uniqloTokenCookie;

    let mcnuCookie = browser.params.mcnuCookie;
    let tvuCookie = browser.params.tvuCookie;
      browser.call(() => {
        return testPrerequisites.cart_id(JSESSIONIDCookie, mcnuCookie, tvuCookie).then((cartdetails) => {
          browser.params.update = cartdetails.upd_date;
         });
      })
      let update = browser.params.update;
      browser.call(() => {
        return testPrerequisites.order(JSESSIONIDCookie, mcnuCookie, tvuCookie, update).then((order) => {
          browser.params.hash_key = order.hash_key;
          browser.params.ord_no = order.ord_no;
          });
      })
      let orderno = browser.params.ord_no;
      let hash = browser.params.hash_key;
       browser.call(() => {
        return testPrerequisites.order_id(JSESSIONIDCookie, orderno, hash).then((orderDetails) => {
          expect(orderDetails.orderer_eml_id).to.be.equal(browser.params.featureContext.registeredUser.email);
          });
      })
    }
  },

  /**
   *  edit the gifting option
   */
  editGiftingOption: {
    value: function () {
      browser.pause(1000);
      browser.waitForLoading();
      this.giftingOptionEditButton.waitForEnabled();
      this.giftingOptionEditButton.click();
    }
  },

  /**
   * Enable/Disable Issue Recipt
   * @param {Boolean} enable true/false
   */
  enableDisableIssueReceipt: {
    value: function (enable) {
      this.issueReceiptCheckbox.waitForExist();
      this.issueReceiptCheckbox.moveToObject(0, 0);
      if ((this.issueReceiptCheckbox.getValue() === 'off' && enable) || (this.issueReceiptCheckbox.getValue() === 'on' && !enable)) {
        this.issueReceiptCheckboxLabel.click();
      }
    }
  },
  /**
   *  Issue Recipt
   */
  isIssueReceiptVisible: {
    value: function (isVisible) {
      expect(this.issueReceiptCheckbox.isVisible()).to.be.equal(isVisible);
    }
  },

  /**
   * Places the order
   *
   */
  placeOrder: {
    value: function () {
      this.placeOrderButton.waitForEnabled();
      browser.waitForLoading();
      this.placeOrderButton.click();
      if (this.atStorePopUp.isVisible()){
        this.atStorePopUp.click();
      }
    }
  },

  /**
   * Redirects to Order Review Page from any Page
   */
  gotoReviewOrder: {
    value: function () {
      browser.url('/checkout/order/review');
    }
  },

  /**
   * Validates Order Review URL
   */
  validateOrderReviewUrlPath: {
    value: function () {
      browser.urlValidation('/checkout/order/review');
    }
  },

  /**
   * Validates user is on Order Review page
   */
  isOnOrderReviewPage: {
    value: function () {
      this.placeOrderButton.waitForVisible();
    }
  },

  /**
   * Validates user is on Order Review page and check if edit buttons are not displayed in review page in case of concierge checkout
   */
  reviewOrderPageLoadsFineinConciergeAPP: {
    value: function () {
      this.placeOrderButton.waitForVisible();
      expect(this.editDeliveryButton.isVisible()).to.equal(false);
    }
  },

  /**
   * Go to delivery page by clicking edit delivery
   *
   */
  editDeliveryMethod: {
    value: function () {
      this.editDeliveryButton.waitForEnabled();
      browser.waitForLoading();
      this.editDeliveryButton.click();
      this.alertChangeButton.waitForEnabled();
      browser.waitForLoading();
      this.alertChangeButton.click();
    }
  },

  /**
   * GO to delivery page by clicking Edit Shipping method
   */
  editShippingMethod: {
    value: function() {
    this.editShippingMethodButton.waitForEnabled();
    browser.waitForLoading();
    this.editShippingMethodButton.click();
    this.popUp.waitForEnabled();
    this.popUp.click();
    }
  },

  /**
   * Go to payment page by clicking edit payment
   *
   */
  editPaymentMethod: {
    value: function () {
      this.editPaymentMethosButton.waitForEnabled();
      browser.waitForLoading();
      this.editPaymentMethosButton.click();
      this.alertChangeButton.waitForEnabled();
      browser.waitForLoading();
      this.alertChangeButton.click();
    }
  },

  /**
   *  edit the Payment method type
   */
  editPaymentOption: {
    value: function (payOptionIndex) {
      payOptionIndex = payOptionIndex || 1;
      this.editPaymentOptionButton(payOptionIndex).waitForEnabled();
      browser.waitForLoading();
      this.editPaymentOptionButton(payOptionIndex).click();
    }
  },

  /**
   * To open the coupon panel
   */
  openCouponPanel: {
    value: function () {
      browser.waitForLoading();
      this.couponPanel.waitForEnabled();
      this.couponPanel.click();
    }
  },

  /**
   * Validates the coupon applied
   * @params {String} coupon, applied coupon
   */
  validateAppliedCoupon: {
    value: function (couponName) {
      expect(this.appliedCoupons.getText()).to.include(couponName);
    }
  },

  /**
  * Changes or Deletes the Coupon
  */
  changeCoupon: {
    value: function () {
      this.changeCouponButton.click();
    }
  },

  /**
   * To Check whether the error message panel is visible with a message
   * @param {String} err, message to be displayed
   */
  validateReviewOrderError: {
    value: function (errorScenario) {
      this.placeOrderButton.waitForVisible();
      this.errorPanel.isVisible();
      expect(eval('i18n.' + errorScenario)).is.not.undefined;
      expect(this.errorPanel.getText()).to.include(eval('i18n.' + errorScenario));
    }
  },

  /**
   * edits credit card
   */
  editCreditCardButton: {
    value: function () {
      this.editCreditCardBtn.waitForEnabled();
      browser.waitForLoading();
      this.editCreditCardBtn.click();
      this.otherCardBtn.waitForEnabled();
      browser.waitForLoading();
      this.otherCardBtn.click();
    }
  },

  /**
   * Validates whether credit card is present or not
   */
   isCreditCardPresent: {
    value: function (isVisible) {
      let cardTile = i18n.validationCreditCard.cardTile;
      expect(this.creditCardHeader(cardTile).isVisible()).to.be.equal(isVisible);
    }
   },

  /**
   * validates the product count in cart page with review order page
   */
  validateCartProductCountWithReviewOrder: {
    value: function (totalCount) {
      let count = 0;
      this.productCount.value.forEach((prod) => {
        count += parseInt((prod.getText().match(/\d+/g) || ['0']).join(''));
      });

      expect(count).to.equal(totalCount);
    }
  },

  /**
   *  Open the mini bag
   */
  openMiniBagOption: {
    value: function () {
      this.miniBagButton.waitForEnabled();
      browser.waitForLoading();
      this.miniBagButton.click();
    }
  },

  /**
   *  close the mini bag
   */
  closeMiniBagOption: {
    value: function () {
      this.miniBagButton.click();
    }
  },

  /**
   * Validates Gift fee amount is 150 Yen
   */
  validateGiftAmount: {
    value: function (giftingOption) {
      this.miniBagPriceDetails(i18n.priceDetails.giftFee).waitForVisible();
      expect(this.miniBagPriceDetails(i18n.priceDetails.giftFee).getText()).to.include(giftingOption.amount);
    }
  },

  /**
   * Validates Coupon deduction amount equals coupon value
   */
  validateCouponAmount: {
    value: function (couponAmount) {
      this.miniBagPriceDetails(i18n.priceDetails.coupon).waitForVisible();
      expect(this.miniBagPriceDetails(i18n.priceDetails.coupon).getText()).to.include(couponAmount);
    }
  },

  /**
   * Validates price details on Mini Bag
   *
   * @param {Object} priceDetails
   * @param {String} priceDetails.totalMerchandise
   * @param {String} priceDetails.correctionFee
   * @param {String} priceDetails.saleTax
   * @param {String} priceDetails.fengShiAmount
   * @param {String} priceDetails.totalTaxIncluded
   */
  validatePriceDetails: {
    value: function (priceDetails, paymentMethod) {
      this.miniBagPriceDetails(i18n.priceDetails.totalTaxIncluded).waitForVisible();
      let totalPrice = parseInt((this.miniBagPriceDetails(i18n.priceDetails.totalTaxIncluded).getText().match(/\d+/g) || ['0']).join(''));

      expect(this.miniBagPriceDetails(i18n.priceDetails.totalMerchandise).getText()).to.include(priceDetails.totalMerchandise);
      if (priceDetails.totalTaxIncluded) {
        expect(this.miniBagPriceDetails(i18n.priceDetails.totalTaxIncluded).getText()).to.include(priceDetails.totalTaxIncluded);
      }
      if (priceDetails.correctionFee) {
        expect(this.miniBagPriceDetails(i18n.priceDetails.correctionFee).getText()).to.include(priceDetails.correctionFee);
      }
      if (priceDetails.saleTax) {
        // expect(this.miniBagPriceDetails(i18n.priceDetails.saleTax).getText()).to.include(priceDetails.saleTax);
      }
      if (priceDetails.fengShiAmount && totalPrice % 5 !== 0) {
        expect(this.miniBagPriceDetails(i18n.priceDetails.fengShiAmountText).getText()).to.include(priceDetails.fengShiAmount);
      }
      if (priceDetails.giftingAmountText) {
        expect(this.miniBagPriceDetails(i18n.priceDetails.giftFee).getText()).to.include(priceDetails.giftFee);
      }
      if (paymentMethod.type === 'giftcard'){
          expect(this.miniBagPriceDetails(i18n.priceDetails.giftCard).getText()).to.equal(paymentMethod.amount);
      }
    }
  },

  /**
   *  To edit the cart details from mini bag
   */
  changeQuantityMiniBag: {
    value: function () {
      this.miniBagChangeButton.waitForEnabled();
      this.miniBagChangeButton.click();
    }
  },

  /**
   * validates the product count in cart page with mini bag
   */
  validateCartProductCountWithMiniBag: {
    value: function (productCount) {
      this.totalProductCount.waitForVisible();
      expect(parseInt((this.totalProductCount.getText().match(/\d+/g) || ['0']).join(''))).to.equal(productCount);
    }
  },

  /**
   * Dismiss the pop-up when change button is pressed with unsaved credit card
   */
  dismissPopUp: {
    value: function () {
      this.popUp.waitForEnabled();
      this.popUp.click();
    }
  },

  receiptTootTip: {
    value: function () {
      this.receiptTootTipButton.waitForVisible();
      this.receiptTootTipButton.moveToObject(0, 0);
      browser.newWindow(this.receiptTootTipButton.getAttribute('href'));
      browser.pause(5000);
    }
  },

  validateFAQPage: {
    value: function () {
      var url = browser.url();
      expect(url.value).to.include("https://faq.uniqlo.com");
      this.FAQPageButton.waitForVisible();
      browser.close();
    }
  },

  validateHowToRecieveFromMinistop: {
    value: function () {
      this.receiveInfo.waitForVisible();
       expect(this.receiveInfo.getAttribute('innerText')).to.include(i18n.ministopStore);
    }
  },

  validateStoreStaffPickupAndPaymentDetails: {
    value: function () {
      browser.waitForLoading();
      expect(this.deliveryStoreName.getText()).to.equal(this.paymentStoreName.getText());
    }
  },
  
};

module.exports = Object.create(Page, ReviewOrderPage);
