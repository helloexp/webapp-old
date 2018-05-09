let Page = require('./page');
let testPrerequisites = require('../utilities/testPrerequisites');

/**
 * Order Payment Page Object
 *
 * @class e2e/pages/OrderPaymentPage
 * @type {Page}
 */
let OrderPaymentPage = {
  /**
   * define elements
   */

  /**
   * Payment types
   */
  paymentContainer: {get: function () { return browser.element('//div[contains(@class, "Payment-styles-headingContainer")]'); }},
  payAtStoreCheckbox: {get: function () {return browser.element('//input[@type="checkbox"][@id="BoxSelectorPaymentTileus"]/..');}},
  payWithCreditCardCheckbox: {get: function () {return browser.element('//input[@type="checkbox"][@id="BoxSelectorPaymentTilecc"]/..');}},
  payOnDeliveryCheckbox: {get: function () {return browser.element('//input[@type="checkbox"][@id="BoxSelectorPaymentTilecod"]/..');}},
  payWithGiftCardCheckbox: {get: function () {return browser.element('(//input[@type="checkbox"][contains(@id,"BoxSelectorPaymentTileg")]/..)[last()]');}},
  payWithDeferredCheckbox: {get: function () {return browser.element('(//input[@type="checkbox"][contains(@id,"BoxSelectorPaymentTiledeferred")]/..)');}},
  changePaymentType: {get: function () {return browser.element('(//button[contains(@class,"deliveryEdit")])[2]');}},
  paymentPageErrorMessage: {get: function () {return browser.element('//div[contains(@class, "paymentPageError")]'); }},
  changeDeliveryMethodButton: {get: function () { return browser.element('//button[contains(@class,"deliveryEdit")]');}},
  changeShippingMethodButton: {get: function () { return browser.element('(//div[contains(@class,"toggleCell")])[2]');}},
  deliveryAddressEditButton: {get: function () { return browser.element('//div[contains(@class,"toggleCell")]//button');}},

  /**
   * Credit card
   */
  cardNumber: {get: function () { return browser.element('//input[@name="card"]');}},
  expiryMonth: {get: function () { return browser.element('//select[@name="expMonth"]');}},
  expiryYear: {get: function () { return browser.element('//select[@name="expYear"]');}},
  cvv: {get: function () { return browser.element('//input[@name="cvv"]');}},
  cardHolder: {get: function () { return browser.element('//input[@name="name"]');}},
  saveCardCheckbox: {get: function () { return browser.element('//input[@id="isSaveThisCard"]/..');}},
  applyCreditCard: {get: function () { return browser.element('//button[contains(@class,"applyCreditCard")]');}},
  otherCardBtn: {get: function () { return browser.element('//button[contains(@class, "otherCardBtn")]');}},
  chooseCardBtn: {get: function () { return browser.element('(//div[contains(@class,"Payment-CreditCard-")]//button)[1]');}},
  useSelectedCardBtn: {get: function () { return browser.element('//div[contains(@class,"Payment-CreditCard-")]//button[contains(@class,"applyButton")]');}},
  creditCardForm: {get: function () { return browser.element('//div[contains(@class,"creditPayment")]');}},

  /**
   * Credit card error message
   */
  errorToolTip: {value: function (txt) {return browser.element(`//span[contains(@class, "InputError") and contains(.,"$  {txt}")]`);}},

  /**
   *  Gift Card Payment
   */
  giftCardCode: {get: function () { return browser.element('//input[@name="giftCardNumber"]'); }},
  giftCardCvv: {get: function () { return browser.element('//input[@name="giftCardPin"]'); }},
  giftCardAmount: {get: function () { return browser.element('//input[@id="payment"]'); }},
  applyGiftCard: {get: function () { return browser.element('//button[contains(@class,"secondary")]'); }},
  payFullAmount: {get: function () { return browser.element('//input[contains(@name, "paymentOptionGroup") and @value="1"]/..'); }},
  paySomeAmount: {get: function () { return browser.element('//input[contains(@name, "paymentOptionGroup") and @value="0"]/..'); }},
  payAmount: {get: function () { return browser.element('//input[@id="payment"]'); }},
  payChoiceButton: {get: function () { return browser.element('//div[contains(@class, "giftCardFormRadio")]/button'); }},
  continueAfterChoosingGiftCard: {get: function () { return browser.element('//div[contains(@class, "giftCardDetails")]/button'); }},
  editGiftCardAmountButton: {value: function (index) { return browser.element(`(//div[contains(@class,"giftCardDetails")]//button[contains(@class,"editButton")])[${index}]`); }},
  deleteGiftCardBtn:{value: function (text) { return browser.element(`(//div[contains(@class,"cardHead")]//button[contains(@class,"editButton")])[${text}]`); }},
  giftCardErrorTooltip: {get: function () { return browser.element('//div[contains(@class,"error")]');}},
  giftCardError: {get: function () { return browser.element('//ul[contains(@class,"AddressForm-styles-error")]//li[1]');}},
  giftCardDetailsWrapper: {get: function () { return browser.element('//div[contains(@class,"giftCardDetails")]');}},
  popupConfirmButton: {get: function () { return browser.element('//div[contains(@class,"stickyBoxFooter")]/button[2]');}},
  confirmGiftCardButton: {get: function () { return browser.element('//button[contains(@class, "secondary")]');}},
  applyCouponButton: {get: function () { return browser.element('//a[@analytics-label="Change Coupon"]');}},
  /**
   *  Cash on Delivery
   */
  saveCodButton: {get: function () { return browser.element('//*[contains(@class, "payCashButton")]');}},

  /**
   * uniqlo Payment
   */


  uniqloSelectStoreBtn: {get: function () { return browser.element('//button[contains(@class,"Checkout-Payment-StorePayment-styles-uniqloPaymentBtn")]'); }},
  uniqloSearchStoreResultLabel: {get: function () { return browser.element('//h6[contains(@class,"numberOfResults")]'); }},
  payAtStorePopUp: {get: function () { return browser.element('(//button[contains(@class,"btnStyle")])[2]');}},

  /**
   * Deferred payment 
   */
  invoicePopupConfirmButton: {get: function () { return browser.element('(//button[contains(@class,"MessageBox")])[2]');},},
  ageVerificationCheckbox: {get: function () {return browser.element('//div[contains(@class,"ageConfirmBox")]//label');}},
  saveDeferredButton: {get: function () { return browser.element('//button[contains(@class, "confirmPostPayBtn")]');}},

  /**
   * Gifting option
   */
  giftingOptionEditButton: {get: function () {return browser.element('//div[contains(@class, "GiftPanel")]//button');}},
  giftingOptionAddButton: {get: function () {return browser.element('//div[contains(@class, "GiftPanel")]//a');}},
  popupConfirmButton: {get: function () { return browser.element('//div[contains(@class,"stickyBoxFooter")]/button[2]');}},

  /**
   * Validation
   */
   paymentMethodName: {get: function () { return browser.element('//div[contains(@class,"PaymentMethodTile")]//div[contains(@class,"tileHead")]');}},
  paymentAddressCover: {get: function () { return browser.element('//div[contains(@class,"PaymentMethodTile-styles-addressCover")]');}},
  paymentStoreAddress: {get: function () { return browser.element('//div[contains(@class,"PaymentMethodTile-styles-addressCover")]//div[3]');}},
  creditCardNumber: {get: function () { return browser.element('//img[contains(@class,"creditCardImage")]/../../div[contains(@class,"cardNumber")]');}},
  creditCardCVVCode: {get: function () { return browser.element('//input[@id="cvv"]'); }},
  giftCardElem: {value: function (c) { return browser.element(`//div[contains(@class,"GiftCard") and contains(.,"${c.cardNumber.slice(-4)}") and contains(.,"${c.amount}")]`);}},

  /**
   * Overridden open function.
   *
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/checkout/payment';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   * Selects the payment method depending to the paymentMethod value
   *
   * @param {String} paymentMethod
   */
  selectPaymentMethod: {
    value: function (paymentMethod) {
      browser.waitForLoading();
      if (paymentMethod.toLowerCase() === 'atstore') {
        this.payAtStoreCheckbox.waitForEnabled();
        this.payAtStoreCheckbox.click();
        this.payAtStorePopUp.waitForEnabled();
        this.payAtStorePopUp.click();
        browser.waitForLoading();
      }
      if (paymentMethod.toLowerCase() === 'creditcard') {
        this.payWithCreditCardCheckbox.waitForEnabled();
        this.payWithCreditCardCheckbox.click();
        browser.waitForLoading();
      }
      if (paymentMethod.toLowerCase() === 'ondelivery') {
        this.payOnDeliveryCheckbox.waitForEnabled();
        this.payOnDeliveryCheckbox.click();
        browser.waitForLoading();
      }
      if (paymentMethod.toLowerCase() === 'giftcard') {
        this.payWithGiftCardCheckbox.waitForEnabled();
        this.payWithGiftCardCheckbox.click();
        browser.waitForLoading();
      }
      if (paymentMethod.toLowerCase() === 'deferred') {
        this.payWithDeferredCheckbox.waitForEnabled();
        this.payWithDeferredCheckbox.click();
        browser.waitForLoading();
        this.invoicePopupConfirmButton.waitForVisible();
        this.invoicePopupConfirmButton.click();
      }
    }
  },

  /**
   * Verify whether payment method is hidden or not
   *
   * @param {String} paymentMethod
   */
  validatePaymentMethodIsHidden: {
    value: function (paymentMethod) {
      switch (paymentMethod.toLowerCase()) {
        case 'atstore':
          expect(this.payAtStoreCheckbox.isVisible()).to.equal(false);
          break;
        case 'creditcard':
          expect(this.payWithCreditCardCheckbox.isVisible()).to.equal(false);
          break;
        case 'ondelivery':
          expect(this.payOnDeliveryCheckbox.isVisible()).to.equal(false);
          break;
        case 'giftcard':
          expect(this.payWithGiftCardCheckbox.isVisible()).to.equal(false);
          break;
        case 'deferred':
          expect(this.payWithDeferredCheckbox.isVisible()).to.equal(false);
          break;
      }
    }
  },

  /**
   * Fills credit card form
   *
   * @param {Object} creditCardDetails
   * @param {String} creditCardDetails.cardNumber
   * @param {String} creditCardDetails.expiryMonth
   * @param {String} creditCardDetails.expiryYear
   * @param {String} creditCardDetails.cvv
   * @param {String} creditCardDetails.cardHolder
   */
  fillCreditCardForm: {
    value: function (creditCardDetails) {
      this.cardNumber.waitForEnabled();
      this.cardNumber.setValue(creditCardDetails.cardNumber);
      this.expiryMonth.selectByValue(creditCardDetails.expirationMonth);
      this.expiryYear.selectByValue(creditCardDetails.expirationYear);
      this.cvv.setValue(creditCardDetails.cvv);
      this.cardHolder.setValue(creditCardDetails.cardHolder);
    }
  },

  /**
   * Sets save card information checkbox for later usage
   */
  saveCreditCardInformation: {
    value: function () {
      if (this.saveCardCheckbox.isEnabled === false) {
        this.saveCardCheckbox.click();
        browser.pause(1000); // TRIGGER AN API CALL}
      }
    }
  },

  /**
   * Submits Credit Card form
   */
  applyCreditCardToOrder: {
    value: function () {
      this.applyCreditCard.waitForEnabled();
      this.applyCreditCard.click();
      browser.waitForLoading(); // TRIGGER AN API CALL
    }
  },

  /**
   * Select payment method Cash on DeliveryViewSection
   */
  clickCashOnDelivery: {
    value: function () {
      this.saveCodButton.waitForEnabled();
      this.saveCodButton.click();
    }
  },

   /**
   * Select Age verification button for NP Deferred Payment method
   */
  clickAgeVerificationButton: {
    value: function () {
      this.ageVerificationCheckbox.waitForEnabled();
      this.ageVerificationCheckbox.click();
    }
  },

   /**
   * Apply Deferred payment and proceed to order.
   */
  applyDeferredButtonToOrder: {
    value: function () {
      browser.waitForLoading();
      this.saveDeferredButton.waitForEnabled();
      this.saveDeferredButton.click();
      browser.waitForLoading();
    }
  },

  /**
   * Choose Giftcard full payment and proceed to order.
   */
  applyGiftCardAmountToOrder: {
    value: function () {
      browser.waitForLoading();
      this.payChoiceButton.waitForEnabled();
      this.payChoiceButton.click();
      browser.waitForLoading();
    }
  },

  /**
   * Submits pay in store form
   */
  applyPayInStoreButton: {
    value: function () {
      browser.pause(1000);
      this.uniqloSelectStoreBtn.waitForEnabled();
      this.uniqloSelectStoreBtn.click();
    }
  },

  /**
   * Edits payment method type
   */
  changePaymentMethod: {
    value: function () {
      this.changePaymentType.waitForEnabled();
      this.changePaymentType.click();
      this.popupConfirmButton.waitForEnabled();
      this.popupConfirmButton.click();
    }
  },

  /**
   * Choose another credit card information.
   */
  chooseAnotherCreditCard: {
    value: function () {
      this.otherCardBtn.waitForEnabled();
      const otherCardBtnPos = browser.elementIdLocation(this.otherCardBtn.value.ELEMENT);
      browser.scroll(otherCardBtnPos.value.x, otherCardBtnPos.value.y);
      this.otherCardBtn.click();
    }
  },

  /**
   * Choose existign credit card information.
   */
  chooseExistingCreditCard: {
    value: function () {
      this.chooseCardBtn.waitForEnabled();
      this.chooseCardBtn.moveToObject(0, 0);
      this.chooseCardBtn.click();
      this.useSelectedCardBtn.waitForEnabled();
      this.useSelectedCardBtn.moveToObject(0, 0);
      this.useSelectedCardBtn.click();
    }
  },

  /**
   * Validates the url of payment pages and
   * confirm whether it is properly redirected to payment
   */
  validateUrlPath: {
    value: function () {
      browser.urlValidation('/checkout/payment');
    }
  },

  /**
   * edits gifting option
   */
  editGiftOption: {
    value: function () {
      browser.waitForLoading();
      this.giftingOptionEditButton.waitForEnabled();
      browser.waitForLoading();
      const giftingOptionEditButtonPos = browser.elementIdLocation(this.giftingOptionEditButton.value.ELEMENT);
      browser.scroll(giftingOptionEditButtonPos.value.x, giftingOptionEditButtonPos.value.y);
      this.giftingOptionEditButton.click();
      browser.pause(500);
    }
  },

  /**
   * adds gifting option
   */
  addGiftOption: {
    value: function () {
      browser.waitForLoading();
      this.giftingOptionAddButton.waitForEnabled();
      browser.waitForLoading();
      const giftingOptionAddButtonPos = browser.elementIdLocation(this.giftingOptionAddButton.value.ELEMENT);
      browser.scroll(giftingOptionAddButtonPos.value.x, giftingOptionAddButtonPos.value.y);
      // browser.pause(500);
      browser.waitForLoading();
      this.giftingOptionAddButton.click();
      // browser.pause(1000);
    }
  },

  /**
   *  Validates the credit card details
   * @param {Object} creditCardDetails
   * @param {String} creditCardDetails.cardNumber
   * @param {String} creditCardDetails.expiryMonth
   * @param {String} creditCardDetails.expiryYear
   * @param {String} creditCardDetails.cvv
   * @param {String} creditCardDetails.cardHolder
   */

  creditCardValidation: {
    value: function (creditCardDetails) {
      browser.waitForLoading();
      this.cardNumber.waitForEnabled();
      expect(this.applyCreditCard.isEnabled()).to.be.equal(false);
      this.cardNumber.setValue(creditCardDetails.cardNumber);
      expect(this.applyCreditCard.isEnabled()).to.be.equal(false);
      this.expiryMonth.selectByValue(creditCardDetails.expirationMonth);
      this.expiryYear.selectByValue(creditCardDetails.expirationYear);
      expect(this.applyCreditCard.isEnabled()).to.be.equal(false);
      this.cvv.setValue('1');
      expect(this.applyCreditCard.isEnabled()).to.be.equal(false);
      this.cvv.setValue(creditCardDetails.cvv);
      this.cardHolder.setValue(creditCardDetails.cardHolder);
      expect(this.applyCreditCard.isEnabled()).to.be.equal(true);
    }
  },

  /**
   *  Validates the credit card pop up messages
   */
  validateCreditCardToolTip: {
    value: function (errorMessage) {
      let field = "";
      switch (errorMessage) {
        case 'card number':
          this.cardNumber.setValue("");
          field = "cardNumber";
          break;
        case 'expiration date':
          this.expiryMonth.selectByIndex(0);
          this.expiryYear.selectByIndex(0);
          field = "expirationDate";
          break;
        case 'cvv':
          this.cvv.setValue("1");
          field = "cvv";
          break;
        case 'card holder name':
          this.cardHolder.setValue("");
          field = "cardHolderName";
          break;
      }

      if (field !== '') {
        browser.keys('Tab').pause(500);
        this.errorToolTip(i18n.validationCreditCard[field]).isVisible();
      }
    }
  },

  /**
   *  Validates the credit card pop up messages
   */
  validatePaymentPageErrorMessages: {
    value: function(errorScenario, isVisible) {
      this.paymentContainer.waitForEnabled();
      browser.pause(2000);
      expect(eval('i18n.' + errorScenario)).is.not.undefined;
      if(isVisible) {
        expect(this.paymentPageErrorMessage.getText()).to.include(eval('i18n.' + errorScenario));
      } else {
        if(this.paymentPageErrorMessage.isVisible()) {
          expect(this.paymentPageErrorMessage.getText()).to.not.include(eval('i18n.' + errorScenario));
        }
      }
    }
  },

  /**
   * Edits Delivery method type
   */
  changeDeliveryMethod: {
    value: function () {
      this.changeDeliveryMethodButton.waitForEnabled();
      this.changeDeliveryMethodButton.click();
      this.popupConfirmButton.waitForEnabled();
      this.popupConfirmButton.click();
    }
  },

  /**
   * Edits Shipping method type
   */
  changeShippingMethod: {
    value: function () {
      this.changeShippingMethodButton.waitForEnabled();
      this.changeShippingMethodButton.click();
    }
  },

  /**
   * Edits Delivery Address
   */
  editDeliveryAddress: {
    value: function () {
      browser.waitForLoading();
      this.deliveryAddressEditButton.waitForEnabled();
      this.deliveryAddressEditButton.click();
      this.popupConfirmButton.waitForEnabled();
      this.popupConfirmButton.click();
    }
  },

  /**
   * Check credit card form Visible/Hidden
   * @param {Bool} visible (TRUE/FAlSE)
   */
  creditCardFormIsVisible: {
    value: function (isVisible) {
     browser.waitForLoading();
     expect(this.creditCardForm.isVisible()).to.be.equal(isVisible);
    }
  },

  /**
   * Fill the new gift card details
   * @params {Object} giftCard
   * @params {String} giftCard.cardNumber
   * @params {String} giftCard.pin
   */
  fillNewGiftCardDetail: {
    value: function (giftcard) {
      this.giftCardCode.waitForEnabled();
      this.giftCardCode.setValue(giftcard.cardNumber);
      this.giftCardCvv.setValue(giftcard.pin);
    }
  },

/**
   *  Validates the gift card validation messages
   */
  validateGiftCardFields: {
    value: function (errorMessage) {
      let field = "";
      switch (errorMessage) {
        case 'card number':
          this.giftCardCode.setValue("0000");
          field = "giftCardCode";
          expect(this.giftCardError.isVisible()).to.be.equal(true);
          this.giftCardCode.setValue("9999100100000005");
          break;
        case 'pin number':
          this.giftCardCvv.setValue("1");
          field = "giftCardCvv";
          expect(this.giftCardError.isVisible()).to.be.equal(true);
          this.giftCardCvv.setValue("1234");
          break;
        case 'amount':
          this.giftCardAmount.setValue("400000000000");
          field = "giftCardCvv";
          expect(this.giftCardErrorTooltip.isVisible()).to.be.equal(true);
          this.giftCardAmount.setValue("100");
          break;
      }
    }
  },

  /**
   * To Apply the New Gift Card
   * @return {Boolean} true or false depending on card balence
   */
  applyNewGiftCard: {
    value: function () {
      this.applyGiftCard.waitForEnabled();
      this.applyGiftCard.click();
    }
  },

  /**
   * To Continue to review order after payment is set
   */
  continueToReviewOrder: {
    value: function () {
      browser.waitForLoading();
      if(this.continueAfterChoosingGiftCard.isVisible()) {
        this.continueAfterChoosingGiftCard.click();
      }
    }
  },

  /**
   * To choose the giftcard payment mode (full or some)
   * @params {String} paymentType
   */
  chooseGiftCardPaymentMode: {
    value: function (paymentType) {
      browser.waitForLoading();
      browser.pause(1000);
      switch (paymentType) {
        case 'part':
          this.paySomeAmount.waitForEnabled();
          browser.waitForLoading();
          this.paySomeAmount.click();
          break;
        case 'full':
          this.payFullAmount.waitForEnabled();
          browser.waitForLoading();
          this.payFullAmount.click();
          break;
      }
    }
  },

  /**
   * To enter the giftcard amount
   * @params {number} amount
   */
  enterGiftCardAmount: {
    value: function (amount) {
      this.payAmount.waitForEnabled();
      this.payAmount.setValue(amount);
    }
  },

  /**
   * To enter the giftcard amount
   * @params {number} amount
   */
  getGiftCardAmount: {
    value: function (amount) {
      this.payAmount.waitForEnabled();
      return this.payAmount.getValue();
    }
  },

  /**
   * To edit the giftcard amount
   * @params {number} amount
   */
  editGiftCardAmount: {
    value: function (giftCardIndex) {
      giftCardIndex = (giftCardIndex || 1) * 2;
      this.giftCardDetailsWrapper.waitForEnabled();
      if(this.editGiftCardAmountButton(giftCardIndex).isVisible()) {
        browser.waitForLoading();
        this.editGiftCardAmountButton(giftCardIndex).click();
      }
    }
  },

  /** Fill giftCardCode */
  fillGiftCardCode: {
    value: function (fieldValue) {
      this.giftCardCode.waitForVisible();
      this.giftCardCode.setValue(fieldValue);
    }
  },

  /** Fill giftCardCvv */
  fillGiftCardCvv: {
    value: function (fieldValue) {
      this.giftCardCvv.waitForVisible();
      this.giftCardCvv.setValue(fieldValue);
    }
  },

  /**
   * Verify gift card form not submitted
   *
   */
  verifyGiftCardFormNotSubmitted: {
    value: function () {
      let _this = this;
      browser.waitUntil(function () {
        return _this.applyGiftCard.isVisible();
      }, 6000, `Expected form to not submit but is submitted`);
    }
  },

  /**
   * Verify gift card amount not submitted
   *
   */
  verifyGiftCardAmountNotSubmitted: {
    value: function () {
      let _this = this;
      browser.waitUntil(function () {
        return _this.payChoiceButton.isVisible();
      }, 6000, `Expected form to not submit but is submitted`);
    }
  },

  /**
   * Verifies error tool tip is displayed and validates error message
   */
  verifyValidationErrorMessages: {
    value: function (errorScenario) {
      this.giftCardErrorTooltip.waitForVisible();
      expect(eval('i18n.' + errorScenario)).is.not.undefined;
      expect(this.giftCardErrorTooltip.getText()).to.include(eval('i18n.' + errorScenario));
      browser.waitForLoading();
    }
  },
  
  /**
   * Check gift card form Visible/Hidden
   * @param {Bool} visible (TRUE/FAlSE)
   */
  giftCardFormIsVisible: {
    value: function (isVisible) {
     browser.waitForLoading();
     expect(this.giftCardDetailsWrapper.isVisible()).to.be.equal(isVisible);
    }
  },

  /**
   * Deletes the gift card
   * @param {number} giftCardIndex
   */
  deleteGiftCard: {
    value: function(giftCardIndex) {
      this.deleteGiftCardBtn(giftCardIndex).waitForEnabled();
      const deleteGiftCardBtnPos = browser.elementIdLocation(this.deleteGiftCardBtn(giftCardIndex).value.ELEMENT);
      browser.scroll(deleteGiftCardBtnPos.value.x, deleteGiftCardBtnPos.value.y);
      browser.pause(4000);
      this.deleteGiftCardBtn(giftCardIndex).click();
      this.popupConfirmButton.waitForEnabled();
      this.popupConfirmButton.click();
      browser.waitForLoading();
      browser.pause(1000);
    }
  },

  /**
   *  Validate New Email in Payment Page
   */
  validateEmailInPaymentPage: {
    value: function () {
    testPrerequisites.setLoginCookies();
    testPrerequisites.setCartCookies();
    let JSESSIONIDCookie = browser.params.JSESSIONIDCookie;
    let mcnuCookie = browser.params.mcnuCookie;
    let tvuCookie = browser.params.tvuCookie;
      browser.call(() => {
        return testPrerequisites.billTo(JSESSIONIDCookie, mcnuCookie, tvuCookie).then((billToDetails) => {
          expect(billToDetails.orderer_eml_id).to.be.equal(browser.params.featureContext.registeredUser.email);
      });
      })
    }
  },
  /**
   * Confirms the gift card full payment
   */
   confirmGiftCard: {
    value: function() {
      this.confirmGiftCardButton.waitForEnabled();
      this.confirmGiftCardButton.click();
    } 
  },

  /**
   * Validates order credit card data against the input
   *
   * @param {Object} creditCardDetails
   * @param {String} creditCardDetails.cardNumber
   */
  validateCardData: {
    value: function (creditCardDetails) {
      this.creditCardNumber.waitForVisible();
      expect(this.creditCardNumber.getAttribute('innerText')).to.include(creditCardDetails.cardNumber.slice(-4));
    }
  },
  
  /**
   * Validates apply coupon is present
   */
  validateApplyCoupon: {
    value: function (visible) {
      browser.waitForLoading();
      expect(this.applyCouponButton.isVisible()).to.equal(visible);
    }
  },

  /**
   * Adds Credit Card CVV code
   */
  addCreditCardCVVCode: {
    value: function (cvvCode) {
      this.creditCardCVVCode.waitForEnabled();
      this.creditCardCVVCode.setValue(cvvCode);
    }
  },

  /**
   * Validates order cod data against the input
   *
   * @param {String} COD
   */
  validateCod: {
    value: function () {
      this.paymentMethodName.waitForVisible();
      expect(this.paymentMethodName.getAttribute('innerText')).to.include(i18n.reviewOrderCod);
    }
  },

  /**
   * Validates Pay in store selected
   *
   * @params {Object} storeInfo
   * @param {String} storeInfo.name
   * @param {String} storeInfo.storeDetails
   * @param {String} storeInfo.address
   * @param {String} storeInfo.openingTime
   * @param {String} storeInfo.distance
   * @param {String} storeInfo.description
   */
  validatePayInStore: {
    value: function (storeInfo) {
      this.paymentMethodName.waitForVisible();
      expect(this.paymentAddressCover.getAttribute('innerText')).to.include(storeInfo.name);
      expect(this.paymentStoreAddress.getAttribute('innerText')).to.include(storeInfo.address);
    }
  },

  /**
   * Validate Deferred Payment Method
   */
  validatePostPay: {
    value: function () {
      this.paymentMethodName.waitForVisible();
      expect(this.paymentMethodName.getAttribute('innerText')).to.include(i18n.reviewOrderPostPay);
    }
  },

  /**
   * Validates order gift card data against the input
   *
   * @param {Object} giftCard - Gift Card to be validated
   * @param {String} giftCard.cardNumber
   * @param {String} giftCard.amount
   *
   */
  validateGiftCardData: {
    value: function (giftCard, index) {
      this.giftCardElem(giftCard).waitForVisible();
    }
  },

  /**
   * Applies the gift card in part or full payment
   * 
   * @param {object} paymentMode
   * @param {object} usedGiftCard
   * @param {string} usedGiftCard.amount
   */
  applyGiftCardInPaymentPage: {
   value: function(paymentMode, usedGiftCard){
    this.chooseGiftCardPaymentMode('part');

    switch(paymentMode) {
      case 'full':
        usedGiftCard.amount = this.getGiftCardAmount();
        this.chooseGiftCardPaymentMode('full');
        this.applyGiftCardAmountToOrder();
        if (browser.params.featureContext.priceDetails.totalTaxIncluded) {
          browser.params.featureContext.priceDetails.totalTaxIncluded = 0;
        }
        break;

     case 'part':
        this.enterGiftCardAmount(usedGiftCard.amount);      
        let totalTaxIncluded = browser.params.featureContext.priceDetails.totalTaxIncluded;
        if(typeof totalTaxIncluded === 'undefined' || usedGiftCard.amount <= totalTaxIncluded){
            this.applyGiftCardAmountToOrder();
        }
        usedGiftCard.amount = i18n.currencySymbol + usedGiftCard.amount.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        if (browser.params.featureContext.priceDetails.totalTaxIncluded) {
          browser.params.featureContext.priceDetails.totalTaxIncluded = i18n.currencySymbol +
            (browser.params.featureContext.priceDetails.totalTaxIncluded.replace(/[^\d]+/g, '') - usedGiftCard.amount.replace(/[^\d]+/g, '')).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
        break;
      }
      browser.params.featureContext.paymentMethods.push(usedGiftCard);
    }
  }
};

module.exports = Object.create(Page, OrderPaymentPage);
