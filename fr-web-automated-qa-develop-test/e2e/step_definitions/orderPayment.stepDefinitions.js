let orderPaymentPage = require('../pages/orderPayment.page');
let orderReviewPage = require('../pages/orderReview.page');
let creditCardList = require('../data/creditCard');

module.exports = function () {

  this.When(/^User (select|change) the (atstore|creditCard|ondelivery|giftcard|deferred) payment method$/, (method, paymentType) => {
    if (method === 'change') {
      browser.params.featureContext.paymentMethods = [];
    }
    orderPaymentPage.selectPaymentMethod(paymentType);
  });

  this.When(/^User confirms the cash on delivery payment method$/, () => {
    orderPaymentPage.clickCashOnDelivery();
    browser.params.featureContext.paymentMethods.push({type: 'ondelivery'});
  });

  this.When(/^User confirms the atstore payment method$/, () => {
    orderPaymentPage.applyPayInStoreButton();
  });

  this.When(/^User confirm the age verification for Deferred payment method$/, () => {
    orderPaymentPage.clickAgeVerificationButton();
  });

  this.When(/^User confirm the Deferred payment method$/, () => {
    let deferred = [];
    deferred.type = 'deferred';
    orderPaymentPage.applyDeferredButtonToOrder();
    browser.params.featureContext.paymentMethods.push(deferred);

  });

  this.When(/^User edits the payment method$/, () => {
    orderPaymentPage.changePaymentMethod();
  });

  this.When(/^User chooses another Credit Card$/, () => {
    orderPaymentPage.chooseAnotherCreditCard();
  });

  this.When(/^User adds a new credit card( and saves it for later usage)*$/, (saveCard) => {
    let creditcard = creditCardList.valid[0];
    orderPaymentPage.fillCreditCardForm(creditcard);
    if (saveCard) {
      orderPaymentPage.saveCreditCardInformation();
    }

    browser.params.featureContext.paymentMethods.push(creditcard);
  });

  this.When(/^User confirms the credit card payment method$/, () => {
    orderPaymentPage.applyCreditCardToOrder();
  });

  this.When(/^User selects the existing credit card$/, () => {
    orderPaymentPage.chooseExistingCreditCard();
  });

  this.When(/^User adds a gift card and proceed( with (full|part) payment mode)*$/, (proceedTo , paymentMode, table) => {
    let usedGiftCard = table.rowsHash();
    if(usedGiftCard.amount == null || usedGiftCard.amount == 0){
      usedGiftCard.amount = browser.params.featureContext.priceDetails.totalCartPrice;
    }
    delete browser.params.featureContext.priceDetails.saleTax; // This is randomly changing after gift card is added

    orderPaymentPage.fillNewGiftCardDetail(usedGiftCard);
    orderPaymentPage.applyNewGiftCard();

    orderPaymentPage.chooseGiftCardPaymentMode('part');
    if(proceedTo){
      orderPaymentPage.applyGiftCardInPaymentPage(paymentMode, usedGiftCard);
    }
  });

  this.Then(/^User verify the error message "([^"]*)?" is (visible|not visible) in payment page$/, (errorMessage, isVisible) => {
    orderPaymentPage.validatePaymentPageErrorMessages(errorMessage, isVisible === 'visible');
  });

  this.When(/^User proceed using the gift card "([^"]*)?" with (full|part) payment*$/, (giftCardNumber, paymentMode, table) => {
    let usedGiftCard = table.rowsHash();
    orderPaymentPage.editGiftCardAmount(giftCardNumber || 1);
    orderPaymentPage.applyGiftCardInPaymentPage(paymentMode, usedGiftCard);
  });

  this.When(/^User edits the Gifting Option from Order Payment page$/, () => {
    orderPaymentPage.editGiftOption();
  });

  this.When(/^User adds the Gifting Option from Order Payment page$/, () => {
    orderPaymentPage.addGiftOption();
  });

  this.When(/^User validates the credit card details$/, () => {
    let creditCard = creditCardList.valid[0];
    orderPaymentPage.creditCardValidation(creditCard);
  });

  this.When(/^User validates the credit card error messages for "([^"]*)?"$/, (errorMessage) => {
    orderPaymentPage.validateCreditCardToolTip(errorMessage);
  });

  this.When(/^User validates the gift card error messages for "([^"]*)?"$/, (errorMessage) => {
    orderPaymentPage.validateGiftCardFields(errorMessage);
  });

  this.Then(/^User is redirected to Order Payment page$/, () => {
    orderPaymentPage.validateUrlPath();
  });

  this.Then(/^Verify that payment types are not available$/, (table) => {
    let paymentTypes = table.hashes();
    paymentTypes.forEach((paymentMethod) => {
      orderPaymentPage.validatePaymentMethodIsHidden(paymentMethod);
    });
    browser.pause(4000);
  });

  this.When(/^User applies the gift card$/, () => {
    orderPaymentPage.applyNewGiftCard();
  });

  this.When(/^User proceeds with part payment mode$/, () => {
    orderPaymentPage.chooseGiftCardPaymentMode('part');
  });

  this.Then(/^Validation message for "([^"]*)?" case is displayed$/, (errorScenario) => {
    orderPaymentPage.verifyValidationErrorMessages(errorScenario);
  });

  this.Then(/^User is unable to submit the gift card "([^"]*)?"$/, (type) => {
    switch (type) {
      case 'form':
        orderPaymentPage.verifyGiftCardFormNotSubmitted();
        break;
      case 'amount':
        orderPaymentPage.verifyGiftCardAmountNotSubmitted();
        break;
    }
  });

  this.Then(/^User submits the gift card form details$/, () => {
    orderPaymentPage.applyGiftCardAmountToOrder();
  });

  this.Then(/^User deletes the gift card( "[^"]*")* from Payment Page$/, (giftCardNumber) => {
    orderPaymentPage.deleteGiftCard(giftCardNumber);
    browser.params.featureContext.paymentMethods.splice(giftCardNumber-1,1);
  });

  this.When(/^User changes the delivery method type from Payment Page$/, () => {
    orderPaymentPage.changeDeliveryMethod();
  });

  this.When(/^User changes the shipping method type from Payment Page$/, () => {
    orderPaymentPage.changeShippingMethod();
  });  

  this.When(/^User changes the delivery address from Payment Page$/, () => {
    orderPaymentPage.editDeliveryAddress();
  });

  this.Then(/^Credit Card Form is ([^"]*)?$/, (isVisible) => {
    orderPaymentPage.creditCardFormIsVisible(isVisible === 'visible');
  });

  this.Then(/^Gift Card Form is ([^"]*)?$/, (isVisible) => {
    orderPaymentPage.giftCardFormIsVisible(isVisible === 'visible');
  });

  this.Then(/^User confirms giftcard payment$/, () => {
    orderPaymentPage.confirmGiftCard();
  });

  this.Then(/^User validates the email in Payment Page$/, () => {
    orderPaymentPage.validateEmailInPaymentPage();
  });

  this.Then(/^User checks if apply coupon is (visible|hidden)$/, (visible) => {
    orderPaymentPage.validateApplyCoupon(visible === "visible");
  });
  
};
