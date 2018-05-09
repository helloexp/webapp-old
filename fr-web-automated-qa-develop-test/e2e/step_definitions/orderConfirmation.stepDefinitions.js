let orderConfirmationPage = require('../pages/orderConfirmation.page');
let testPrerequisites = require('../utilities/testPrerequisites');

module.exports = function () {

  this.Then(/^User is redirected to Order Confirmation page$/,{retry: 2}, () => {
    orderConfirmationPage.validatePageUrl();
  });

  this.Then(/^The order is successfully placed$/, () => {
  	browser.waitForLoading();
  	let browserUrl = browser.getUrl();
  	browserUrl = browserUrl.replace('https://test3.uniqlo.com', 'dev.uniqlo.com:3000');
    browser.url(browserUrl);
    testPrerequisites.setOrderCookies();
    let orderNumber = browser.params.orderCookie[0].ord_no;
    orderConfirmationPage.validateOrderNumberIsSameASCookie(orderNumber);
  });

  this.Then(/^User validate customer information link$/,{retry: 2}, () => {
    orderConfirmationPage.validateCustomerInformationLink();
  });

  this.Then(/^User navigates to Order History page$/, () => {
  	orderConfirmationPage.goToOrderHistoryPage();
  });
};
