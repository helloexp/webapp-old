let Page = require('./page');

/**
 * Confirmation Page Object
 *
 * @class e2e/pages/ConfirmationPage
 * @type {Page}
 */
let ConfirmationPage = {

  /**
   * define elements
   */
  orderConfirmationTitle: { get: function () { return browser.element('//h3[contains(@class,"confirmationTitle")]');} },
  orderConfirmationMessage: { get: function () { return browser.element('//div[contains(@class,"confirmationMessage")]/..');} },
  orderNumber: { value: function (ordNum) { return browser.element(`//*[contains(.,"${ordNum}")]`);} },
  orderConfirmationMessagePayInStore: { get: function () { return browser.element('//h4[contains(@class,"ConfirmOrder") and contains(@class,"titleWithColor")]');} },
  storeOrderConfirmNumber: { get: function () { return browser.element('//div[contains(@class, "orderConfirmWrap")]//a//div[contains(@class,"ConfirmStore")]'); } },
  giftingDetailOptionType: { get: function () { return browser.element('(//div[contains(@class,"giftPanelConfirmation")]//div[contains(@class,"panelBody")]/div)[1]'); } },
  giftingDetailMessage: { get: function () { return browser.element('//div[contains(@class,"messageBox")]'); } },
  orderNumberDetails: { value: function (ordNo) { return browser.element(`//a[contains(.,"${ordNo}")]`); } },
  cancelButtonInDetails: { get: function () { return browser.element('//button[contains(@class,"cancelButtonInDetails")]'); } },
  confirmCancelOrderButton: {get: function() { return browser.element('//button[contains(@class,"cancelOrderButton")]'); }},
  cancelMessage: { value: function (mesg) { return browser.element(`//*[contains(.,"${mesg}")]`); } },
  confirmOrderHistory: {get: function () { return browser.element('//*[contains(@class,"Checkout-ConfirmOrder-styles-orderHistoryButton")][1]');} },
  orderHistoryButton: {get: function () { return browser.element('//button[@analytics-label="Check order list"]');} },
  customerInformationLink:{ value: function (textmsg) { return browser.element('//button[contains(.,"${textmsg}")]'); } },
  alertMessage:{ get: function () { return browser.element('//span[contains(@class,"iconClose")]'); } },
 
   /**
   * Overridden open function.
   * Opens / application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/checkout/order/confirmation';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path); // TODO
    }
  },

  /**
   * Navigates to Order History page
   */
  goToOrderHistoryPage: {
    value: function () {
      browser.waitForLoading();
      let payment = browser.params.featureContext.paymentMethods;
      var Url = browser.getUrl();
      browser.url(Url.replace('https://test3.uniqlo.com','http://dev.uniqlo.com:3000'));
      if (this.alertMessage.isVisible()) {
        const alertPos = browser.elementIdLocation(this.alertMessage.value.ELEMENT);
        browser.scroll(alertPos.value.x - 15, alertPos.value.y - 15);
        this.alertMessage.click();
      }
      if(payment[0].type === 'atstore') {
        this.confirmOrderHistory.waitForEnabled();
        this.confirmOrderHistory.click();
      }      
        this.orderHistoryButton.waitForEnabled();
        this.orderHistoryButton.click();
    }
  },

  /**
   * Validates that the Confirmation message for successful order is present on the Order Confirmation page
   */
  validateOrderConfirmationMessage: {
    value: function (confirmationMessage) {
      this.orderConfirmationTitle.waitForVisible();
      expect(this.orderConfirmationMessage.getAttribute('innerText')).to.include(confirmationMessage);
    }
  },

  /**
   * Validates that the Confirmation message on Pay in store for successful order is present on the Order Confirmation page
   */
  validatePayInStoreOrderConfirmationMessage: {
    value: function (confirmationMessage) {
      this.orderConfirmationMessagePayInStore.waitForVisible();
      expect(this.orderConfirmationMessagePayInStore.getAttribute('innerText')).to.include(confirmationMessage);
    }
  },

  /**
   * Validates that the Order Number is present on the Order Confirmation page
   */
  validateOrderNumberIsPresent: {
    value: function () {
      this.orderNumber.waitForVisible();
      expect(this.orderNumber.getAttribute('innerText')).to.exist; //new RegExp('(: #|: # )([0-9])\w+-([0-9])\w+') Regex not working at the moment
    }
  },

  /**
   * Validates that the Uniqlo Store Order Number is present on the Order Confirmation page
   */
  validateStoreOrderNumberIsPresent: {
    value: function () {
      this.storeOrderConfirmNumber.waitForVisible();
      expect(this.storeOrderConfirmNumber.getAttribute('innerText')).to.exist; //new RegExp('(: #|: # )([0-9])\w+-([0-9])\w+') Regex not working at the moment
    }
  },
  /**
   * Validates that the Order Number is valid in the Order Confirmation page
   */
  validateStoreOrderNumberIsValid: {
    value: function (orderNumber) {
      expect(this.storeOrderConfirmNumber.getAttribute('innerText')).to.include(orderNumber);
    }
  },

  /**
   * Validates that the Order Number is defined (for credit cards)
   */
  validateOrderNumberIsSameASCookie: {
    value: function (ordNo) {
      browser.waitForLoading();
      this.orderNumber(ordNo).isVisible();
    }
  },

  /**
   * Validates that the Order Number is valid in the Order Confirmation page
   */
  validateOrderNumberIsValid: {
    value: function (ordNum) {
      expect(this.orderNumber.getAttribute('innerText')).to.include(ordNum);
    }
  },

  /**
  * Validates that the gifting options
  */
  validateSelectedGiftingOption: {
    value: function (usedGiftingOption) {
      const giftingOption = usedGiftingOption.giftingOptionType.substr(0, usedGiftingOption.giftingOptionType.indexOf(' '));
      expect(this.giftingDetailOptionType.getAttribute('innerText')).to.include(giftingOption);
      expect(this.giftingDetailMessage.getAttribute('innerText')).to.include(usedGiftingOption.message);
    }
  },

  /**
   * Validates that page URL path is correct
   */
  validatePageUrl: {
    value: function () {
      browser.urlValidation('/checkout/order/confirm');
    }
  },

  /**
   * To Cancel the Order
   * @param {String} ordNo, The Order number
   */
  cancelOrder: {
    value: function (ordNo) {
      this.orderNumberDetails(ordNo).waitForEnabled();
      this.orderNumberDetails(ordNo).click();
      this.cancelButtonInDetails.waitForEnabled();
      this.cancelButtonInDetails.click();
      this.confirmCancelOrderButton.waitForEnabled();
      this.confirmCancelOrderButton.click();
    }
  },

  /**
   * Validates that page URL path is correct
   */
  validateOrderCancelText: {
    value: function (mesg) {
      this.cancelMessage(mesg).waitForVisible();
    }
  },

  /**
   * Validate customer information link
   */
  validateCustomerInformationLink: {
    value: function (textmsg) {
      this.customerInformationLink(textmsg).isVisible();
    }
  }


};

module.exports = Object.create(Page, ConfirmationPage);
