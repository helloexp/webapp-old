let orderReviewPage = require('../pages/orderReview.page');
let orderDeliveryPage = require('../pages/orderDelivery.page');
let orderPaymentPage = require('../pages/orderPayment.page');
let giftingOptionPage = require('../pages/giftingOption.page');

module.exports = function () {

  this.When(/^User opens MiniBag$/, {retry: 2}, () => {
    orderReviewPage.openMiniBagOption();
  });

  this.When(/^User closes the MiniBag$/, {retry: 2}, () => {
    orderReviewPage.closeMiniBagOption();
  });

  this.When(/^User fills credit card CVV code "([^"]*)?"$/, (cvvCode) => {
    orderPaymentPage.addCreditCardCVVCode(cvvCode);
  });

  this.When(/^User places the order$/, {retry: 2}, () => {
    orderReviewPage.placeOrder();
  });

  this.When(/^User changes the (delivery|payment) method type$/, (type) => {
    if (type === 'delivery') {
      orderReviewPage.editDeliveryMethod();

      browser.params.featureContext.deliveryMethod = {};
    }
    if (type === 'payment') {
      orderReviewPage.editPaymentMethod();

      browser.params.featureContext.paymentMethods = [];
    }
  });

  this.When(/^User edits the shipping method$/, () => {
    orderReviewPage.editShippingMethod();
  });

  this.When(/^User edits the credit card details$/, () => {
    orderReviewPage.editCreditCardButton();
  });

  this.When(/^User edits the payment option type$/, () => {
    orderReviewPage.editPaymentOption();

    browser.params.featureContext.paymentMethods = [];
  });

  this.When(/^User (adds|edits) the Gifting Option from Order Review page$/, (option) => {
    if(option === 'adds'){
      orderReviewPage.addGiftingOption();
    }

    if(option === 'edits'){
      orderReviewPage.editGiftingOption();
    }
  });

  this.When(/^User selects the gifting type and adds message$/, (table) => {
    let giftingOption = table.rowsHash();
    let giftOptionPrice = giftingOptionPage.chooseGiftOption(giftingOption.type);
    let giftOptionMessagePrice = giftingOptionPage.chooseGiftingMessage(giftingOption);
    giftingOption.amount = i18n.currencySymbol +
      (Number(giftOptionPrice.split(i18n.currencySymbol)[1]) + Number(giftOptionMessagePrice ? giftOptionMessagePrice.split(i18n.currencySymbol)[1] : 0));
    browser.params.featureContext.priceDetails.giftFee = giftingOption.amount;
    delete browser.params.featureContext.priceDetails.saleTax; // This is randomly changing after gift is added
    delete browser.params.featureContext.priceDetails.totalTaxIncluded; // This is randomly changing after gift is added
    browser.params.featureContext.giftingOption = giftingOption;
  });

  this.When(/^User (checks|un-checks) the receipt Option$/, (value) => {
    let isChecked = value === 'checks';
    orderReviewPage.enableDisableIssueReceipt(isChecked);
  });

  this.Then(/^Issue Receipt is ([^"]*)?$/, (isVisible) => {
    orderReviewPage.isIssueReceiptVisible(isVisible === 'visible');
  });

  this.Then(/^User is redirected to Order Review page$/, () => {
    orderReviewPage.validateOrderReviewUrlPath();
    orderReviewPage.isOnOrderReviewPage();
  });
  this.Then(/^User is redirected with fast checkout to Order Review page$/, () => {
    orderReviewPage.validateOrderReviewUrlPath();
    orderReviewPage.reviewOrderPageLoadsFineinConciergeAPP();
  });

  this.Then(/^Delivery method information is accurate$/, (table) => {
    let deliveryMethod = typeof table.rowsHash === 'function' ?
      table.rowsHash() : browser.params.featureContext.deliveryMethod;
    if (deliveryMethod.type === 'address') {
      let shippingMethod = browser.params.featureContext.deliveryMethod.shippingMethod || deliveryMethod.shippingMethod;
      orderDeliveryPage.validateOrderAddress(deliveryMethod);
      orderDeliveryPage.validateShippingMethod(shippingMethod);
    }

    if (deliveryMethod.type === 'uniqlo') {
      orderDeliveryPage.validatePickupInUniqlo(deliveryMethod);
    }

    if (deliveryMethod.type === 'cvs') {
      orderDeliveryPage.validatePickupInCvs(deliveryMethod);
    }

    browser.params.featureContext.deliveryMethod = deliveryMethod;
  });

  this.Then(/^Payment method information is accurate$/, (table) => {
    let paymentMethods = typeof table.rowsHash === 'function' ?
      [table.rowsHash()] : browser.params.featureContext.paymentMethods;
    paymentMethods.forEach((paymentMethod) => {
      if (paymentMethod.type === 'creditCard') {
        orderPaymentPage.validateCardData(paymentMethod);
      }
      if (paymentMethod.type === 'atstore') {
        orderPaymentPage.validatePayInStore(paymentMethod);
      }
      if (paymentMethod.type === 'ondelivery') {
        orderPaymentPage.validateCod();
      }
      if (paymentMethod.type === 'giftcard') {
        orderPaymentPage.validateGiftCardData(paymentMethod);
      }
      if (paymentMethod.type === 'deferred') {
        orderPaymentPage.validatePostPay(paymentMethod);
      }
    });
    browser.params.featureContext.paymentMethods = paymentMethods;
  });

  this.Then(/^MiniBag price details are accurate$/, () => {
    let priceDetails = browser.params.featureContext.priceDetails;
    let paymentMethods = browser.params.featureContext.paymentMethods;
    let deductedByGiftCards = 0;
    paymentMethods.forEach((paymentMethod) => {
      if (paymentMethod.type === 'giftcard') {
        deductedByGiftCards += paymentMethod.amount;
      }
    });
    priceDetails.totalTaxIncluded = priceDetails.totalTaxIncluded === 0 ? 0 : priceDetails.totalTaxIncluded - deductedByGiftCards;

    orderReviewPage.validatePriceDetails(priceDetails,paymentMethods);
  });

  this.Then(/^Validate applied coupons in review order page$/, () => {
    let couponDetails = browser.params.featureContext.coupon;
    orderReviewPage.validateAppliedCoupon(couponDetails[0].couponName);
  });

  this.Then(/^Coupon amount is correct on minibag$/, () => {
    let couponDetails = browser.params.featureContext.priceDetails.coupon;
    orderReviewPage.validateCouponAmount(couponDetails);
  });

  this.Then(/^Gifting option data is valid$/, () => {
    let giftingOption = browser.params.featureContext.giftingOption;
    giftingOptionPage.validateGiftingOption(giftingOption);
  });

  this.Then(/^Gift option amount is correct$/, () => {
    let giftingOption = browser.params.featureContext.giftingOption;
    orderReviewPage.validateGiftAmount(giftingOption);
  });

  this.Then(/^User navigates to cart page using the link$/, () => {
    orderReviewPage.changeQuantityMiniBag();
  });

  this.Then(/^Products are present in Order Review page$/, () => {
    let products = browser.params.featureContext.products;

    let totalProducts = 0;
    products.forEach((prod) => {
      totalProducts += +prod.quantity;
    });

    orderReviewPage.validateCartProductCountWithReviewOrder(totalProducts);
  });

  this.Then(/^Products are present in Mini Bag$/, () => {
    let products = browser.params.featureContext.products;

    let totalProducts = 0;
    products.forEach((prod) => {
      totalProducts += +prod.quantity;
    });

    orderReviewPage.validateCartProductCountWithMiniBag(totalProducts);
  });

  this.Then(/^User verify the error message "([^"]*)?" in order review page$/, (errorMessage) => {
    orderReviewPage.validateReviewOrderError(errorMessage);
  });

  this.Then(/^Credit Card Panel is ([^"]*)?$/, (isVisible) => {
    orderReviewPage.isCreditCardPresent(isVisible === 'visible');
  });

  this.Then(/^User dismisses the popup message$/, () => {
    orderReviewPage.dismissPopUp();
  });

  this.Then(/^User clicks on the receipt ToolTip$/, () => {
    orderReviewPage.receiptTootTip();
  });

  this.Then(/^User is redirected to FAQ page$/, () => {
    orderReviewPage.validateFAQPage();
  });

  this.Then(/^User verifies Email after placing the order$/, () => {
    orderReviewPage.validateEmailInOrderConfirmationPage();
  });

  this.Then(/^User verifies the How to recieve from Ministop is visible$/, () => {
    orderReviewPage.validateHowToRecieveFromMinistop();
  });   

  this.Then(/^Store pickup details and store payment details are accurate for store staff$/, () => {
    orderReviewPage.validateStoreStaffPickupAndPaymentDetails();
  });   
};
