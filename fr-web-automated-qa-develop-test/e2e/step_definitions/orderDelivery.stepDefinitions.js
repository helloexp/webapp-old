let orderDeliveryPage = require('../pages/orderDelivery.page');

module.exports = function () {

  this.When(/^User select the (shipto|uniqlo|cvs) delivery method$/, (deliveryType) => {
    orderDeliveryPage.selectDeliveryMethod(deliveryType);
  });

  this.When(/^User confirms the previous selected Uniqlo store$/, () => {
    orderDeliveryPage.usePreviousUniqloStore();
  });

  this.When(/^User selects the existing Convenient Store$/, () => {
    orderDeliveryPage.chooseExistingCvsSevenStore();
  });

  this.When(/^User selects a (existing|new) (Seven Eleven|Lawson|Family Mart|Ministop) Convenient Store$/, (newStore, storeType) => {

    if (storeType === 'Seven Eleven') {
      orderDeliveryPage.listAllCvsSevenStoreList();
      orderDeliveryPage.clickToViewAllSevenStoreList();
      orderDeliveryPage.selectStoreFromCvsStoreList();
      browser.params.featureContext.deliveryMethod = orderDeliveryPage.confirmCvsSevenStore();
    } else if (storeType === 'Lawson' || storeType === 'Ministop') {
      if (newStore === "new") {
        
        orderDeliveryPage.listAllCvsLawsonStoreList();
        orderDeliveryPage.clickToViewAllLawsonStoreListNewUser();
        browser.pause(2000);
        orderDeliveryPage.selectStoreFromCvsLawsonStoreListNewUser(storeType === 'Ministop');
      } 
      else {
        
        orderDeliveryPage.selectExistingCvsLawsonStore();
        orderDeliveryPage.clickToViewAllLawsonStoreListReturnUser();
        orderDeliveryPage.selectStoreFromCvsLawsonStoreListReturnUser(storeType === 'Ministop');
        browser.pause(2000);     
     }
      browser.params.featureContext.deliveryMethod = orderDeliveryPage.confirmLawsonCvsStore();
      browser.url('http://dev.uniqlo.com:3000/jp/checkout/payment?name1=176006&name2=0001&name3=ＮＬ　乃木坂&name5=ローソン&name6=107-0052&name7=東京都新宿区新宿３－２９－１赤坂９‐６‐２９&name8=03-5785-1509&name9=107011&name10=2037123123&name13=0001164888');
    } else if (storeType === 'Family Mart') {
      if (orderDeliveryPage.convenienceStoresFamilyMart.isVisible()) {
        orderDeliveryPage.listAllCvsFamilyMartList();
        orderDeliveryPage.selectCvsFamilyMartByAddress();
        orderDeliveryPage.selectCvsFamilyMartRegion();
        orderDeliveryPage.selectCvsFamilyMartStoreLocator();

        orderDeliveryPage.selectCvsFamilyMartPrefecture();
      } else {
        orderDeliveryPage.selectExistingCvsFamilyMartStore();
      }

      // orderDeliveryPage.selectCvsFamilyMartCity();
      orderDeliveryPage.selectCvsFamilyMartChooseAStore();
      browser.params.featureContext.deliveryMethod = orderDeliveryPage.selectCvsFamilyMartStoreConfirm();

      browser.pause(2000);

      let browserUrl = browser.getUrl().replace(/^https:\/\//i, 'http://');
      browserUrl = browserUrl.replace('fmshop_id', 'old').concat('&fmshop_id=18347');

      browser.url(browserUrl);
    }

    browser.params.featureContext.deliveryMethod.type = 'cvs';
  });

  this.When(/^User selects and submits an existing address$/, () => {
    orderDeliveryPage.selectAndConfirmExistingAddress();
  });

  this.When(/^User selects an alternate existing address$/, () => {
    orderDeliveryPage.selectAlternateExistingAddress();
  });


  this.When(/^User adds a new Shipping address$/, () => {
    orderDeliveryPage.selectNewShippingAddress();
  });

  this.When(/^User clicks Save and continue on selected address$/, () => {
    orderDeliveryPage.clickSaveAndContinue();
  });

  this.Then(/^User is redirected to Order Delivery page$/, () => {
    orderDeliveryPage.validateDeliveryUrlPath();
  });

  this.When(/^User Edit the Ship to Delivery Addresss$/, () => {
    orderDeliveryPage.goToEditDeliveryShipToButton();
  });

  this.Then(/^Delivery methods are reset$/, () => {
    orderDeliveryPage.validateDeliveryResetState();
  });

  this.Then(/^User checks for same day shipping details$/, () => {
    orderDeliveryPage.validateSameDayDeliveryDetails();
  });

  this.Then(/^User verifies whether Ministop delivery is available$/, () => {
    orderDeliveryPage.validateMinistopStore();
  });

  this.Then(/^User verifies the products in the shipping panel$/, () => {
    orderDeliveryPage.validateProducts();
  });

  this.Then(/^User checks if gifting option is (visible|hidden)$/, (visible) => {
    orderDeliveryPage.validateGiftingOption(visible === "visible");
  });

};
