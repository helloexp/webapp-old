let Page = require('./page');

/**
 * Checkout Page Object
 *
 * @class e2e/pages/OrderDeliveryPage
 * @type {Page}
 */
let OrderDeliveryPage = {

  /**
   * Address Form
   */
  addressForm: {get: function () { return browser.element('//div[contains(@class, "addressForm")]'); }},
  lastName: {get: function () { return browser.element('//input[@name="lastName"]');}},
  firstName: {get: function () { return browser.element('//input[@name="firstName"]');}},
  lastNameKatakana: {get: function () { return browser.element('//input[@name="lastNameKatakana"]');}},
  firstNameKatakana: {get: function () { return browser.element('//input[@name="firstNameKatakana"]');}},
  postalCode: {get: function () { return browser.element('//input[@name="postalCodeReact"]');}},
  prefecture: {get: function () { return browser.element('//select[@name="prefectureReact"]');}},
  city: {get: function () { return browser.element('//input[@name="cityReact"]');}},
  address: {get: function () { return browser.element('//input[@name="streetNumberReact"]');}},
  aptName: {get: function () { return browser.element('//input[@name="aptNameReact"]');}},
  phoneNumber: {get: function () { return browser.element('//input[@name="phoneNumber"]');}},
  cellPhoneNumber: {get: function () { return browser.element('//input[@name="cellPhoneNumber"]');}},
  addressErrorTooltip: {get: function () { return browser.element('//div[contains(@class,"Validation")]/div[contains(@class,"Tooltip")]');}},
  acceptButton: {get: function () { return browser.element('//button[contains(@class, "acceptBtn")]');}},
  todayDeliveryDatePrice: {get: function () { return browser.element('//input[@name="timeFrame"][@value="17"]/../..//span[contains(@class,"price")]');}},
  todayDeliveryDisabled: {get: function () { return browser.element('//input[@name="timeFrame"][@value="17"]/ancestor::div[contains(@class, "disabled")]'); }},
  nextDayDeliveryDatePrice: {get: function () { return browser.element('//input[@name="timeFrame"][@value="byNextDate"]/../..//span[contains(@class,"price")]');}},
  standardDeliveryDatePrice: {get: function () { return browser.element('//input[@name="timeFrame"][@value="standard"]/../..//span[contains(@class,"price")]');}},
  byDateDeliveryDatePrice: {get: function () { return browser.element('//input[@name="timeFrame"][@value="bydate"]/../..//span[contains(@class,"price")]');}},
  yuPacketDeliveryPrice: {get: function () { return browser.element('//input[@name="timeFrame"][@value="12"]/../..//span[contains(@class,"price")]');}},
  nekoPosPacketDeliveryPrice: {get: function () { return browser.element('//input[@name="timeFrame"][@value="16"]/../..//span[contains(@class,"price")]');}},
  todayDeliveryDateRadio: {value: function (t) { return browser.element(`(//input[@name="timeFrame"][@value="17"]/../../label)[${t}]`);}},
  standardDeliveryDateRadio: {value: function (t) { return browser.element(`(//input[@name="timeFrame"][@value="standard"]/../../label)[${t}]`);}},
  byDateDeliveryDateRadio: {value: function (t) { return browser.element(`(//input[@name="timeFrame"][@value="bydate"]/../../label)[${t}]`);}},
  yuPacketDeliveryRadio: {value: function (t) { return browser.element(`(//input[@name="timeFrame"][@value="12"]/../../label)[${t}]`);}},
  nekoPosPacketDeliveryRadio: {value: function (t) { return browser.element(`(//input[@name="timeFrame"][@value="16"]/../../label)[${t}]`);}},
  byDateDeliveryDateSelector: {value: function (t) { return browser.element(`(//div[contains(.,"${t}")]//select)[1]`);}},
  byDateDeliveryTimeSelector: {value: function (t) { return browser.element(`(//div[contains(.,"${t}")]//select)[2]`);}},
  useThisBillingAddress: {get: function () { return browser.element('.//input[@id="ShippingAddressFormSetCheckbox"]/..');}},
  useThisBillingAddressCheckBox: {get: function () { return browser.element('.//input[@id="ShippingAddressFormSetCheckbox"]');}},
  submitDeliveryAddress: {get: function () { return browser.element('//button[contains(@class,"deliverySubmitBtn") or contains(@class,"acceptBtn")]');}},
  confirmDeliveryMethodButton: {get: function () { return browser.element('//button[contains(@class,"bold")]');}},
  deliveryMethods: {get: function () { return browser.element('//div[contains(@class,"textModifier")]');}},
  nextDayDeliveryDateRadio: {value: function (t) { return browser.element(`(//input[@name="timeFrame"][@value="byNextDate"]/../../label)[${t}]`);}},
  nextDayDeliveryDateRadioDisabled: {get: function () { return browser.element('//input[@name="timeFrame"][@value="byNextDate"]/ancestor::div[contains(@class, "disabled")]');}},
  nextDayDeliveryAvailable: {get: function () { return browser.element('//input[@value="byNextDate"]');}},
  collectiveShipping: {get: function () { return browser.element('(//label[contains(@class,"DeliveryPreference")])[1]');}},
  selectiveShipping: {get: function () { return browser.element('(//label[contains(@class,"DeliveryPreference")])[2]');}},
  partialAdddressConfirm: {get: function () { return browser.element('(//*[contains(@class,"uniqloPaymentBtn")]');}},
  deliverySubmit: {get: function () { return browser.element('(//*[contains(@class,"deliverySubmitBtn")]');}},
  submitStore: {get: function () { return browser.element('//div[contains(@class,"submitstore")]');}},
  



  /**
   * Delivery Methods
   */
  shipToRadio: {get: function () { return browser.element('//input[@value="5"]/..');}},
  pickUpAtUniqloRadio: {get: function () { return browser.element('//input[@value="11"]/..');}},
  pickUpAtCvsRadio: {get: function () { return browser.element('//input[@value="15"]/..');}},
  changeDeliveryShipToButton: {get: function () { return browser.element('(//*[contains(@class,"Checkout-Delivery-Shipping-AddressPanel-styles-noRightBorder")]/..//button[contains(@class,"Checkout-Delivery-Shipping-AddressPanel-styles-footerBtn")])[2]');}},

  /**
   * Address Delivery method
   */
  firstExistingAddressOkButton: {get: function () { return browser.element('(//button[contains(@class,"AddressPanel-styles-footerBtn")])[1]');}},
  firstExistingAddressChangeButton: {get: function () { return browser.element('(//button[contains(@class,"AddressPanel-styles-footerBtn")])[2]');}},
  secondExistingAddressOkButton: {get: function () { return browser.element('(//div[contains(@class,"addressFooter")]//button)[3]');}},
  saveAndContinueButton: {get: function () { return browser.element('//div[contains(@class,"addressBookList")]//button[contains(@class,"saveAndContinue")]');}},
  uniqloStoreFinderButton: {get: function () { return browser.element('//input[@value="11"]/../../../..//button');}},
  confirmPreviousUniqloStoreButton: {get: function () {return browser.element('//button[contains(@class, "UniqloStore")][contains(@class, "confirm")]');}},
  closeUniqloStorePopup: {get: function () {return browser.element('//button[contains(@class, "closeIcon")]'); }},
  storeItem: {get: function () { return browser.element('//div[contains(@class,"z_litem")][1]'); }},
  cvsAddressBox: {get: function () { return browser.element('//span[contains(@class, "z_litem_comment")]'); }},
  convenienceStoresSevenStores: {get: function () { return browser.element('//div[contains(@class,"pickupConvenience")]/a[contains(@class, "sevenEleven")]');}},
  cvsSevenStoreAllList: {get: function () { return browser.element('//form[@class="z_nmap_btn_nlist"]');}},
  cvsSevenName: {get: function () { return browser.element('(//div[contains(@class,"z_inf_name")]//td)[1]');}},
  cvsSevenAddress: {get: function () { return browser.element('(//div[contains(@class,"z_litem")])[1]//span[contains(@class,"z_litem_comment")]');}},
  cvsSevenStoreExisting: {get: function () { return browser.element('//div[contains(@class,"pickupConvenience")]/div//a'); }},
  cvsSevenStoreConfirm: {get: function () { return browser.element('//td[contains(@class,"custTomeFinBtn")]//a');}},
  convenienceStoresLawsonStores: {get: function () { return browser.element('//div[contains(@class,"pickupConvenience")]/a[contains(@class, "lawson")]');}},
  convenienceStoresLawsonExisting: {get: function () { return browser.element('//div[contains(@class,"pickupConvenience")]/div[contains(@class, "lawson")]//button');}},
  cvsLawsonStoresListNewUser: {get: function () { return browser.element('(//input[contains(@type,"submit")])[3]'); }},
  cvsLawsonStoresListReturnUser: {get: function () { return browser.element('//form[@class="z_map_btn_nlist"]');}},
  cvsLawsonName: {get: function () { return browser.element('//div[contains(@class,"z_inf_name")]//span'); }},
  cvsLawsonAddress: {get: function () { return browser.element('(//div[contains(@class,"z_litem")])[1]//span[contains(@class,"z_litem_comment")]'); }},
  cvsLawsonStoreAddressBox: {get: function () { return browser.element('//input[@name="name3"]'); }},
  cvsLawsonStoreConfirm: {get: function () { return browser.element('//*[contains(@id,"z_map_msg_name")]'); }},
  convenienceStoresFamilyMart: {get: function () { return browser.element('//div[contains(@class,"pickupConvenience")]/a[contains(@class, "familyMart")]');}},
  convenienceStoresFamilyMartExisting: {get: function () { return browser.element('//div[contains(@class,"pickupConvenience")]/div[contains(@class, "familyMart")]//button');}},
  cvsFamilyMartName: {get: function () { return browser.element('//section/h1'); }},
  cvsFamilyMartAddress: {get: function () { return browser.element('(//section/ul/li)[1]'); }},
  cvsFamilyMartAddressButton: {get: function () { return browser.element('//ul[@data-role="listview"]//a');}},
  cvsFamilyMartRegionButton: {get: function () { return browser.element('(//section[contains(@class, "active")]//ul[contains(@class, "mapple-list-link-count-01")]//div/a)[1]'); }},
  cvsFamilyMartStoreLocator: {get: function () { return browser.element('(//*[contains(@class, "collapsible-heading-toggle")]/..//a)[1]'); }},
  cvsFamilyMartPrefectureButton: {get: function () { return browser.element('//a[contains(@class, "link-inherit")]/..//span[contains(@class, "btn-corner-all")]/..'); }},
  cvsFamilyMartCityExpandButton: {get: function () { return browser.element('(//ul[contains(@class, "mapple-list-link-toggle-01")]//a)[1]'); }},
  cvsFamilyMartCityButton: {get: function () { return browser.element('(//ul[contains(@class, "mapple-list-link-toggle-01")]//a)[2]'); }},
  cvsFamilyMartChooseAStore: {get: function () { return browser.element('//ul[@id="AddListArticle"]//a'); }},
  cvsFamilyMartStoreConfirm: {get: function () { return browser.element('//div[contains(@class, "corner-top")]//a[1]'); }},
  giftingOptionButton: {get: function () { return browser.element('//div[contains(@class, "GiftPanel")]'); }},
  shippingDateBlock: {get: function () { return browser.element('//div[contains(@class, "shippingOption")]//div[contains(@class, "Block")]'); }},
  uniqloDateBlock: {get: function () { return browser.element('//div[contains(@class, "UniqloStore")]//div[contains(@class, "Block")]'); }},
  cvsDateBlock: {get: function () { return browser.element('//div[contains(@class, "ConvenienceStore")]//div[contains(@class, "Block")]'); }},
  deliveryOptions: {get: function () { return browser.element('//div[contains(@class, "deliveryOptions")]'); }},

  /**
   * Validation of delivery
   */
  deliveryMethodName: {get: function () { return browser.element('(//address/../..//h6)[1]'); }},
  fullAddressDetails: {get: function () { return browser.element('(//address)[1]//div[1]'); }},
  fullAddressDetailsAddress: {get: function () { return browser.element('(//address)[1]//div[2]'); }},  
  deliveryFirstNameLastName: {get: function () {return browser.element('(//address/div[1])[1]'); }},
  deliveryPostalCode: {get: function () { return browser.element('(//address/div[2])[1]'); }},
  deliveryPrefectureCityAddress: {get: function () { return browser.element('(//address/div[3])[1]'); }},
  deliveryAptName: {get: function () { return browser.element('(//address/div[4])[1]'); }},
  deliveryPhoneNumber: {get: function () { return browser.element('(//address/div[5])[1]'); }},
  deliveryCellPhoneNumber: {get: function () { return browser.element('(//address/div[6])[1]'); }},
  deliveryMethodData: {get: function () { return browser.element('(//address)[1]'); }},
  shippingMethodType: {value: function (t) {return browser.element(`(//div[contains(@class,"timeFrameContainer")]/div[contains(@class,"inlineBlockText")])[${t}]`);}},
  shippingMethodText: {value: function (t) {return browser.element(`(//div[contains(@class,"timeFrameContainer")]/div[contains(@class,"blockText")])[${t}]`);}},
  addNewShippingAddress: {get: function () { return browser.element('//button[contains(@class,"newAddressRegister")]'); }},
  submitNewShippingAddress:  {get: function () { return browser.element('//button[contains(@class,"acceptBtn")]'); }},
  addressErrorMessage: {get: function () { return browser.element('(//ul[contains(@class, "error")])[1]'); }},
  sameDayDelivery: {get: function () { return browser.element('(//div[contains(@class, "labelPriceWrap")])[1]'); }},
  submitMemberInfoButton: {get: function () {return browser.element('//button[contains(@class,"storeSelect")]');}},
  productDetails: {get: function () { return browser.element('(//div[contains(@class,"preferenceContainer")])[2]'); }},
  shipmentTitle: {value: function (t) { return browser.element(`(//div[contains(@class, "shipmentTitleStyle")])[${t}]`);}},
  submitAddressOnlyButton: {get: function () {return browser.element('//button[contains(@class,"storeSelect")]');}},
  /**
   * Overridden open function.
   *
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/checkout/delivery/';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /**
   * Selects desired delivery method
   *
   * @param {String} deliveryMethod
   *
   */
  selectDeliveryMethod: {
    value: function (deliveryMethod) {

      if (deliveryMethod.toLowerCase() === 'shipto') {
        this.shipToRadio.waitForEnabled();
        browser.waitForLoading();
        this.shipToRadio.click();
        browser.waitForLoading();
      }
      if (deliveryMethod.toLowerCase() === 'uniqlo') {
        this.pickUpAtUniqloRadio.waitForEnabled();
        browser.waitForLoading();
        this.pickUpAtUniqloRadio.click();
        browser.waitForLoading();
      }
      if (deliveryMethod.toLowerCase() === 'cvs') {
        this.pickUpAtCvsRadio.waitForEnabled();
        browser.waitForLoading();
        this.pickUpAtCvsRadio.click();
        browser.waitForLoading();
      }
    }
  },

  /**
   * Click on Find Store button within the Uniqlo store shipping method
   */
  goToUniqloStoreFinder: {
    value: function () {
      this.uniqloStoreFinderButton.waitForEnabled();
      this.uniqloStoreFinderButton.click();
    }
  },

  /**
   * Click on Edit delivery address ship to  button
   */
  goToEditDeliveryShipToButton: {
    value: function () {
      this.changeDeliveryShipToButton.waitForEnabled();
      this.changeDeliveryShipToButton.click();
    }
  },
  /**
   * Click on Add New Shipping Address
   */
  selectNewShippingAddress: {
    value: function () {
      this.addNewShippingAddress.waitForEnabled();
      this.addNewShippingAddress.click();
    }
  },

  submitNewShippingAddressForm: {
    value: function () {
      this.submitNewShippingAddress.waitForEnabled();
      this.submitNewShippingAddress.click();
    }
  },

  /**
   * User fills the address form which pops for Pickup st Store and Pay at Store
   */
  fillAddressOnly: {
    value: function (shippingAddress) {
      this.prefecture.selectByValue(shippingAddress.prefecture);
      this.city.setValue(shippingAddress.city);
      this.address.setValue(shippingAddress.street + shippingAddress.streetNumber);
      this.aptName.setValue(shippingAddress.aptName);
    }
  },


    /**
   * User fills the address only form which pops for Pickup st Store and Pay at Store(967)
   */
  fillPartialAddressOnly: {
    value: function (shippingAddress) {
      browser.waitForLoading();
      this.prefecture.selectByValue(shippingAddress.prefecture);
      this.city.setValue(shippingAddress.city);
      this.address.setValue(shippingAddress.street + shippingAddress.streetNumber);
      this.aptName.setValue(shippingAddress.aptName);
      browser.waitForLoading();
      this.submitMemberInfoButton.waitForEnabled();
      this.submitMemberInfoButton.click();
    }
  },

  /**
   * User submits the updated member info
   */
  submitMemberInfo: {
    value: function () {
      browser.waitForLoading();
      this.submitMemberInfoButton.waitForEnabled();
      this.submitMemberInfoButton.click();
    }
  },

  /**
   * Confirm usage of saved Uniqlo store
   */
  usePreviousUniqloStore: {
    value: function () {
      this.confirmPreviousUniqloStoreButton.waitForEnabled();
      this.confirmPreviousUniqloStoreButton.moveToObject(0, 0);
      this.confirmPreviousUniqloStoreButton.click();
    }
  },

  /**
   * Click on the CVS Seven store list
   */
  listAllCvsSevenStoreList: {
    value: function () {
      browser.pause(500);
      if (this.convenienceStoresSevenStores.isVisible() === true) {
        this.convenienceStoresSevenStores.moveToObject(0, 0);
        this.convenienceStoresSevenStores.click();
      }
      if (this.cvsSevenStoreExisting.isVisible() === true) {
        this.cvsSevenStoreExisting.moveToObject(0, 0);
        this.cvsSevenStoreExisting.click();
      }
    }
  },

  /**
   *  SELECT EXISTING FAMILY MART STORE
   */
  selectExistingCvsFamilyMartStore: {
    value: function () {
      browser.pause(500);
      this.convenienceStoresFamilyMartExisting.waitForEnabled();
      this.convenienceStoresFamilyMartExisting.moveToObject(0, 0);
      this.convenienceStoresFamilyMartExisting.click();
      browser.pause(500);
    }
  },

  /**
   *  SELECT EXISTING LAWSON STORE
   */
  selectExistingCvsLawsonStore: {
    value: function () {
      browser.pause(500);
      this.convenienceStoresLawsonStores.waitForEnabled();
      this.convenienceStoresLawsonStores.moveToObject(0, 0);
      this.convenienceStoresLawsonStores.click();
      browser.pause(500);

      // LAWSON WORKAROUND due to LW_CORP_ID: dev: 'f45037' missing implementation
      browser.urlValidation('https://test.e-map.ne.jp/smt/jppost15test');
      var lawsonURL = browser.getUrl();
      browser.url(lawsonURL.replace('f45037','f45030'));
    }
  },

  /**
   * Click on the CVS Lawson store list
   */
  listAllCvsLawsonStoreList: {
    value: function () {
      this.convenienceStoresLawsonStores.waitForEnabled();
      this.convenienceStoresLawsonStores.moveToObject(0, 0);
      this.convenienceStoresLawsonStores.click();

      // LAWSON WORKAROUND due to LW_CORP_ID: dev: 'f45037' missing implementation
      browser.urlValidation('https://test.e-map.ne.jp/smt/jppost15test');
      var lawsonURL = browser.getUrl();
      browser.url(lawsonURL.replace('f45037','f45030'));
    }
  },

  /**
   * Click on the CVS Lawson store list
   */
  listAllCvsFamilyMartList: {
    value: function () {
      this.convenienceStoresFamilyMart.waitForEnabled();
      this.convenienceStoresFamilyMart.moveToObject(0, 0);
      this.convenienceStoresFamilyMart.click();browser.pause(1500);
    }
  },

  /**
   * Click on the existing CVS Seven store
   */
  chooseExistingCvsSevenStore: {
    value: function () {
      this.cvsSevenStoreExisting.waitForEnabled();
      this.cvsSevenStoreExisting.moveToObject(0, 0);
      this.cvsSevenStoreExisting.click();
    }
  },

  /**
   * To view all Store from the list
   */
  clickToViewAllSevenStoreList: {
    value: function () {
      this.cvsSevenStoreAllList.waitForEnabled();
      this.cvsSevenStoreAllList.click();
    }
  },

  /**
   * To view address of Stores from the list New User
   */
  clickToViewAllLawsonStoreListNewUser: {
    value: function () {
      browser.pause(1000);
      if(this.cvsLawsonStoresListNewUser.isVisible()){
      browser.pause(1000);
      const cvsLawsonStoresListNewUserPos = browser.elementIdLocation(this.cvsLawsonStoresListNewUser.value.ELEMENT);
      browser.scroll(cvsLawsonStoresListNewUserPos.value.x, cvsLawsonStoresListNewUserPos.value.y);
      //this.cvsLawsonStoresListNewUser.moveToObject(0, 0);
      this.cvsLawsonStoresListNewUser.click();
      browser.pause(2000);
      this.storeItem.click();
      }
    }
  },

  /**
   * To view address of Stores from the list Return User
   */
  clickToViewAllLawsonStoreListReturnUser: {
    value: function () {
      this.cvsLawsonStoresListReturnUser.waitForEnabled();
      this.cvsLawsonStoresListReturnUser.click();
    }
  },

  /**
   * Select a Lawson Convienent Store from the list for Return User
   */
  selectStoreFromCvsLawsonStoreListReturnUser: {
    value: function (isMinistop) {
      browser.pause(1000);
      this.storeItem.waitForVisible();
      this.storeItem.click();
      if(isMinistop) {
        var lawsonURL = browser.getUrl();
        browser.url(lawsonURL.replace('0001214770','0002310309'));
        browser.pause(2000);
      }
    }
  },

  /**
   * Select a Lawson Convienent Store from the list for New User
   */
  selectStoreFromCvsLawsonStoreListNewUser: {
    value: function (isMinistop) {
      this.storeItem.waitForVisible();
      this.storeItem.click();
      browser.pause(1500);
      if(this.storeItem.isVisible()) {
        this.storeItem.click();
        if(isMinistop) {
          var lawsonURL = browser.getUrl();
          browser.url(lawsonURL.replace('0001176006','0002323973'));
          browser.pause(2000);
        }
       }
    }
  },

  /**
   * Select a FamilyMart Search by address from the list
   */
  selectCvsFamilyMartByAddress: {
    value: function () {
      try {
        if(this.cvsFamilyMartAddressButton.isVisible()){
          this.cvsFamilyMartAddressButton.click();
          browser.pause(1500);
        }
      } catch (err) {console.log(`Family Mart by address is skipped ${err}`);}
    }
  },

  /**
   * Select a FamilyMart Convienent Store from the list
   */
  selectCvsFamilyMartRegion: {
    value: function () {
      if(this.cvsFamilyMartRegionButton.isVisible()) {
        this.cvsFamilyMartRegionButton.click();
        browser.waitForLoading();
      }
    }
  },

  /**
   * Select a FamilyMart Convienent Store locator from the list
   */
  selectCvsFamilyMartStoreLocator: {
    value: function () {
      if(this.cvsFamilyMartStoreLocator.isVisible()) {
        this.cvsFamilyMartStoreLocator.click();
        browser.waitForLoading();
      }
    }
  },

  /**
   * Select a FamilyMart Convienent Store city from the list
   */
  selectCvsFamilyMartPrefecture: {
    value: function () {
      if(this.cvsFamilyMartPrefectureButton.isVisible()) {
        this.cvsFamilyMartPrefectureButton.click();
        browser.waitForLoading();
      }
    }
  },

  /**
   * Select a FamilyMart Convienent Store city from the list
   */
  selectCvsFamilyMartCity: {
    value: function () {
      this.cvsFamilyMartCityExpandButton.waitForEnabled();
      this.cvsFamilyMartCityExpandButton.click();
      browser.waitForLoading();
      this.cvsFamilyMartCityButton.click();
      browser.waitForLoading();
    }
  },

  /**
   * Select a FamilyMart Convienent Store city from the avaliable list
   */
  selectCvsFamilyMartChooseAStore: {
    value: function () {
      this.cvsFamilyMartChooseAStore.waitForEnabled();
      this.cvsFamilyMartChooseAStore.click();browser.pause(2000);
    }
  },

  /**
   * Select a FamilyMart Convienent Store confirmation (yes/no)
   * @return {Object} storeDetails
   * @return {String} storeDetails.name
   * @return {String} storeDetails.postalCode
   * @return {String} storeDetails.prefecture
   */
  selectCvsFamilyMartStoreConfirm: {
    value: function () {
      const store = {};
      this.cvsFamilyMartStoreConfirm.waitForVisible();
      store.name = this.cvsFamilyMartName.getText();
      store.postalCode = this.cvsFamilyMartAddress.getText().split('\n')[1];
      store.prefecture = this.cvsFamilyMartAddress.getText().split('\n')[1];
      this.cvsFamilyMartStoreConfirm.click();

      return store;
    }
  },

  /**
   * Select a Convienent Store from the list
   * @return {String} postalCode
   * postalCode of the selected cvs store
   */
  selectStoreFromCvsStoreList: {
    value: function () {
      this.storeItem.waitForEnabled();
      let postalCode = this.storeItem.getText();
      this.storeItem.click();

      return postalCode;
    }
  },

  /**
   * Confirms the Convienent Store
   * @return {String} prefecture
   * prefecture of the selected store
   */
  confirmCvsSevenStore: {
    value: function () {
      const store = {};
      this.cvsSevenStoreConfirm.waitForEnabled();
      let innerText = this.cvsSevenName.getText();
      store.name = innerText.indexOf('　') > 0 ? innerText.split('　')[1] : innerText;
      store.postalCode = this.cvsSevenAddress.getText().split('\n')[0];
      store.prefecture = this.cvsSevenAddress.getText().split('\n')[1];
      this.cvsSevenStoreConfirm.click();

      return store;
    }
  },

  /**
   * Confirms the Lawson Convienence Store
   * @return {object} store
   * @return {String} store.postalCode
   * @return {String} store.prefecture
   * prefecture and postalCode of the selected store
   */
  confirmLawsonCvsStore: {
    value: function () {
      const store = {};
      // browser.pause(2000);
      //this.cvsLawsonStoreConfirm.waitForEnabled();
      let cvsLawsonStore = i18n.cvsLawsonStore;
      store.name = cvsLawsonStore.name;
      store.postalCode = cvsLawsonStore.postalCode;
      store.prefecture = cvsLawsonStore.prefecture;
      //this.cvsLawsonStoreConfirm.click();
      browser.pause(2000);
      //browser.debug();
      this.submitStore.waitForEnabled();
      this.submitStore.click();
      return store;
    }
  },

  /**
   * Select first existing address and confirm
   */
  selectAndConfirmExistingAddress: {
    value: function () {
      browser.waitForLoading();
      this.firstExistingAddressOkButton.waitForEnabled();
      this.firstExistingAddressOkButton.moveToObject(0, 0);
      this.firstExistingAddressOkButton.click();
      this.saveAndContinueButton.click();
      browser.pause(2000);
    }
  },

  /**
   * Choose alternate address
   */
  selectAlternateExistingAddress: {
    value: function () {
      browser.waitForLoading();
      this.secondExistingAddressOkButton.waitForEnabled();
      this.secondExistingAddressOkButton.click();
    }
  },

  clickSaveAndContinue: {
    value: function () {
      browser.waitForLoading();
      this.saveAndContinueButton.waitForEnabled();
      this.saveAndContinueButton.moveToObject(0, 0);
      this.saveAndContinueButton.click();
      browser.pause(2000);
    }
  },
  /**
   * Select first existing address and confirm
   */
  selectAndChangeExistingAddress: {
    value: function () {
      browser.waitForLoading();
      this.firstExistingAddressChangeButton.waitForEnabled();
      this.firstExistingAddressChangeButton.moveToObject(0, 0);
      this.firstExistingAddressChangeButton.click();
    }
  },

  /**
   * Validates the url of delivery pages and
   * confirm whether it is properly redirected to delivery
   */
  validateDeliveryUrlPath: {
    value: function () {
      browser.urlValidation('/checkout/delivery');
    }
  },

  /**
   * Validates the  delivery options are resetted
   */
  validateDeliveryResetState: {
    value: function () {
      this.deliveryOptions.waitForEnabled();
      if (this.shipToRadio.isVisible()) {
        expect(this.shipToRadio.getAttribute('Class').includes('Checked')).to.be.false;
      }
      if (this.pickUpAtUniqloRadio.isVisible()) {
        expect(this.pickUpAtUniqloRadio.getAttribute('Class').includes('Checked')).to.be.false;
      }
      if (this.pickUpAtCvsRadio.isVisible()) {
        expect(this.pickUpAtCvsRadio.getAttribute('Class').includes('Checked')).to.be.false;
      }
    }
  },

  /**
   * Validates the  delivery options are resetted
   */
  validateDeliveryResetState: {
    value: function () {
      this.deliveryOptions.waitForEnabled();
      if (this.shipToRadio.isVisible()) {
        expect(this.shipToRadio.getAttribute('Class').includes('Checked')).to.be.false;
      }
      if (this.pickUpAtUniqloRadio.isVisible()) {
        expect(this.pickUpAtUniqloRadio.getAttribute('Class').includes('Checked')).to.be.false;
      }
      if (this.pickUpAtCvsRadio.isVisible()) {
        expect(this.pickUpAtCvsRadio.getAttribute('Class').includes('Checked')).to.be.false;
      }
    }
  },

  /**
   *  Selects the gifting option
   */
  giftingOption: {
    value: function () {
      this.giftingOptionButton.waitForEnabled();
      this.giftingOptionButton.click();
    }
  },

  /**
   *  Validates the gifting option
   */
  validateGiftingOption: {
    value: function (isVisible) {
      expect(this.giftingOptionButton.isVisible()).to.be.equal(isVisible);    
    }
  },

  /**
   *  Close Store Popup
   */
  closeStorePopup: {
    value: function () {
      this.closeUniqloStorePopup.waitForEnabled();
      browser.waitForLoading();
      this.closeUniqloStorePopup.click();
    }
  },

  /**
   * Checks whether
   * @return {Bool} (TRUE/FALSE)
   */
  verifyDeliveryPageAndNextDayAvailable: {
    value: function (deliveryNo) {
      let deliveryType = 'shipto';
      browser.waitForLoading();
      browser.pause(1000);

      if (this.deliveryOptions.isVisible()) {
        this.validateDeliveryUrlPath();
        this.selectDeliveryMethod(deliveryType);
        this.selectAndConfirmExistingAddress();
        browser.waitForLoading();
        browser.pause(1000);

        if (this.verifyNextDayAvailable(deliveryNo)) {
            return true
          }
      }
    }
  },

  /**
   * Checks if next day is available
   * @return {Bool} (TRUE/FALSE)
   */
   verifyNextDayAvailable: {
    value: function (deliveryNo) {
      browser.waitForLoading();
      if (this.nextDayDeliveryDateRadio(deliveryNo).isVisible())
        { if (this.nextDayDeliveryDateRadioDisabled.isVisible())
          {
            return false
          }
          return true
        }        
    }
  },

  /**
   * Fills address form
   *
   * @params {Object} shippingAddress
   * @param {String} shippingAddress.firstName
   * @param {String} shippingAddress.lastName
   * @param {String} shippingAddress.firstNameKatakana
   * @param {String} shippingAddress.lastNameKatakana
   * @param {String} shippingAddress.postalCode
   * @param {String} shippingAddress.prefecture
   * @param {String} shippingAddress.city
   * @param {String} shippingAddress.street
   * @param {String} shippingAddress.streetNumber
   * @param {String} shippingAddress.aptName
   * @param {String} shippingAddress.phoneNumber
   * @param {String} shippingAddress.cellPhoneNumber
   *
   */
  fillAddressForm: {
    value: function (shippingAddress, useAsBilling = true) {
      this.firstName.waitForEnabled();
      this.firstName.setValue(shippingAddress.firstName);
      this.lastName.setValue(shippingAddress.lastName);
      this.firstNameKatakana.setValue(shippingAddress.firstNameKatakana);
      this.lastNameKatakana.setValue(shippingAddress.lastNameKatakana);
      this.postalCode.setValue('');
      this.postalCode.setValue(shippingAddress.postalCode);
      this.prefecture.selectByValue(shippingAddress.prefecture);
      this.city.setValue(shippingAddress.city);
      this.address.setValue(shippingAddress.street + shippingAddress.streetNumber);
      this.aptName.setValue(shippingAddress.aptName);
      this.phoneNumber.setValue(shippingAddress.phoneNumber);
      this.cellPhoneNumber.setValue(shippingAddress.cellPhoneNumber);

      if (this.useThisBillingAddressCheckBox.isVisible() &&
         (useAsBilling && !this.useThisBillingAddressCheckBox.getAttribute('checked')) ||
         (!useAsBilling && this.useThisBillingAddressCheckBox.getAttribute('checked'))) {
        this.useThisBillingAddress.click();
      }
    }
  },

    fillAddressFormForPayAtStore: {
    value: function (shippingAddress) {
      this.firstName.waitForEnabled();
      this.firstName.setValue(shippingAddress.firstName);
      this.lastName.setValue(shippingAddress.lastName);
      this.firstNameKatakana.setValue(shippingAddress.firstNameKatakana);
      this.lastNameKatakana.setValue(shippingAddress.lastNameKatakana);
      this.postalCode.setValue('');
      this.postalCode.setValue(shippingAddress.postalCode);
      this.phoneNumber.setValue(shippingAddress.phoneNumber);
      browser.pause(500);
      this.submitMemberInfoButton.waitForEnabled();
      this.submitMemberInfoButton.click();
      browser.pause(500);
    }
  },

  /** Fill last name */
  fillLastName: {
    value: function (fieldValue) {
      this.lastName.waitForEnabled();
      this.lastName.setValue(fieldValue);
    }
  },

  /** Fill first name */
  fillFirstName: {
    value: function (fieldValue) {
      this.firstName.waitForVisible();
      this.firstName.setValue(fieldValue);
    }
  },

  /** Fill last name katakana */
  fillLastNameKatakana: {
    value: function (fieldValue) {
      this.lastNameKatakana.waitForVisible();
      this.lastNameKatakana.setValue(fieldValue);
    }
  },

  /** Fill first name katakana */
  fillFirtstNameKatakana: {
    value: function (fieldValue) {
      this.firstNameKatakana.waitForVisible();
      this.firstNameKatakana.setValue(fieldValue);
    }
  },

  /** Fill postal code */
  fillPostalCode: {
    value: function (fieldValue) {
      this.postalCode.waitForVisible();
      this.postalCode.setValue('');
      this.postalCode.setValue(fieldValue);
    }
  },

  /** Fill perfecture */
  fillPerfecture: {
    value: function (fieldValue) {
      this.prefecture.waitForVisible();
      this.prefecture.selectByValue(fieldValue);
    }
  },

  /** Fill city */
  fillCity: {
    value: function (fieldValue) {
      this.city.waitForVisible();
      this.city.setValue(fieldValue);
    }
  },

  /** Fill address */
  fillAddress: {
    value: function (fieldValue) {
      this.address.waitForVisible();
      this.address.setValue(fieldValue);
    }
  },

  /** Fill apartment name */
  fillAptName: {
    value: function (fieldValue) {
      this.aptName.waitForVisible();
      this.aptName.setValue(fieldValue);
    }
  },

  /** Fill phone number */
  fillPhoneNo: {
    value: function (fieldValue) {
      this.phoneNumber.waitForVisible();
      this.phoneNumber.setValue(fieldValue);
    }
  },

  /** Fill cellphone number */
  fillCellPhoneNo: {
    value: function (fieldValue) {
      this.cellPhoneNumber.waitForVisible();
      this.cellPhoneNumber.setValue(fieldValue);
    }
  },

  /**
   * Submit address form
   *
   */
  submitAddressForm: {
    value: function () {
      browser.waitForLoading();
      this.submitDeliveryAddress.waitForEnabled();
      this.submitDeliveryAddress.click();
    }
  },

  /**
   * Submit partial address form (967)
   *
   */
  partialAddressForm: {
    value: function () {
      browser.waitForLoading();
      this.partialAdddressConfirm.waitForEnabled();
      this.partialAdddressConfirm.click();
    }
  },

  /**
   * Submit address form
   *
   */
  submitUpdateAddressForm: {
    value: function () {
      this.acceptButton.waitForEnabled();
      this.acceptButton.click();
    }
  },

  /**
   * Verifies error tool tip is displayed and validates error message
   */
  verifyValidationErrorMessage: {
    value: function (errorScenario) {
      this.addressErrorTooltip.waitForVisible();
      expect(eval('i18n.' + errorScenario)).is.not.undefined;
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.' + errorScenario));
      this.addressErrorMessage.waitForVisible();
      expect(eval('i18n.' + errorScenario)).is.not.undefined;
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.' + errorScenario));
    }
  },

  validateShippingForm: {
    value: function () {
      this.firstName.waitForEnabled();

      this.firstName.setValue(" ");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankFirstName'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankFirstName'));
      this.firstName.setValue("木村山");

      this.lastName.setValue(" ");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankLastName'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankLastName'));
      this.lastName.setValue("一道");


      this.firstNameKatakana.setValue(" ");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankFirstNameKatakana'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankFirstNameKatakana'));
      this.firstNameKatakana.setValue("カズミチ");

      this.lastNameKatakana.setValue(" ");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankLastNameKatakana'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankLastNameKatakana'));
      this.lastNameKatakana.setValue("キムラヤマ");

      this.postalCode.setValue('');

      this.postalCode.setValue(" ");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankPostalCode'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankPostalCode'));
      this.postalCode.setValue("1076231");

      this.prefecture.selectByValue(" ")
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankPerfecture'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankPerfecture'));
      this.prefecture.selectByValue("東京都");

      this.city.setValue(" ")
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankCity'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankCity'));
      this.city.setValue("港区");

      this.address.setValue(" ")
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankStreetAddress'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankStreetAddress'));
      this.address.setValue("港区");

      this.phoneNumber.setValue(" ");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.blankPhone'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.blankPhone'));
      this.phoneNumber.setValue("1234567890");
    }
  },

  validateShippingFormWithInvalidData: {
    value: function () {
      this.firstName.waitForEnabled();
      this.firstNameKatakana.setValue("名ヲ入");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.nonFullWidthFirstNameKatakana'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.nonFullWidthFirstNameKatakana'));
      this.firstNameKatakana.setValue("カズミチ");

      this.lastNameKatakana.setValue("名ヲ入");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.nonFullWidthLastNameKatakana'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.nonFullWidthLastNameKatakana'));
      this.lastNameKatakana.setValue("キムラヤマ");

      this.postalCode.setValue('');

      this.postalCode.setValue("141002");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.invalidLengthPostalCode'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.invalidLengthPostalCode'));
      this.postalCode.setValue("１－４－２０");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.nonNumericPostalCode'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.nonNumericPostalCode'));
      this.postalCode.setValue("1076231");

      this.phoneNumber.setValue("12345678");
      this.addressErrorTooltip.waitForVisible();
      expect(this.addressErrorTooltip.getText()).to.include(eval('i18n.addressValidationErrors.invalidLengthPhoneNo'));
      this.addressErrorMessage.waitForVisible();
      expect(this.addressErrorMessage.getAttribute('innerText')).to.include(eval('i18n.addressValidationErrors.invalidLengthPhoneNo'));
      this.phoneNumber.setValue("1234567890");
    }
  },
  /**
   * Verify delivery address form not submitted
   *
   */
  verifyShippingAddressFormNotSubmitted: {
    value: function () {
      let _this = this;
      browser.waitUntil(function () {
        return _this.submitDeliveryAddress.isVisible();
      }, 6000, `Expected form to not submit but is submitted`);
    }
  },

  /**
   * Select delivery date type
   *
   * @param {String} deliveryDate
   * @param {boolean} newUser, flag for new user checking
   */
  selectDeliveryDateTimeType: {
    value: function (deliveryDate, Number) {
      let amount = 0;
      let getTotalPrice = function (str) {
        let amtString = str.split('+');
        let amount = 0;
        amtString.forEach((item) => {
          amount += parseInt((item.match(/\d+/g) || ['0']).join(''));
        });
        return amount.toString();
      };
      deliveryNo = Number || '1';

      switch (deliveryDate) {
        case 'today':
          browser.waitForLoading();
          this.todayDeliveryDateRadio(deliveryNo).waitForEnabled();
          if (!this.todayDeliveryDisabled.isVisible()) { // SAME DAY DELIVERY MAY BE DISABLED, BASED ON TIME, SO WILL CHOOSE STANDARD
            amount = getTotalPrice(this.todayDeliveryDatePrice.getText());
            browser.waitForLoading();
            this.todayDeliveryDateRadio(deliveryNo).click();
            break;
          }
        case 'nextday':
          browser.waitForLoading();
          this.nextDayDeliveryDateRadio(deliveryNo).waitForEnabled();
          if (!this.nextDayDeliveryDateRadioDisabled.isVisible()) {
            amount = getTotalPrice(this.nextDayDeliveryDatePrice.getText());
            browser.waitForLoading();
            break;
          }
        case 'standard':
          browser.waitForLoading();
          this.standardDeliveryDateRadio(deliveryNo).waitForEnabled();
          amount = getTotalPrice(this.standardDeliveryDatePrice.getText());
          browser.waitForLoading();
          this.standardDeliveryDateRadio(deliveryNo).click();
          break;
        case 'bydate':
          browser.waitForLoading();
          this.byDateDeliveryDateRadio(deliveryNo).waitForEnabled();
          amount = getTotalPrice(this.byDateDeliveryDatePrice.getText());
          browser.waitForLoading();
          this.byDateDeliveryDateRadio(deliveryNo).click();
          break;
        case 'yupacket':
          browser.waitForLoading();
          this.yuPacketDeliveryRadio(deliveryNo).waitForEnabled();
          amount = getTotalPrice(this.yuPacketDeliveryPrice.getText());
          browser.waitForLoading();
          this.yuPacketDeliveryRadio(deliveryNo).click();
          break;
        case 'nekoPosPacket':
          browser.waitForLoading();
          this.nekoPosPacketDeliveryRadio(deliveryNo).waitForEnabled();
          amount = getTotalPrice(this.nekoPosPacketDeliveryPrice.getText());
          browser.waitForLoading();
          this.nekoPosPacketDeliveryRadio(deliveryNo).click();
          break;
      }

      return amount;
    }
  },

  selectNextDayDelivery: {
    value: function () {
      this.nextDayDeliveryDateRadio.waitForVisible();
      this.nextDayDeliveryDateRadio.moveToObject(0, 0);
      this.nextDayDeliveryDateRadio.click();
    }
  },

  /**
   * Selects first Available By date Delivery Date Time
   *
   * @param {int} index of date time to be chosen or 1st available if none provided
   * @return {Object} dateTime,
   * @return {String} dateTime.date
   * @return {String} dateTime.time
   */
  selectAvailableByDateDeliveryDateTime: {
    value: function (dateIndex, timeIndex) {
      let deliveryDateSelectorText = i18n.deliveryDateTimeSelector;
      this.byDateDeliveryDateSelector(deliveryDateSelectorText).waitForEnabled();
      this.byDateDeliveryDateSelector(deliveryDateSelectorText).selectByIndex(dateIndex || 2);

      this.byDateDeliveryTimeSelector(deliveryDateSelectorText).waitForEnabled();
      this.byDateDeliveryTimeSelector(deliveryDateSelectorText).selectByIndex(timeIndex || 2);

      return {
        date: this.byDateDeliveryDateSelector(deliveryDateSelectorText).getText('option:checked'),
        time: this.byDateDeliveryTimeSelector(deliveryDateSelectorText).getText('option:checked')
      };
    }
  },

  /**
   * Selects first Available Next date Delivery Time
   *
   * @param {int} index of time to be chosen or 1st available if none provided
   * @return {String} dateTime.time
   */
  selectAvailableNextDayDeliveryTime: {
    value: function () {
      let deliveryDateSelectorText = i18n.deliveryDateTimeSelector;
      this.byDateDeliveryTimeSelector(deliveryDateSelectorText).waitForEnabled();
      this.byDateDeliveryTimeSelector(deliveryDateSelectorText).selectByIndex(1);

      return {
        time: this.byDateDeliveryTimeSelector(deliveryDateSelectorText).getText('option:checked')
      };
    }
  },

  /**
   * Confirms the delivery date and time
   */
  confirmDeliveryDateTime: {
    value: function () {
      this.acceptButton.waitForEnabled();
      this.acceptButton.click();
    }
  },

  /**
   * Validates that Shipping Method is not displayed
   *
   * @param {String} shippingMethod Shipping Method
   */
  validateShippingMethodNotAvailable: {
    value: function (shippingMethod) {
      switch (shippingMethod) {
        case 'today':
          this.deliveryMethods.waitForEnabled();
          expect(this.todayDeliveryDateRadio.isVisible()).to.be.false;
          break;
        case 'standard':
          this.deliveryMethods.waitForEnabled();
          expect(this.standardDeliveryDateRadio('1').isVisible()).to.be.false;
          break;
        case 'bydate':
          this.deliveryMethods.waitForEnabled();
          expect(this.byDateDeliveryDateRadio.isVisible()).to.be.false;
          break;
        case 'yupacket':
          this.deliveryMethods.waitForEnabled();
          expect(this.yuPacketDeliveryRadio.isVisible()).to.be.false;
          break;
        case 'nekoPosPacket':
          this.deliveryMethods.waitForEnabled();
          expect(this.nekoPosPacketDeliveryRadio.isVisible()).to.be.false;
          break;
      }
    }
  },

  /**
   * Confirms choosen delivery method
   */
  confirmShipping: {
    value: function () {
      browser.waitForLoading();
      browser.pause(1000);
      this.confirmDeliveryMethodButton.waitForEnabled();
      this.confirmDeliveryMethodButton.click();
    }
  },

  /**
   * Check address form Visible/Hidden
   * @param {Bool} visible (TRUE/FAlSE)
   */
  addressFormIsVisible: {
    value: function (isVisible) {
      expect(this.addressForm.isVisible()).to.be.equal(isVisible);
    }
  },

  /**
   * Validates order address data against the input
   *
   * @params {Object} shippingAddress
   * @param {String} shippingAddress.firstName
   * @param {String} shippingAddress.lastName
   * @param {String} shippingAddress.firstNameKatakana
   * @param {String} shippingAddress.lastNameKatakana
   * @param {String} shippingAddress.postalCode
   * @param {String} shippingAddress.prefecture
   * @param {String} shippingAddress.city
   * @param {String} shippingAddress.street
   * @param {String} shippingAddress.streetNumber
   * @param {String} shippingAddress.aptName
   * @param {String} shippingAddress.phoneNumber
   * @param {String} shippingAddress.cellPhoneNumber
   */
  validateOrderAddress: {
    value: function (shippingAddress) {
      this.deliveryMethodName.waitForVisible();
      expect(this.deliveryFirstNameLastName.getAttribute('innerText')).to.include(shippingAddress.lastName + ' ' + shippingAddress.firstName);
      expect(this.deliveryPostalCode.getAttribute('innerText')).to.include(shippingAddress.postalCode.slice(0, 3) + '-' + shippingAddress.postalCode.slice(3));
      expect(this.deliveryPrefectureCityAddress.getAttribute('innerText')).to.include(shippingAddress.prefecture);
      expect(this.deliveryPrefectureCityAddress.getAttribute('innerText')).to.include(shippingAddress.city);
      expect(this.deliveryPrefectureCityAddress.getAttribute('innerText')).to.include(shippingAddress.street);
      expect(this.deliveryPrefectureCityAddress.getAttribute('innerText')).to.include(shippingAddress.streetNumber);
      if (shippingAddress.aptName) {
        expect(this.deliveryAptName.getAttribute('innerText')).to.equal(shippingAddress.aptName);
        expect(this.deliveryPhoneNumber.getAttribute('innerText')).to.equal(shippingAddress.phoneNumber);
        if (shippingAddress.cellPhoneNumber) {
          expect(this.deliveryCellPhoneNumber.getAttribute('innerText')).to.equal(shippingAddress.cellPhoneNumber);
        }
      } else {
        expect(this.deliveryAptName.getAttribute('innerText')).to.equal(shippingAddress.phoneNumber);
        if (shippingAddress.cellPhoneNumber) {
          expect(this.deliveryPhoneNumber.getAttribute('innerText')).to.equal(shippingAddress.cellPhoneNumber);
        }
      }
    }
  },

  /**
   * Validates order address data against the CVS
   *
   * @param {String} storeInfo.name
   * @param {String} storeInfo.address
   */
  validatePickupInUniqlo: {
    value: function (storeInfo) {
      browser.pause(750);
      this.fullAddressDetails.waitForVisible();
      browser.waitForLoading();
      expect(this.fullAddressDetails.getAttribute('innerText')).to.include(storeInfo.name);
      expect(this.fullAddressDetailsAddress.getAttribute('innerText')).to.include(storeInfo.address.slice(0, 6));
    }
  },

  /**
   * Validates order address data against the CVS
   *
   * @param {String} shippingAddress.postalCode
   * @param {String} shippingAddress.prefecture
   */
  validatePickupInCvs: {
    value: function (cvsData) {
      this.deliveryMethodName.waitForVisible();
      expect(this.deliveryMethodData.getAttribute('innerText')).to.include(cvsData.name);
      expect(this.deliveryMethodData.getAttribute('innerText')).to.include(cvsData.postalCode);
      expect(this.deliveryMethodData.getAttribute('innerText')).to.include(cvsData.prefecture);
    }
  },

  /**
   * Validates Shipping Method is the one selected
   *
   * @param {String} shippingMethod
   */
  validateShippingMethod: {
    value: function (shippingMethod) {
      this.shippingMethodType(1).waitForVisible();
      if(browser.params.featureContext.packingMethod === 'individual') {
        shippingMethod.forEach((shipping, index) => {
          expect(this.shippingMethodType(index).getAttribute('innerText')).to.include(i18n.shippingMethod[shipping]);
          expect(this.shippingMethodText(index).isVisible()).to.be.true;  
        });
      } else {
        expect(this.shippingMethodType(1).getAttribute('innerText')).to.include(i18n.shippingMethod[shippingMethod]);
        expect(this.shippingMethodText(1).isVisible()).to.be.true;
      }
    }
  },

  validateSameDayDeliveryDetails: {
    value: function () {
      browser.pause(5000);
      this.sameDayDelivery.waitForVisible();
      expect(this.sameDayDelivery.getAttribute('innerText')).to.include('300');
    }
  },

  validateMinistopStore: {
    value: function () {
      this.convenienceStoresLawsonStores.waitForVisible();
      expect(this.convenienceStoresLawsonStores.getAttribute('innerText')).to.include(i18n.ministopStore);
    }
  },

  selectPackingMethod: {
    value: function (packingMethod) {
      if (packingMethod === "collective") {
        this.collectiveShipping.waitForVisible();
        this.collectiveShipping.click();
      } else {
        this.selectiveShipping.waitForVisible();
        this.selectiveShipping.click();
      }
    }
  },
 
  validateProducts: {
    value: function () {
      let products = browser.params.featureContext.products;
      products.forEach((prod) => {
        this.productDetails.waitForVisible();
        expect(this.productDetails.getAttribute('innerText')).to.include(prod.size);
        expect(this.productDetails.getAttribute('innerText')).to.include(prod.color);
        expect(this.productDetails.getAttribute('innerText')).to.include(prod.quantity);
      });
    }
  },

  validateShipmentNo: {
    value: function (deliveryNo) {
      expect(this.shipmentTitle(deliveryNo).isVisible()).to.be.true;
    }
  }

};

let temp = Object.assign(OrderDeliveryPage);

module.exports = Object.create(Page, temp);
