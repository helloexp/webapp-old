let mySizePage  = require('../pages/mySize.page');
let newMySize   = require('../data/mySize');

module.exports = function () {

  this.When(/^User validate the my size creation form$/, () => {
    mySizePage.validateMySizeCreation();
  });

  this.When(/^User Creates a new (valid|invalid) My Size$/,  function (type) {
    mySizePage.createNewMySize(newMySize[type]);
  });

  this.When(/^User Fills My Size Details$/, () => {
    mySizePage.fillMySizeFields();
  });

  this.When(/^User Validate My Size Fields$/, () => {
    mySizePage.validateMySizeFields();
  });

  this.When(/^User Submit My Size$/, () => {
    mySizePage.submitMySizeForm();
  });

  this.When(/^User Validate My Size Details$/, () => {
    mySizePage.validateMySizeDetails();
  });

  this.When(/^User Confirms the My Size Details$/, () => {
    mySizePage.confirmsMySizeDetails();
  });

  this.Then(/^User Validate the Confirmation Message$/, () => {
    mySizePage.validateMySizeConfirmation();
  });

  this.Then(/^My Size Submit Button Disabled$/, () => {
    mySizePage.submitButtonDisabled();
  });
};
