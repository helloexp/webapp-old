let Page = require('./page');
let testPrerequisites = require('../utilities/testPrerequisites');

/**
 * Account Page Object
 *
 * @class e2e/pages/AccountPage
 * @type {Page}
 */

let AccountPage = {

  /**
   * define elements
   */
  mySizeLink: {get: function () { return browser.element('//a[contains(@href, "mysize/view")]');}},
  memberEditLink: {get: function () { return browser.element('//a[@analytics-label="Update member info"]');}},
  changeEmail: {get: function () { return browser.element('//label[contains(@for,"cb-show-email")]');}},
  editEmail: {get: function () { return browser.element('//input[@id="newemail"]');}},
  confirmButton: {get: function () { return browser.element('//input[contains(@type, "submit")]');}},
  password: {get: function () { return browser.element('//input[contains(@id, "password")]');}},
  registerButton: {get: function () {return browser.element('//input[contains(@value, "register")]');}},
  registerNewAddress: {get: function () {return browser.element('//button[contains(@class, "noAddressList")]');}},
  updateButton: {get: function () { return browser.element('//div[contains(@class,"btnLabel")]');}},
  confirmAddress: {get: function () { return browser.element('(//button[contains(@class,"medium")])[1]');}},
  changeAddressLink: {get: function () { return browser.element('//a[contains(@href, "account/addresses")]');}},
  returnToAddressBook: {get: function () { return browser.element('//div[contains(@class, "btnLabel")]');}},
  editAddressButton: {get: function () { return browser.element('(//button[contains(@class, "HOC")])[2]');}},
  postalCode: {get: function () { return browser.element('//input[contains(@name, "postalCodeReact")]');}},
  orderHistory: {get: function () {return browser.element('//a[contains(@href, "account/order")]');}},
  cancelOrder: {get: function () {return browser.element('(//button[contains(@class, "footerBtn")])[1]');}},
  cancelOrderButton: {get: function () {return browser.element('//button[@analytics-label= "Cancel order"]');}},
  orderHistoryDetails: {get: function () {return browser.element('(//button[contains(@class, "footerBtn")])[2]');}},
  orderHistoryDetailsCancel: {get: function () {return browser.element('//button[contains(@class, "cancelButtonInDetails")]');}},
  editCreditCardLink: {get: function () {return browser.element('//a[@href= "account/creditcards"]');}},
  /**
   * Overridden open function.
   * Opens / application page
   */
  open: {
    value: function (params) {
      let path = browser.params.language + '/account';
      path += params ? '?' + params : '?' + browser.params.queryString.brand;
      Page.open.call(this, path);
    }
  },

  /*
   * Navigates to Online My size page   
   */
  goToMySizePage: {
    value: function () {
      this.mySizeLink.waitForVisible();
      this.mySizeLink.click();
    }
  },

  /*
   * Navigates to Online Member edit page   
   */
  goToMemberEditPage: {
    value: function () {
      this.memberEditLink.waitForVisible();
      this.memberEditLink.click();
    }
  },

  /**
   * To Validate the Login Url
   */
  validateAccountUrl: {
    value: function () {
      browser.urlValidation('/account');
    }
  },

  /**
   * To Change registered email address
   */
  changeEmailAddress: {
    value: function (email) {
      this.changeEmail.waitForVisible();
      this.changeEmail.click();
      this.editEmail.waitForVisible();
      this.editEmail.setValue(email);
      this.password.setValue("test1234");
      this.confirmButton.click();
      this.confirmButton.click();
      browser.urlValidation('/member/edit/completion');
    }
  },

  /** 
   * Navigates to Credit Card Page
   */
  goToCrediTCardEditPage: {
    value: function () {
      this.editCreditCardLink.waitForVisible();
      this.editCreditCardLink.click();
    }
  },

  goToAddressBook: {
    value: function () {
      this.changeAddressLink.waitForVisible();
      this.changeAddressLink.click();
      browser.pause(2000);
      this.registerNewAddress.waitForVisible();
      this.registerNewAddress.click();
    }
  },    

  goToOrderHistory: {
    value: function () {
      this.orderHistory.waitForVisible();
      this.orderHistory.click();
    }
  },

  goToOrderCancel: {
    value: function () {
      this.cancelOrder.waitForVisible();
      this.cancelOrder.click();
      this.cancelOrderButton.waitForVisible();
      this.cancelOrderButton.click();
    }
  },

  goToOrderHistoryDetailsPage: {
    value: function () {
      this.orderHistoryDetails.waitForVisible();
      this.orderHistoryDetails.click();
      this.orderHistoryDetailsCancel.waitForVisible();
      this.orderHistoryDetailsCancel.click()
      this.cancelOrderButton.waitForVisible();
      this.cancelOrderButton.click();
    }
  },

  updateAddressBook: {
    value: function () {
      this.confirmAddress.waitForVisible();
      this.confirmAddress.click();
      browser.pause(2000);
      this.updateButton.waitForVisible();
      this.updateButton.click();
      browser.pause(2000);
      this.returnToAddressBook.waitForVisible();
      this.returnToAddressBook.click();               
    }
  },

  editAddress: {
    value: function (value) {
      this.editAddressButton.waitForVisible();
      this.editAddressButton.click();
      this.postalCode.waitForVisible();
      this.postalCode.setValue(value);
      this.confirmAddress.waitForVisible();
      this.confirmAddress.click();
    }
  },

  orderHistoryList: {
    value: function () {
      testPrerequisites.setLoginCookies();
      testPrerequisites.setCartCookies();
      let JSESSIONIDCookie = browser.params.JSESSIONIDCookie;
        browser.call(() => {
          return testPrerequisites.orderHistory(JSESSIONIDCookie).then((details) => {
            expect(details.order_history_inf_list[0].ord_no).to.be.equal('011710241958-63912');
            expect(details.order_history_inf_list[1].ord_no).to.be.equal('011710092011-63629');
            expect(details.order_history_inf_list[2].ord_no).to.be.equal('011710092010-63628');
            expect(details.order_history_inf_list[3].ord_no).to.be.equal('011710092007-63627');
            expect(details.order_history_inf_list[4].ord_no).to.be.equal('011709131854-62247');
        });
      })
    }
  }
};

module.exports = Object.create(Page, AccountPage);
