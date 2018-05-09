let Page = require('./page');

/**
 * uniqloStoreSearch Page Section
 *
 * @class e2e/pages/commons/uniqloStoreSearchPage
 */
let UniqloStoreSearchPage = {

  /**
   * define elements
   */
  firstUniqloStoreSelectButton: {get: function () { return browser.element('//div[contains(@class,"store")]/div[contains(@class,"action")]//button');}},
  uniqloStoreSelectButton: {value: function (store) {return browser.element(`//h6[contains(.,"${store.name}")]/../..//button`);}},
  uniqloStoreInformation: {get: function () {return browser.element('//div[contains(@class,"StoreSelector")][contains(@class,"content")]');}},
  uniqloStoreInfoAddress: {get: function () {return browser.element('//div[contains(@class,"StoreSelector")][contains(@class,"content")]/div[1]');}},
  uniqloStoreSearch: {get: function () { return browser.element('//div[contains(@class,"searchBox")]/div/input');}},
  confirmUniqloStoreButton: {get: function () {return browser.element('//button[contains(@class,"StoreSelector")][contains(@class,"accept")]');}},


  /**
   * Search for a particular Uniqlo store
   * @params {Object} uniqloStore , store to be searched
   * @param {Object} name , store name to be searched
   */
  searchUniqloStore: {
    value: function (uniqloStore) {
      this.firstUniqloStoreSelectButton.waitForEnabled();
      browser.pause(3000);  // TRIGGERS AN API, BUT CAN'T IDENTIFY THE WAIT TIME
      this.uniqloStoreSearch.waitForEnabled();
      this.uniqloStoreSearch.setValue(uniqloStore.name);
      browser.pause(1500);
      browser.waitForLoading();
      this.firstUniqloStoreSelectButton.waitForEnabled();
      browser.pause(1500);
    }
  },

  /**
   * Choose first Uniqlo store from the list
   * @params {Object} uniqloStore , store to be searched
   * @param {Object} name , store name to be searched
   */
  selectStoreFromUniqloStorelist: {
    value: function (uniqloStore) {
      browser.pause(2000);
      browser.waitForLoading();
      this.uniqloStoreSelectButton(uniqloStore).waitForEnabled();
      browser.pause(3000);
      browser.waitForLoading();
      this.uniqloStoreSelectButton(uniqloStore).click();
    }
  },

  /**
   * Gets selected Uniqlo store information
   *
   * @return {Object} storeInfo
   * @return {String} storeInfo.name
   * @return {String} storeInfo.address
   * @return {String} storeInfo.openingTime
   * @return {String} storeInfo.distance
   * @return {String} storeInfo.description
   *
   */
  getSelectedUniqloStoreInformation: {
    value: function () {
      this.uniqloStoreInformation.waitForVisible();
      let rawInfo = this.uniqloStoreInformation.getText();
      let rawInfoArray = rawInfo ? rawInfo.split('\n') : '';

      return {
        storeDetails: this.uniqloStoreInfoAddress.getText(),
        openingTime: rawInfoArray[2] + ';' + rawInfoArray[3] + ';' + rawInfoArray[4],
        distance: rawInfoArray[5],
        description: rawInfoArray[6]
      };
    }
  },

  /**
   * Confirms the selected Uniqlo Store
   */
  confirmUniqloStore: {
    value: function () {
      this.confirmUniqloStoreButton.waitForEnabled();
      browser.pause(1500);
      browser.waitForLoading();
      this.confirmUniqloStoreButton.click();
    }
  }
};

module.exports = Object.create(Page, UniqloStoreSearchPage);
