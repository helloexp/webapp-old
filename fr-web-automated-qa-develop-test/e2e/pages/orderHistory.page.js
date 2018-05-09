let Page = require('./page');

/**
 * Order History Page Object
 *
 * @class e2e/pages/OrderHistoryPage
 * @type {Page}
 */

let OrderHistoryPage = {

  /**
   * define elements
   */
  billingMethodName: {get: function () { return browser.element('(//address/../..//h6)[2]'); }},
  billingFirstNameLastName: {get: function () {return browser.element('(//address/div[1])[2]'); }},
  billingPostalCode: {get: function () { return browser.element('(//address/div[2])[2]'); }},
  billingPrefectureCityAddress: {get: function () { return browser.element('(//address/div[3])[2]'); }},  
  cancelOrderButton: {value: function () { return browser.element('//button[contains(@class,"cancelButtonInDetails")]');}},
  confirmCancelOrderButton: {get: function () { return browser.element('//button[contains(@class,"OrderHistory") and contains(@class,"cancelOrderButton")]');}},
  orderCancelledText: {get: function () { return browser.element('//div[contains(@class,"cancelDetailHead")]');}},
  orderNumber: {get: function () { return browser.element('(//div[contains(@class,"textValues")])[1]');}},
  shippingMethodType: {get: function () {return browser.element('//div[contains(@class,"pickerContainer")]');}},
  purchasedItem: {get: function() {return browser.element('//div[contains(@class,"removeBottomPadding")]');}},
  purchasedItemId: {get: function() {return browser.element('//div[contains(@class,"itemDatas")][4]');}},
  purchasedItemSize: {get: function() {return browser.element('//div[contains(@class,"itemDatas")][2]');}},
  purchasedItemColor: {get: function() {return browser.element('//div[contains(@class,"itemDatas")][1]');}},
  purchasedItemQuantity: {get: function() {return browser.element('//div[contains(@class,"itemCount")]');}},
  paymentMethod: {get: function() {return browser.element('//div[contains(@class, "paymentMethodText")][1]');}},
  paymentMethodPayAtStore: {get: function() {return browser.element('//div[contains(@class,"addressCover")]');}},
  shippingAddress: {get: function () { return browser.element('(//address)[1]'); }},
  billingAddress: {get: function () { return browser.element('(//address)[2]'); }},
  /**
   * Overridden open function.
   * Opens / application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/account/order';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path); // TODO
    }
  },
  /**
   * Cancels specified order
   * @param {String} orderNumber
   */

  cancelOrder: {
    value: function (orderNumber) {
      browser.waitForLoading();
      this.cancelOrderButton(orderNumber).waitForEnabled();
      this.cancelOrderButton(orderNumber).click();
      this.confirmCancelOrderButton.waitForEnabled();
      this.confirmCancelOrderButton.click();
    }
  },

  /**
   * Verifies order was successfully canceled
   * @param {String} orderNumber
   * @param {String} canceledStatusText
   */

  validateOrderCancel: {
    value: function (orderNum) {
      browser.waitForLoading();
      browser.pause(1000);
      if (this.orderCancelledText.isVisible()){
        expect(this.orderCancelledText.getAttribute('innerText')).to.include(i18n.order_status_canceled);
        expect(this.orderNumber.getAttribute('innerText')).to.include(orderNum);
      }
    }
  },

  validateShippingMethod: {
    value: function (shippingMethod) {
      if(shippingMethod) {
        this.shippingMethodType.waitForVisible();
        expect(this.shippingMethodType.getAttribute('innerText')).to.include(i18n.shippingMethod[shippingMethod]);
      }
    }
  },

  validatePurchasedItem: {
    value: function (purchasedItem) {
      this.purchasedItem.waitForVisible();
      expect(this.purchasedItem.getAttribute('innerText')).to.include(purchasedItem.size);
      expect(this.purchasedItem.getAttribute('innerText')).to.include(purchasedItem.color);
    }
  },

  validatePayment: {
    value: function(paymentMethod) {
      if(paymentMethod.type) {
        this.paymentMethodPayAtStore.waitForVisible();
        expect(this.paymentMethodPayAtStore.getAttribute('innerText')).to.include(paymentMethod.name);

      } else {
        this.paymentMethod.waitForVisible();
        expect(this.paymentMethod.getAttribute('innerText')).to.include(i18n.paymentMethod[paymentMethod]);
      }

    }
  },

  validateShippingAndBillingAddress: {
    value: function(status, deliveryMethod, billingMethod) {
      if(status === 'same') {
        expect(this.shippingAddress.getAttribute('innerText')).to.include(this.billingAddress.getAttribute('innerText'));        
      } else {
      this.billingMethodName.waitForVisible();
      expect(this.billingFirstNameLastName.getAttribute('innerText')).to.include(billingMethod.lastName + ' ' + billingMethod.firstName);
      expect(this.billingPostalCode.getAttribute('innerText')).to.include(billingMethod.postalCode.slice(0, 3) + '-' + billingMethod.postalCode.slice(3));
      expect(this.billingPrefectureCityAddress.getAttribute('innerText')).to.include(billingMethod.prefecture);
      expect(this.billingPrefectureCityAddress.getAttribute('innerText')).to.include(billingMethod.city);
      expect(this.billingPrefectureCityAddress.getAttribute('innerText')).to.include(billingMethod.street);
      expect(this.billingPrefectureCityAddress.getAttribute('innerText')).to.include(billingMethod.streetNumber);
      }
    }
  }
};

module.exports = Object.create(Page, OrderHistoryPage);
