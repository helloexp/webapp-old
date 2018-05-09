let Page = require('./page');

/**
 * Delivery Page Object
 *
 * @class e2e/pages/GiftingOptionPage
 * @type {Page}
 */
let GiftingOptionPage = {
  /**
   * define elements
   */

  acceptButton: {get: function () { return browser.element('//button[contains(@class, "accept")]');}},
  giftingOptionUniqloDirect: {get: function () { return browser.element('//input[@name="box" and @value="14"]/..');}},
  giftingOptionUniqloMaterial: {get: function () { return browser.element('//input[@name="box" and @value="06"]/../..');}},
  giftingOptionUniqloBox: {get: function () { return browser.element('//input[@name="box" and @value="14"]/..');}},
  giftingOptionUniqloBoxMaterial: {get: function () { return browser.element('//input[@name="box" and @value="14"]/..');}},
  giftingOptionNone: {get: function () { return browser.element('//input[@name="noBox"]');}},
  giftingOptionUniqloDirectPrice: {get: function () { return browser.element('//input[@name="box" and @value="14"]/../../div//span[contains(@class, "price")]');}},
  giftingOptionUniqloMaterialPrice: {get: function () { return browser.element('//input[@name="box" and @value="06"]/../../div//span[contains(@class, "price")]');}},
  giftingOptionUniqloBoxPrice: {get: function () { return browser.element('//input[@name="box" and @value="14"]/../../div//span[contains(@class, "price")]');}},
  giftingOptionUniqloBoxMaterialPrice: {get: function () { return browser.element('//input[@name="box" and @value="14"]/../../div//span[contains(@class, "price")]');}},
  giftingMessageOptionUniqlo: {get: function () { return browser.element('//input[@name="card" and @value="01"]/..');}},
  giftingMessageOptionUniqloPrice: {get: function () { return browser.element('//input[@name="card" and @value="01"]/../..//span[contains(@class,"price")]');}},
  giftingMessageOptionUniqloSquare: {get: function () { return browser.element('//input[@name="card" and @value="03"]/..');}},
  giftingMessageOptionNoMessage: {get: function () { return browser.element('//input[@name="noCard"]/..');}},
  giftingMessageBox: {get: function () { return browser.element('//textarea[contains(@class, "giftTextArea")]');}},
  giftingOptionGUDirect: {get: function () { return browser.element('//input[@name="box" and @value="03"]/..');}},
  giftingOptionGUMaterial: {get: function () { return browser.element('//input[@name="box" and @value="04"]/..');}},
  giftingMessageOptionGU: {get: function () { return browser.element('//input[@name="card" and @value="02"]/..');}},
  giftingOptionGUDirectPrice: {get: function () { return browser.element('//input[@name="box" and @value="03"]/../../div//span[contains(@class, "price")]');}},
  giftingOptionGUMaterialPrice: {get: function () { return browser.element('//input[@name="box" and @value="04"]/../../div//span[contains(@class, "price")]');}},
  giftingOptionsFinder: {get: function () {return browser.element('//div[contains(@class,"wrapConfirmMessage") and contains(@class,"Gifting")]/div')}},

  /**
   * Gifting validation
   */

  giftingOptionElem: {get: function () { return browser.element('//div[contains(@class, "giftPanel")]/div[contains(@class, "expanded")]/div[1]'); }},
  giftingOptionMessage: {get: function () { return browser.element('//div[contains(@class, "giftPanel")]//div[contains(@class, "messageBlockContainer")]'); }},
  giftingOptionMessageAmt: {get: function() { return browser.element('//div[contains(@class, "messageBlockContainer")]//div[contains(@class, "messageTopHead")]'); }},

  /**
   * Overridden open function.
   *
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/checkout/gifting';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   *  choose a gifting option
   *  @params {String} giftingOption Gifting Option to be applied
   *  @return {String} giftingOption price
   */
  chooseGiftOption: {
    value: function (giftingOption) {
      this.giftingOptionNone.waitForEnabled();
      const giftingOptionPos = browser.elementIdLocation(this.giftingOptionsFinder.value.ELEMENT);
      browser.scroll(giftingOptionPos.value.x, giftingOptionPos.value.y);
      browser.waitForLoading();
      switch (giftingOption) {
        case 'uniqlodirect':
          this.giftingOptionUniqloDirect.click();
          return this.giftingOptionUniqloDirectPrice.getText();
        case 'uniqlomaterial':
          this.giftingOptionUniqloMaterial.click();
          return this.giftingOptionUniqloMaterialPrice.getText();
        case 'uniqlobox':
          this.giftingOptionUniqloBox.click();
          return this.giftingOptionUniqloBoxPrice.getText();
        case 'uniqloboxmaterial':
          this.giftingOptionUniqloBoxMaterial.click();
          return this.giftingOptionUniqloBoxMaterialPrice.getText();
        case 'gudirect':
          this.giftingOptionGUDirect.click();
          return this.giftingOptionGUDirectPrice.getText();
        case 'gumaterial':
          this.giftingOptionGUMaterial.click();
          return this.giftingOptionGUMaterialPrice.getText();
        default:
          this.giftingOptionNone.click();
      }
      return '';
    }
  },

  /**
   *  validate the gift card section visible
   *  @params {String} giftingMessageOption Gifting Message Option to be applied
   *  @params {Object} giftOption
   *  @param  {String} giftOption.message
   */
  chooseGiftingMessage: {
    value: function (giftOption) {
      let price = '';

      this.giftingMessageOptionNoMessage.waitForEnabled();
      const giftingMessageOptionNoMessagePos = browser.elementIdLocation(this.giftingOptionsFinder.value.ELEMENT);
      browser.scroll(giftingMessageOptionNoMessagePos.value.x, giftingMessageOptionNoMessagePos.value.y);

      switch (giftOption.messageType) {
        case 'uniqlo':
          const uqGiftMsg = browser.elementIdLocation(this.giftingMessageOptionUniqlo.value.ELEMENT);
          browser.scroll(uqGiftMsg.value.x, uqGiftMsg.value.y);
          this.giftingMessageOptionUniqlo.click();
          price = this.giftingMessageOptionUniqloPrice.getText();
          this.giftingMessageBox.waitForEnabled();
          this.giftingMessageBox.setValue(giftOption.message);
          break;
        case 'uniqloSquare':
          this.giftingMessageOptionUniqloSquare.click();
          this.giftingMessageBox.waitForEnabled();
          this.giftingMessageBox.setValue(giftOption.message);
          break;
        case 'gu':
          this.giftingMessageOptionGU.click();
          this.giftingMessageBox.waitForEnabled();
          this.giftingMessageBox.setValue(giftOption.message);
          break;
        default:
          this.giftingMessageOptionNoMessage.click();
      }

      this.acceptButton.click();
      return price || '';
    }
  },

  /**
   * Validates order address data against the CVS
   * @params {Object} giftingOptionDetails
   * @param {String} giftingOptionDetails.amount
   * @param {String} giftingOptionDetails.message
   * @param {String} giftingOptionDetails.giftingOptionType
   */
  validateGiftingOption: {
    value: function (giftingOption) {
      this.giftingOptionElem.waitForVisible();
      let giftMessage= parseInt((this.giftingOptionMessageAmt.getAttribute('innerText').match(/\d+/g) || ['0']).join(''));
      let giftBox= parseInt((this.giftingOptionElem.getAttribute('innerText').match(/\d+/g) || ['0']).join(''));
      let giftTotal= giftBox+giftMessage;
      expect(giftTotal.toString()).to.include(giftingOption.amount.match(/\d+/g).join());

      switch (giftingOption.type) {
        case 'uniqlobox': {
          expect(this.giftingOptionElem.getAttribute('innerText')).to.include(i18n.giftingOptionUniqloBox);
          break;
        }
        case 'uniqloboxmaterial': {
          expect(this.giftingOptionElem.getAttribute('innerText')).to.include(i18n.giftingOptionUniqloBoxMaterial);
          break;
        }
      }
      if (giftingOption.message && giftingOption.message.length > 0) {
        expect(this.giftingOptionMessage.getAttribute('innerText')).to.include(giftingOption.message);
      }
    browser.waitForLoading();
    browser.pause(1000);
    }
  }
};

module.exports = Object.create(Page, GiftingOptionPage);
