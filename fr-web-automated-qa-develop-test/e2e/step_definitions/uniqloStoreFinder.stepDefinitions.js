let orderDeliveryPage = require('../pages/orderDelivery.page');
let orderPaymentPage = require('../pages/orderPayment.page');
let uniqloStoreSearchPage = require('../pages/uniqloStoreSearch.page');
let uqStore = require('../data/store');

module.exports = function () {

  this.When(/^User choose the Uniqlo Store finder$/, (type, table) => {
    orderDeliveryPage.goToUniqloStoreFinder();
  });

  this.When(/^User select a Uniqlo Store to (deliver|pay)$/, (type) => {
    let env = process.env.npm_config_env || 'test3';
    let uniqloStore = uqStore.filterByUsage(env+"-"+type);
    if (type === 'deliver') {
      orderDeliveryPage.goToUniqloStoreFinder();
      uniqloStoreSearchPage.searchUniqloStore(uniqloStore[0]);
      uniqloStoreSearchPage.selectStoreFromUniqloStorelist(uniqloStore[0]);
      uniqloStoreSearchPage.confirmUniqloStore();
      browser.params.featureContext.deliveryMethod.type = uniqloStore[0].type;
      browser.params.featureContext.deliveryMethod.name = uniqloStore[0].name;
      browser.params.featureContext.deliveryMethod.address = uniqloStore[0].address;
    }

    if (type === 'pay') {
      orderPaymentPage.applyPayInStoreButton();
      uniqloStoreSearchPage.searchUniqloStore(uniqloStore[0]);
      uniqloStoreSearchPage.selectStoreFromUniqloStorelist(uniqloStore[0]);
      uniqloStoreSearchPage.confirmUniqloStore();
      browser.params.featureContext.paymentMethods.push(uniqloStore[0]);
    }
  });
  
  this.When(/^User cancels the uniqlo store$/, () => {
    orderDeliveryPage.closeStorePopup();
  });
};