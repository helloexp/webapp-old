let Page = require('./page');
/**
 * Cart Page Object
 *
 * @class e2e/pages/CartPage
 * @type {Page}
 */
let CartPage = {

  /**
   * define elements
   */
  errorMessage: {get: function () { return browser.element('//div[contains(@class,"ErrorMessage") and contains(@class,"errorText")]'); }},
  loginButton: { get: function () { return browser.element('//div[@class="src-components-Header-styles-firstButton"]'); } },
  logoutButton:  { get: function () { return browser.element('//div[@class="src-components-Header-styles-firstButton"]'); } },

  productElem: {
    value: function (p) {
      let productQuery = `//div[contains(@class,"cartData")][contains(., "${p.id}")]`;
      productQuery += p.color ? `[contains(.,"${p.color}")]` : '';
      productQuery += p.size ? `[contains(.,"${p.size}")]` : '';
      productQuery += p.length ? `[contains(.,"${p.length}")]` : '';
      productQuery += p.inseamLength ? `[contains(.,"${p.inseamLength}")]` : '';
      //productQuery += `]`;
      return browser.element(productQuery);
    }
  },
  productsQuantity: {
    value: function (p) {
      let productQuery = `//div[contains(@class,"cartData")][contains(., "${p.id}")]`;
      productQuery += p.color ? `[contains(.,"${p.color}")]` : '';
      productQuery += p.size ? `[contains(.,"${p.size}")]` : '';
      productQuery += p.length ? `[contains(.,"${p.length}")]` : '';
      productQuery += p.inseamLength ? `[contains(.,"${p.inseamLength}")]` : '';
      productQuery += `/..//select[contains(@class, "Select-styles-select")]`;
      return browser.element(productQuery);
    }
  },
  productRemoveButton: {
    value: function (p) {
      let productQuery = `//div[contains(@class,"cartData")][contains(.,"${p.id}")]`;
      productQuery += p.color ? `[contains(.,"${p.color}")]` : '';
      productQuery += p.size ? `[contains(.,"${p.size}")]` : '';
      productQuery += p.length ? `[contains(.,"${p.length}")]` : '';
      productQuery += p.inseamLength ? `[contains(.,"${p.inseamLength}")]` : '';
      productQuery += `/..//*[contains(@class,'deleteButton')]`;
      return browser.element(productQuery);
    }
  },

  freeShippingMessage: {get: function () { return browser.element('//div[contains(@class,"styles-message txt")]');}},
  giftOptionCheckbox: {get: function () { return browser.element('//label[contains(@class,"checked")]');}},
  giftOptionCheckboxLabel: {get: function () { return browser.element('//input[contains(@id,"GiftCheckBox")]/..');}},
  checkoutButtonFinder: {get: function () { return browser.element('//div[contains(@class, "copyright")]');}},
  checkoutButton: {get: function () { return browser.element('//button[contains(@class, "purchaseBtn")]');}},
  orderSummaryPanel: {get: function () { return browser.element('//div[contains(@class,"orderSummaryPanel")]');}},
  orderSummaryPriceDetails: {value: function (t) { return browser.element(`//div[text()="${t}" and contains(@class, "OrderSummary")]/../div[contains(@class,"itemPrice")]`);}},
  orderSummaryTotalPrice: {value: function (t) { return browser.element(`//div[text()="${t}" and contains(@class, "OrderSummary")]/../div[contains(@class,"totalItemPrice")]`);}},
  totalProductCount: {get: function () { return browser.element('(//div[contains(@class, "BrandHeader")]//div[contains(@class, "blockText")])[1]');}},
  couponPanel: {get: function () { return browser.element('//a[contains(@class, "CouponPanel")]'); }},
  appliedCoupons: {get: function () { return browser.element('(//div[contains(@class, "CouponPanel")])[2]'); }},
  changeCouponButton: {get: function () { return browser.element('//div[contains(@class,"CouponPanel")]//button');}},
  popupConfirmButton: {get: function () { return browser.element('//div[contains(@class,"stickyBoxFooter")]/button[2]');}},
  dismissMergingAlertButton: {get: function () { return browser.element('//div[contains(@class,"alertBox")]//button[contains(@class,"alertButton")]');}},
  contactUsButton: {get: function () { return browser.element('//a[contains(@class,"CustomerServiceButton")][contains(@href, "https://faq.uniqlo.com")]');}},
  guLogoFooter: {get: function () {return browser.element('//div[contains(@class,"guLogoContainer")][2]');}},
  enquiryButton: {get: function () { return browser.element('//div[contains(@class, "inner clearfix")]'); }},
  recentlyViewed: {value: function (text) { return browser.element(`(//div[contains(@class, "imageSection")]//a[contains(@href,"${text}")])`);}},
  emptyMessage: {get: function () {return browser.element('//div[contains(@class,"emptyMsg txt")]');}},

  /**
   * Overridden open function.
   * Opens /cart application page
   */
  open: {
    value: function (cartType) {
      let path = 'jp' + '/cart';
      path += cartType ? '?brand=' + cartType : '?brand=uq'; // default as brand=uq
      Page.open(path);
      this.checkoutButtonFinder.waitForEnabled();
    }
  },

  /**
   * Goes to Login page
   */
  goToLogin: {
    value: function () {
      this.loginButton.waitForEnabled();
      browser.waitForLoading();
      try {
        this.loginButton.click();
      } catch (e) {
        if (e.message.indexOf('cannot determine loading status')) {
          console.log('Error = ' + e.message);
          console.log('Refreshing current page');
          browser.refresh();
        }
      }
    }
  },

  /**
   * Validates if login is successful by checking for the Log Out button
   */
  validateLogin: {
    value: function () {
      this.logoutButton.waitForVisible();
    }
  },

  /**
   * User logs out of the app
   */
  logout: {
    value: function () {
      this.logoutButton.click();
      this.popupConfirmButton.waitForVisible();
      this.popupConfirmButton.click();
    }
  },

  /**
   * Forces a cookie set after user registration
   */
  forceAddOfCookies: {
    value: function (cartType) {
      browser.pause(1000);
      this.open(cartType);
      this.logoutButton.waitForVisible();
      this.validateCartPageURL();
    }
  },

  /**
   * To dismiss the alert of merging products into user cart
   */
  dismissMergingAlert: {
    value: function () {
      try {
        this.dismissMergingAlertButton.waitForVisible(8000);
        browser.waitForLoading();
        this.dismissMergingAlertButton.click();
        browser.pause(1500);
      } catch (e) {
      }
    }
  },

  /**
   * to trigger the checkout
   */
  triggerCheckout: {
    value: function () {
      browser.waitForLoading();
      this.checkoutButtonFinder.waitForEnabled();
      const checkoutPos = browser.elementIdLocation(this.checkoutButtonFinder.value.ELEMENT);
      browser.scroll(checkoutPos.value.x, checkoutPos.value.y);
      browser.waitForLoading();
      this.checkoutButton.click();
    }
  },

  /**
   * To enable the gift option
   *
   * @param {Boolean} enable true/false
   *
   */
  enableGiftOption: {
    value: function (enable) {
      browser.waitForLoading();
      this.checkoutButtonFinder.waitForExist();
      const giftOptionPos = browser.elementIdLocation(this.checkoutButtonFinder.value.ELEMENT);
      browser.scroll(giftOptionPos.value.x, giftOptionPos.value.y);
      if (!this.giftOptionCheckbox.isVisible()) {
      this.giftOptionCheckboxLabel.click();
      }
    }
  },

  /**
   * Delete products from cart
   *
   * @params {Array} products
   * Array of products to be deleted, can accept single product as object
   */
  deleteProductsFromCart: {
    value: function (product) {
      this.productRemoveButton(product).waitForVisible();
      browser.waitForLoading();
      const deleteProductPos = browser.elementIdLocation(this.checkoutButtonFinder.value.ELEMENT);
      browser.scroll(deleteProductPos.value.x, deleteProductPos.value.y);
      expect(this.productRemoveButton(product).isVisible()).to.equal(true);
      this.productRemoveButton(product).click();
      this.popupConfirmButton.waitForVisible();
      this.popupConfirmButton.click();
      browser.pause(4000); // TRIGGER AN API, NEED TO HAVE WAIT FOR THAT
    }
  },

  /**
   * Validates that the cart is empty
   */
  validateCartIsEmpty: {
    value: function () {
      expect(this.emptyMessage.isVisible()).to.equal(true);

    }
  },

  /**
   * Updates the product quantity in cart page at the given index
   *
   * @param {Object} product, the product added
   */
  updateQuantity: {
    value: function (product, multiBuyQty) {
      let qty = multiBuyQty || product.quantity.toString();
      this.productsQuantity(product).waitForVisible();
      this.productsQuantity(product).selectByValue(qty);
      browser.pause(4000);
    }
  },

  /**
   * To open the order summary
   */
  openOrderSummarySection: {
    value: function () {
      browser.pause(500);
      this.checkoutButtonFinder.waitForVisible();
      browser.waitForLoading();
      const openOrderSummaryPos = browser.elementIdLocation(this.checkoutButtonFinder.value.ELEMENT);
      browser.scroll(openOrderSummaryPos.value.x, openOrderSummaryPos.value.y);
      browser.pause(500);
      this.orderSummaryPanel.waitForVisible();
      this.orderSummaryPanel.click();
    }
  },

  /**
   * Gets price details to be validated on Mini Bag
   *
   * @return {Object} priceDetails
   * @return {String} priceDetails.totalMerchandise
   * @return {String} priceDetails.totalTaxIncluded
   * @return {String} priceDetails.saleTax
   * @return {String} priceDetails.fengShiAmount
   * @return {String} priceDetails.correctionFee
   * @return {String} priceDetails.giftFee
   * @return {String} priceDetails.postage
   * @return {String} priceDetails.coupon
   */
  getPriceDetails: {
    value: function () {
      let priceDetails = {};
      priceDetails.totalMerchandise = this.orderSummaryPriceDetails(i18n.priceDetails.totalMerchandise).getText();
      priceDetails.saleTax = this.orderSummaryPriceDetails(i18n.priceDetails.saleTax).getText();
      priceDetails.fengShiAmount = this.orderSummaryPriceDetails(i18n.priceDetails.fengShiAmountText).isExisting() ?
        this.orderSummaryPriceDetails(i18n.priceDetails.fengShiAmountText).getText() : '';
      priceDetails.correctionFee = this.orderSummaryPriceDetails(i18n.priceDetails.correctionFee).isExisting() ?
        this.orderSummaryPriceDetails(i18n.priceDetails.correctionFee).getText() : '';
      priceDetails.giftFee = this.orderSummaryPriceDetails(i18n.priceDetails.giftFee).isExisting() ?
        this.orderSummaryPriceDetails(i18n.priceDetails.giftFee).getText() : '';
      priceDetails.postage = this.orderSummaryPriceDetails(i18n.priceDetails.postage).isExisting() ?
        this.orderSummaryPriceDetails(i18n.priceDetails.postage).getText() : '';
      priceDetails.coupon = this.orderSummaryPriceDetails(i18n.priceDetails.coupon).isExisting() ?
        this.orderSummaryPriceDetails(i18n.priceDetails.coupon).getText() : '';
      priceDetails.totalTaxIncluded = this.orderSummaryTotalPrice(i18n.priceDetails.totalTaxIncluded).getText();
      priceDetails.totalCartPrice = this.orderSummaryTotalPrice(i18n.priceDetails.totalTaxIncluded).getText();

      return priceDetails;
    }
  },

  /**
   * To open the coupon panel
   */
  openCouponPanel: {
    value: function () {
      browser.pause(1250); // The coupon add API call takes some time
      browser.waitForLoading();
      this.checkoutButtonFinder.waitForExist();
      const openCouponPanelPos = browser.elementIdLocation(this.checkoutButtonFinder.value.ELEMENT);
      browser.scroll(openCouponPanelPos.value.x, openCouponPanelPos.value.y);
      this.couponPanel.click();
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
   * Validates if product quantity was updated
   */
  validateQuantityUpdate: {
    value: function (product) {

      this.productsQuantity(product).waitForEnabled();
      browser.waitUntil(() => {
        return this.productsQuantity(product).getValue() === product.quantity.toString();
      }, 8000, `Expected product ${product.sku} quantity to be ${product.quantity} but was ${this.productsQuantity(product).getValue()}`);
    }
  },

  /**
   * To Validate the cart Url
   */
  validateCartPageURL: {
    value: function () {
      browser.urlValidation('/cart');
    }
  },

  /**
   * Goto Contact US
   */
  gotoContactUs: {
    value: function () {
      const gotoContactPos = browser.elementIdLocation(this.guLogoFooter.value.ELEMENT);
      browser.scroll(gotoContactPos.value.x, gotoContactPos.value.y);
      this.contactUsButton.waitForVisible();
      this.contactUsButton.click();
      browser.newWindow(this.contactUsButton.getAttribute('href'));
    }
  },

  /**
   * To Validate the FAQ page Url
   */
  validateFAQURL: {
    value: function () {
      var url = browser.url();
      expect(url.value).to.include("https://faq.uniqlo.com");
      this.enquiryButton.waitForVisible();
      browser.close();
    }
  },

  /**
   * Validates that product with color, size, length, inseam is present in cart
   * @params {Object} product
   * @param {String} product.color
   * @param {String} product.size
   * @param {String} product.length
   */
  validateProductPresentInCart: {
    value: function (product) {
      this.productElem(product).waitForVisible();
    }
  },

  /**
   * Validates that product with color, size, length, inseam is not present in cart
   * @params {Object} product
   * @param {String} product.color
   * @param {String} product.size
   * @param {String} product.length
   */
  validateProductNotPresentInCart: {
    value: function (product) {
      let _this = this;
      browser.waitUntil(function () {
        return _this.productElem(product).isExisting() === false;
      }, 5000, `Expected product "${product.sku}" to be deleted from cart`);
    }
  },

  /**
   * validate the cart messages for product price. If product price> 5000, 
     free shipping available and otherwise not
   */
  validateCartMesageForFreeShipping: {
    value: function (cartType) {

      if(cartType === 'uq'){
        let totalMerchandise = this.orderSummaryPriceDetails(i18n.priceDetails.totalMerchandise).getText().match(/\d+/g).join();
        let totalMerchandiseAmount = totalMerchandise.replace(',', '');
        const messagePos = browser.elementIdLocation(this.freeShippingMessage.value.ELEMENT);
        browser.scroll(messagePos.value.x, messagePos.value.y);
        if(totalMerchandiseAmount > 5000) {
          expect(this.freeShippingMessage.getAttribute('innerText')).to.include(i18n.freeShippingAvailableMesage);
        }
        else{
          expect(this.freeShippingMessage.getAttribute('innerText')).to.include(i18n.freeShippingNotAvailableMesage);
        
        }
      }
      if(cartType === 'gu'){
        expect(this.freeShippingMessage.getAttribute('innerText')).to.equal(i18n.guShippingMessageonCart);
      }
    }
  },

  /**
   * Validates the coupon applied
   * @params {String} couponName, applied coupon
   */
  validateAppliedCoupon: {
    value: function (couponName) {
      browser.pause(5000);
      this.appliedCoupons.waitForVisible();
      expect(this.appliedCoupons.getText()).to.include(couponName);
    }
  },

  /**
   * Validates Coupon deduction amount equals coupon value
   */
  validateCouponAmount: {
    value: function (couponAmount) {
      this.orderSummaryPriceDetails(i18n.priceDetails.coupon).waitForVisible();
      expect(this.orderSummaryPriceDetails(i18n.priceDetails.coupon).getText()).to.include(couponAmount);
    }
  },

  /**
   * Validates that Price limit of 100.000 Yen error is displayed
   */
  validatePriceLimitErrorMessage: {
    value: function () {
      this.errorMessage.waitForVisible();
      expect(this.errorMessage.getAttribute('innerText')).to.equal(i18n.cartSizeErrorMessage);
    }
  },

  /**
   * Validates that Size limit of 99 products error is displayed
   */
  validateSizeLimitErrorMessage: {
    value: function (errorMessage) {
      this.errorMessage.waitForVisible();
      expect(this.errorMessage.getAttribute('innerText')).to.equal(i18n.cartLimitErrorMessage);
    }
  },

  /**
   * Verifies the card gift card details
   */
  verifyCartGiftCardDetails: {
    value: function (priceDetails) {
      this.orderSummaryTotalPrice(i18n.priceDetails.totalTaxIncluded).waitForVisible();
      expect(this.orderSummaryPriceDetails(i18n.priceDetails.giftCard).isVisible()).to.equal(false);
      expect(this.orderSummaryTotalPrice(i18n.priceDetails.totalTaxIncluded).getText()).to.equal(priceDetails.totalCartPrice);
    }
  },

  /**
   * Validates the total products added in cart
   */
  validateTotalProducts: {
    value: function (totalProducts) {
      this.totalProductCount.waitForVisible();
      expect(parseInt((this.totalProductCount.getText().match(/\d+/g) || ['0']).join(''))).to.equal(totalProducts);
    }
  },

  /**
   * Validates the recently viewed items
   */
  validateRecentlyViewed: {
    value: function(recentProduct) {
      browser.waitForLoading();
      browser.pause(1500);
      expect(this.recentlyViewed(recentProduct).isVisible()).to.equal(true);
      this.recentlyViewed(recentProduct).swipeLeft();
    }
  }
};

module.exports = Object.create(Page, CartPage);
