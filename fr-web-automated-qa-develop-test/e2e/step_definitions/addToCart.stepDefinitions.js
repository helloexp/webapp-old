let addToCartMockPage = require('../pages/productSelectMock.page');
let addToCartPDPPage = require('../pages/productSelectPDP.page');
let productList = require('../data/product');

module.exports = function () {

  this.Then(/^User adds products for "([^"]*)?" to cart from mock page$/, (ticketNumber) => {
    let products =  productList.filterByUsage(ticketNumber);
    console.log('Add products');
    browser.params.featureContext.products = products;

    addToCartMockPage.open();
    products.forEach((prod) => {
      addToCartMockPage.addProductToCart(prod);
      console.log(prod.id+ ' is added for '+ ticketNumber);;
    });
    browser.pause(3000);
  });

  this.Given(/^User adds products for "([^"]*)?" to cart from PDP page$/, { timeout: 240000, retry: 2 }, (ticketNumber) => {
    let products = productList.filterByUsage(ticketNumber);
    browser.params.featureContext.products = products;
    products.forEach((prod) => {
      addToCartPDPPage.addProductTocart(prod);
    });
    browser.pause(2000);
  });


  this.Given(/^User add GU products for "([^"]*)?" to cart from PDP page$/, { timeout: 240000, retry: 2 }, (ticketNumber) => {
    let products = productList.filterByUsage(ticketNumber);
    browser.params.featureContext.products = products;
    products.forEach((prod) => {
      addToCartPDPPage.addProductTocart(prod);
    });
    browser.pause(2000);
  });
  
  this.Given(/^User selects products for "([^"]*)?" from PDP page$/, { timeout: 240000, retry: 2 }, (ticketNumber) => {
    let products = productList.filterByUsage(ticketNumber);
    browser.params.featureContext.products = products;
    products.forEach((prod) => {
      addToCartPDPPage.selectProductTocart(prod);
      console.log(prod.id+ ' is added for '+ ticketNumber);;      
    });
    browser.pause(1500);
  });
};