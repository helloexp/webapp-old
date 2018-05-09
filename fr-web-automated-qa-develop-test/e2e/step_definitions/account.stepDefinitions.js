let loginPage = require('../pages/login.page');
let accountPage = require('../pages/account.page');
let registrationPage = require('../pages/registration.page');
let confirmRegistrationPage = require('../pages/confirmRegistration.page');
let orderDeliveryPage = require('../pages/orderDelivery.page');
let testPrerequisites = require('../utilities/testPrerequisites');
let newUserGenerator = require('../data/user');
let address = require('../data/shippingAddress');

module.exports = function () {

  this.When(/^User navigates to Account page$/, () => {
    accountPage.open();
    accountPage.validateAccountUrl();
  });

  this.When(/^User navigates to My Size page$/, () => {
    accountPage.goToMySizePage();
  });

  this.When(/^User navigates to Member Edit page$/, () => {
    accountPage.goToMemberEditPage();
  });

  this.When(/^User navigates to Credit Card Page$/, () => {
   accountPage.goToCrediTCardEditPage();
  });

  this.When(/^User changes the registered email address$/, () => {
    const email = 'automation' + new Date().getTime() + '@uniqlo.com';
    browser.params.featureContext.registeredUser.email = email;
    accountPage.changeEmailAddress(email);
  });

  this.When(/^User decides to registers as a new user$/, () => {
    loginPage.goToRegistration();
  });

  this.When(/^User registers within the app$/, {retry: 2}, () => {
    let env = process.env.npm_config_env || 'test3';
    const userData = newUserGenerator.filterByUsage(env)[0];
    user = userData;

    browser.params.featureContext.registeredUser = user;
    console.log('User with email: ' + user.email + ' is created.');
    registrationPage.fillForm(user);
    registrationPage.submit();
  });

  this.When(/^User registers within the app using store account$/, {retry: 2}, (table) => {
    let env = process.env.npm_config_env || 'test3';
    env = env + '-store';
    const userData = newUserGenerator.filterByUsage(env)[0];
    user = userData;

    browser.params.featureContext.registeredUser = user;
    console.log('User with email: ' + user.email + ' is created.');
    registrationPage.fillForm(user);
    registrationPage.submit();
  });

  this.When(/^User confirms the new account$/, {retry: 2}, () => {
    confirmRegistrationPage.submit();
  });

  this.When(/^User logs in( with registered account)*$/, {retry: 2}, (registeredUser, table) => {
    let user = (registeredUser) ? browser.params.featureContext.registeredUser : table.rowsHash();
    loginPage.fillForm(user);
    loginPage.submit();
  });

  this.When(/^User goes to Address Book page and clicks on Register new Address$/, () => {
    accountPage.goToAddressBook();
  });

  this.When(/^User adds a new address from account page$/, () => {
    let env = process.env.npm_config_env || 'test3';
    shippingAddress = address.filterByUsage(env)[0];
    orderDeliveryPage.fillAddressForm(shippingAddress);
  });

  this.When(/^User updates the address book$/, () => {
    accountPage.updateAddressBook();
  });

  this.When(/^User edits the pincode from address book to "([^"]*)?"$/, (value) => {
    accountPage.editAddress(value);
  }); 

  this.When(/^User navigates to Order History List page$/, () => {
    accountPage.goToOrderHistory();
  });

  this.When(/^User cancels the order from Order History page$/, () => {
    accountPage.goToOrderCancel();
  });

  this.When(/^User goes to Order History Details page and cancels the order$/, () => {
    accountPage.goToOrderHistoryDetailsPage();
  });

  this.When(/^User verifies the last 5 Orders$/, () => {
    accountPage.orderHistoryList();
  });
};
