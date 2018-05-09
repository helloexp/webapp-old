let orderHistoryPage = require('../pages/orderHistory.page');
let orderDeliveryPage = require('../pages/orderDelivery.page');

module.exports = function () {

  this.When(/^User cancels the Order$/, () => {
    orderHistoryPage.cancelOrder();
  });

  this.Then(/^Order is successfully canceled$/,{retry: 2}, () => {
    let orderNumber = browser.params.orderCookie[0].ord_no;
    orderHistoryPage.validateOrderCancel(orderNumber);
  });
  this.Then(/^Delivery method information is verified$/, (table) => {
    let deliveryMethod = typeof table.rowsHash === 'function' ?
      table.rowsHash() : browser.params.featureContext.deliveryMethod;

    if (deliveryMethod.type === 'address') {
      let shippingMethod = browser.params.featureContext.deliveryMethod.shippingMethod || deliveryMethod.shippingMethod;
      orderDeliveryPage.validateOrderAddress(deliveryMethod);
      orderHistoryPage.validateShippingMethod(shippingMethod);
    }

    if (deliveryMethod.type === 'uniqlo') {
      orderDeliveryPage.validatePickupInUniqlo(deliveryMethod);
    }

    if (deliveryMethod.type === 'cvs') {
      orderDeliveryPage.validatePickupInCvs(deliveryMethod);
    }
  });

  this.Then(/^Cart information is verified$/, (table) => {
    let products = typeof table.rowsHash === 'function' ?
      table.rowsHash() : browser.params.featureContext.products;
    products.forEach((product) => {
      orderHistoryPage.validatePurchasedItem(product);
    });
  });

   this.Then(/^Payment method information is verified$/, (table) => {
    let paymentMethods = typeof table.rowsHash === 'function' ?
      [table.rowsHash()] : browser.params.featureContext.paymentMethods;

    paymentMethods.forEach((paymentMethod) => {
      if (paymentMethod.type === 'atstore') {
        orderHistoryPage.validatePayment(paymentMethod);
      } else {
        orderHistoryPage.validatePayment(paymentMethod.type);
      }
    });
  });

  this.Then(/^User verifies whether shipping address and billing address are (same|different)$/, (status) => {
    let deliveryMethod = browser.params.featureContext.deliveryMethod;
    let billingMethod = browser.params.featureContext.billingMethod;
    orderHistoryPage.validateShippingAndBillingAddress(status, deliveryMethod, billingMethod);
  });
};
