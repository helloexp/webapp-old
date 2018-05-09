let Page = require('./page');
/**
 * ProductSelectMock Page Object
 *
 * @class e2e/pages/ProductSelectMockPage
 * @type {Page}
 */
let ProductSelectPage = {

  // UQ Product
  /**
   * define elements
   */

 uq: {
    get: function () {
      return {
        selectColor: function (prodDetails) {
          return browser.element(`//span[contains(@analytics-label,"-color-${prodDetails[1]}")]`);
        }, 
        selectSize: function (prodDetails) { 
          return browser.element(`(//span[contains(@analytics-label,"-size-${prodDetails[2]}")])[2]`);
        },
        selectLength: function (prodDetails) {
          return browser.element(`//span[contains(@analytics-label,"-length-${prodDetails[3]}")]`);
        },
        selectQuantity: browser.element('//div[@class="uni-new-combobox-container"]//select'),
        selectInseam: browser.element('//div[@class="uni-new-alterations-container"]//select'),
        selectInseamLength: browser.element('//div[@class="uni-product-alteration-length uni-select-container uni-native-select"]//select'),
        footerLink: browser.element('//div[@class="uni-tab-title"]'),
        addToCart: browser.element('(//button[@class="uni-product-add-to-cart-button"])[1]'),
        popUp: browser.element('//div[@class="cart-button2"]'),
      };
    }
  },

  // GU Product
  /**
   * define elements
   */

  gu: {
    get: function () {
      return {
        selectColor: function (prodDetails) {
          return browser.element(`(//li[@color="${prodDetails[1]}"])[2]`);
        },
        selectSize: browser.element('//select[@id="listChipSize"]'),
        selectLength: browser.element('//select[@id="listChipLength"]'),
        selectQuantity: browser.element('//select[@id="selectNum"]'),
        inventory: browser.element('//div[@id="oshirase_bnr"]'),
        addToCart: browser.element('//input[@type="submit"]'),
        popUp: browser.element('//div[@class="cartOk"]'),
      };
    }
  },

  /**
   * Opens /add-to-cart application page.
   */

  open: {
    value: function (productDetails) {
      let browserUrl = `https://prodtest.uniqlo.com/jp/store/goods/${productDetails.id}`;
      browser.url(browserUrl);
    }
  },

  /**
   * Add product to cart depending on store type
   * Takes the product details from the cases
   *
   * @param {Object} product
   */

  addProductTocart: {
    value: function (productDetails) {
       this.open(productDetails);
       const product = productDetails.sku.split('-');
       if(productDetails.store) {
          console.log('GU product added');
          this.selectGUProduct(productDetails, product);
          this.addGUProductToCart();
       } else {
          console.log('UQ product added');
          this.selectUQProduct(productDetails, product);
          this.addUQProductToCart();
       }
    }
  },

  /**
   * select product to cart depending on store type
   * Takes the product details from the cases
   *
   * @param {Object} product
   */

  selectProductTocart: {
    value: function (productDetails) {
       this.open(productDetails);
       const product = productDetails.sku.split('-');
       if(productDetails.store) {
          console.log('GU product selected');
          this.selectGUProduct(productDetails, product);
       } else {
          console.log('UQ product selected');
          this.selectUQProduct(productDetails, product);
       }
    }
  },

  /**
   * Select an item to cart using a product object
   *
   * @param {Object} product
   * @param {String} productDetails
   */

  selectUQProduct: {
    value: function (productDetails, product) {
      this.uq.footerLink.waitForVisible();
      this.uq.footerLink.moveToObject(0, 0);
      this.uq.selectColor(product).waitForVisible();
      this.uq.selectColor(product).click();
      browser.waitForLoading();
      if(this.uq.selectSize(product).isExisting()) { 
        this.uq.footerLink.moveToObject(0, 0);
        this.uq.selectSize(product).click();
      }
      browser.waitForLoading(); 
      if(this.uq.selectLength(product).isExisting()) {       
        this.uq.footerLink.moveToObject(0, 0);
        this.uq.selectLength(product).click();
      }

      if(!productDetails.inseamType == '') {
        this.uq.selectInseam.waitForVisible();
        this.uq.selectInseam.selectByVisibleText(i18n.inseam[productDetails.inseamType]);
      }

      if(!productDetails.inseamLength == '') {
        this.uq.selectInseamLength.waitForVisible();
        this.uq.selectInseamLength.selectByVisibleText(productDetails.inseamLength+'cm');
      }
      this.uq.selectQuantity.waitForVisible();
      this.uq.selectQuantity.selectByIndex(productDetails.quantity - 1);
     }
  },

  /**
   * Select an item to cart using a product object
   *
   * @param {Object} product
   * @param {String} productDetails
   */

   selectGUProduct: {
   value: function (productDetails, product) {

     this.gu.inventory.waitForLoading();
     this.gu.inventory.moveToObject(0, 0);
     browser.waitForLoading();
     this.gu.selectColor(product).waitForVisible();
     this.gu.selectColor(product).click();
     browser.waitForLoading();
     if(this.gu.selectSize.isExisting())
     {
        this.gu.selectSize.selectByVisibleText(productDetails.size);
     }

     if(this.gu.selectLength.isExisting())
     {        
        this.gu.selectLength.selectByValue(product[3]);
     }
     this.gu.selectQuantity.selectByIndex(productDetails.quantity - 1);
  }
 },

  /**
   *  Add UQ products to cart
   */

   addUQProductToCart: {
    value:function () {
      this.uq.footerLink.moveToObject(0, 0);
      this.uq.addToCart.click();
      this.uq.popUp.waitForVisible();
    }
   },

  /**
   *  Add GU products to cart
   */

   addGUProductToCart: {
    value:function () {
      this.gu.addToCart.click();
      this.gu.popUp.waitForVisible();
    }
   }
};

module.exports = Object.create(Page, ProductSelectPage);