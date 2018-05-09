let orderDeliveryPage = require('../pages/orderDelivery.page');
let orderPaymentPage = require('../pages/orderPayment.page');
let address = require('../data/shippingAddress');

module.exports = function () {

  this.When(/^User adds a new (delivery( but not as billing)?|billing) address( with today delivery| with standard delivery| with bydate delivery| with yupacket delivery| with nekoPosPacket delivery| with nextday delivery)*$/, (type, notAsBilling, date, table) => {

    type = type.match(/(\w+)?/)[0];
    let env = process.env.npm_config_env || 'test3';
    shippingAddress = address.filterByUsage(env)[0] || table.rowsHash();

    if (type === 'delivery') {
      const useAsBillingAddress = (notAsBilling)? false: true;
      orderDeliveryPage.fillAddressForm(shippingAddress, useAsBillingAddress);
      browser.params.featureContext.deliveryMethod = shippingAddress;
      if (date) {
        date = date.replace(' with ', '').replace(' delivery', '');
        orderDeliveryPage.submitAddressForm();
        if(useAsBillingAddress) {
          orderDeliveryPage.clickSaveAndContinue();
        }
        browser.params.featureContext.priceDetails.postage = +browser.params.featureContext.priceDetails.postage + +orderDeliveryPage.selectDeliveryDateTimeType(date);
        if (date.includes('bydate')) {
          orderDeliveryPage.selectAvailableByDateDeliveryDateTime();
          orderDeliveryPage.confirmDeliveryDateTime();
        }
        if(date.includes('nextday')){
            if(orderDeliveryPage.verifyNextDayAvailable(1)) {
              orderDeliveryPage.selectNextDayDelivery();
              orderDeliveryPage.selectAvailableNextDayDeliveryTime();
              orderDeliveryPage.confirmDeliveryDateTime();
            } else {
                date = 'standard';
                browser.params.featureContext.priceDetails.postage = +browser.params.featureContext.priceDetails.postage + +orderDeliveryPage.selectDeliveryDateTimeType(date);
            }
        }
        browser.params.featureContext.deliveryMethod.shippingMethod = date;
      } else {
        orderDeliveryPage.submitAddressForm();
        if(useAsBillingAddress) {
          orderDeliveryPage.clickSaveAndContinue();
        }
        browser.params.featureContext.billingMethod = shippingAddress;
      }
    } else if (type === 'billing') {
      browser.params.featureContext.billingMethod = shippingAddress;
      orderDeliveryPage.fillAddressForm(shippingAddress);
    }
  });

  this.When(/^User adds member information at Payment Page$/, (table) => {
    let env = process.env.npm_config_env || 'test3';
    let shippingAddress = address.filterByUsage(env)[0] || table.rowsHash();
    orderDeliveryPage.fillAddressFormForPayAtStore(shippingAddress);
  });
  

  this.When(/^User fills the address$/, () => {
    let env = process.env.npm_config_env || 'test3';
    let shippingAddress = address.filterByUsage(env)[0];
    orderDeliveryPage.fillAddressOnly(shippingAddress);
  });

  this.When(/^User fills the address only$/, () => {
    let env = process.env.npm_config_env || 'test3';
    let shippingAddress = address.filterByUsage(env)[0];
    orderDeliveryPage.fillPartialAddressOnly(shippingAddress);
  });

  this.When(/^User submits the member information$/, () => {
    orderDeliveryPage.submitMemberInfo();
  });

  this.When(/^User confirm the shipping address$/, () => {
    orderDeliveryPage.clickSaveAndContinue();
  });

  this.When(/^User confirm the partial shipping address$/, () => {
    orderDeliveryPage.partialAddressForm();
  });


  this.When(/^User selects (collective|individual) packing method$/, (packingMethod) => {
    browser.waitForLoading();
    browser.pause(2000);
   orderDeliveryPage.selectPackingMethod(packingMethod);
    browser.params.featureContext.packingMethod  = packingMethod;
  });

  this.When(/^User selects (today|standard|bydate|nextday|yupacket|nekoPosPacket) shipping method( for Delivery (1|2|3)*)*( with date index [^"]*)?( with time index [^"]*)??$/, (date, splitDelivery, deliveryNo, dateTimeIndex) => {
    browser.params.featureContext.priceDetails.postage = +browser.params.featureContext.priceDetails.postage + +orderDeliveryPage.selectDeliveryDateTimeType(date, deliveryNo);
    if (date.includes('bydate')) {
      orderDeliveryPage.selectAvailableByDateDeliveryDateTime(...(dateTimeIndex || '').match(/\d+/g) || []);
      orderDeliveryPage.confirmDeliveryDateTime();
    }
    if(date.includes('nextday')){
      if(orderDeliveryPage.verifyNextDayAvailable(deliveryNo)) {
          orderDeliveryPage.selectNextDayDelivery();
          orderDeliveryPage.selectAvailableNextDayDeliveryTime();
          orderDeliveryPage.confirmDeliveryDateTime();
      } else {
           date = 'standard';
           browser.params.featureContext.priceDetails.postage = +browser.params.featureContext.priceDetails.postage + +orderDeliveryPage.selectDeliveryDateTimeType(date, deliveryNo);
      }
    }
    if (splitDelivery) {
      if(browser.params.featureContext.deliveryMethod.shippingMethod) {
        browser.params.featureContext.deliveryMethod.shippingMethod[deliveryNo] = date;
      } else {
        browser.params.featureContext.deliveryMethod.shippingMethod = []
        browser.params.featureContext.deliveryMethod.shippingMethod[deliveryNo] = date;
      }
    } else {
      browser.params.featureContext.deliveryMethod.shippingMethod = date;
    }
    
  });

  this.When(/^User validates there exists "([^"]*)?" shipment in individual shipping$/, (deliveryNo) => {
    orderDeliveryPage.validateShipmentNo(deliveryNo);
  });

  this.When(/^User selects and changes an existing address$/, () => {
    orderDeliveryPage.selectAndChangeExistingAddress();
  });

  this.When(/^User confirms the shipping method$/, () => {
    orderDeliveryPage.confirmShipping();
  });

  this.When(/^User enters phone number as "([^"]*)?"$/, (value) => {
    orderDeliveryPage.fillPhoneNo(value);
  });

  this.When(/^User submits the address form$/, () => {
    orderDeliveryPage.submitAddressForm();
    orderDeliveryPage.clickSaveAndContinue();
  });

  this.When(/^User fill the address form$/, () => {
orderDeliveryPage.submitAddressForm();
    orderDeliveryPage.clickSaveAndContinue();
  });

  this.When(/^User submits the new shipping address form$/, () => {
    orderDeliveryPage.submitNewShippingAddressForm();
  });

  this.When(/^User saves the updated the address form$/, () => {
    orderDeliveryPage.submitUpdateAddressForm();
  });

  this.Then(/^Validation message for "([^"]*)?" is displayed$/, (errorScenario) => {
    orderDeliveryPage.verifyValidationErrorMessage(errorScenario);
  });

  this.Then(/^User Validates the form$/, () => {
    orderDeliveryPage.validateShippingForm();
  });

  this.Then(/^User Validates the form with invalid data$/, () => {
    orderDeliveryPage.validateShippingFormWithInvalidData();
  });

  this.Then(/^User checks for Validation message for "([^"]*)?" is displayed$/, (errorScenario) => {
    orderDeliveryPage.verifyValidationNewShippingAddressForm(errorScenario);
  });

  this.Then(/^User is unable to submit the form$/, () => {
    orderDeliveryPage.verifyShippingAddressFormNotSubmitted();
  });

  this.Then(/^"([^"]*)?" shipping method is not available$/, (shippingMethod) => {
    orderDeliveryPage.validateShippingMethodNotAvailable(shippingMethod);
  });

  this.Then(/^Address form is ([^"]*)?$/, (isVisible) => {
    orderDeliveryPage.addressFormIsVisible(isVisible === 'visible');
  });
};
