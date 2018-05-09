let Page = require('./page');
/**
 * ProductSelectMock Page Object
 *
 * @class e2e/pages/ProductSelectMockPage
 * @type {Page}
 */
let ProductSelectMockPage = {
  /**
   * define elements
   */
  selectProductIdRadio: {get: function () { return browser.element('//input[@id="inputTypeSelect"]'); }},
  selectProductDropdown: {get: function () { return browser.element('//select[@id="selectProductId"]'); }},
  typeProductIdRadio: {get: function () { return browser.element('//input[@id="inputTypeFill"]'); }},
  typeProductIdField: {get: function () { return browser.element('//input[@id="enterProductId"]'); }},
  selectQuantityDropdown: {get: function () { return browser.element('//select[@id="quantitySelect"]'); }},
  fetchSKUsButton: {get: function () { return browser.element('//div[@class="src-containers-App-App-appContent"]/div/button'); }},
  selectInventoryItemDropdown: {get: function () { return browser.element('//select[@id="inventory"]'); }},
  selectInseamTypeDropDown: {get: function () { return browser.element('//select[@id="inseam_type"]'); }},
  selectInseamLengthDropDown: {get: function () { return browser.element('//select[@id="inseam_length"]'); }},
  addToCartButton: {get: function () { return browser.element('//div[@class="src-containers-App-App-appContent"]/div/div/button'); }},
  goToCartButton: {get: function () { return browser.element('//div[@class="src-containers-App-App-appContent"]//a'); }},
  selectProductBrand: {get: function () { return browser.element('//select[@id="brandSelect"]'); }},

  /**
   * Overridden open function.
   * Opens /add-to-cart application page.
   * Validates if page is loaded by checking for some elements to be visible.
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/add-to-cart';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
      browser.pause(1000);
      this.fetchSKUsButton.waitForVisible();
    }
  },

  /**
   * Adds first available element from the dropdown box to cart.
   * // TODO Not working at the moment due to existing implementation
   */
  addProductsFromList: {
    value: function () {
      this.selectProductIdRadio.click();
      browser.pause(5000);
    }
  },

  /**
   * Adds an item to cart using a product object
   *
   * @param {Object} product
   * @param {String} products.id
   * @param {String} product.quantity
   */
  inputProduct: {
    value: function (product) {

      this.typeProductIdRadio.waitForEnabled();
      this.selectProductIdRadio.waitForEnabled();

      browser.pause(1000);
      this.typeProductIdRadio.click();

      this.typeProductIdField.setValue(product.id);

      if (product.quantity) {
        this.selectQuantityDropdown.selectByIndex(product.quantity - 1);
      } else {
        this.selectQuantityDropdown.selectByIndex(0);
      }
      this.fetchSKUsButton.click();
      this.selectInventoryItemDropdown.waitForVisible();
      browser.pause(500);
      if (product.sku === '') {
        this.selectInventoryItemDropdown.selectByIndex(0);
      } else {
        this.selectInventoryItemDropdown.selectByValue(product.sku);
      }
      if (typeof(product.inseamType) !== 'undefined' && product.inseamType !== '') {
        this.selectInseamTypeDropDown.selectByVisibleText(i18n.inseam[product.inseamType]);
      }
      if (typeof(product.inseamLength) !== 'undefined' && product.inseamLength !== '') {
        this.selectInseamLengthDropDown.selectByValue(product.inseamLength);
      }
      this.goToCartButton.moveToObject(0, 0);
      browser.pause(1000);
      this.addToCartButton.click();
      browser.pause(1000);
      browser.waitForLoading();
    }
  },

  /**
   * To select a store
   * @params {String} storeName, name of the store to be selected
   */
  selectAStore: {
    value: function(storeName){
      this.selectProductBrand.waitForVisible();
      this.selectProductBrand.selectByVisibleText(storeName);
      browser.params.queryString.brand = 'brand='+ (storeName || 'UQ').toLowerCase();
    }
  },

  /**
   * Adds item to cart.
   * If a product object is provided then it will be used.
   * Otherwise it will select the first available element from the dropdown box.
   *
   * @param {Object} product
   * @param {String} products.id
   * @param {String} product.quantity
   *
   * @return {String} itemSKU added to chart
   */
  addProductToCart: {
    value: function (product) {
      if(product.store) {
        this.selectAStore(product.store);
      }

      if (product) {
        return this.inputProduct(product);
      } else {
        return this.addProductsFromList();
      }
    }
  }
};

module.exports = Object.create(Page, ProductSelectMockPage);
