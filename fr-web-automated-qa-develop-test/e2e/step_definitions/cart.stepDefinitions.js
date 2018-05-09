let cartPage = require('../pages/cart.page');
let testPrerequisites = require('../utilities/testPrerequisites');

module.exports = function () {

  this.Given(/^User goes to( uq| gu)* Cart$/, (cartType) => {
    cartType = cartType ? cartType.trim() : undefined;
    cartPage.open(cartType);
  });

  this.Given(/^User returns to( uq| gu)* Cart$/, {retry: 2}, (cartType) => {
    cartType = cartType ? cartType.trim() : undefined;

    testPrerequisites.getLoginCookiesBeforeLogin();
    cartPage.forceAddOfCookies(cartType);
  });

  this.When(/^User goes to Login page$/, () => {
    cartPage.goToLogin();
  });

  this.Then(/^User logs out$/, () => {
    testPrerequisites.deleteLoginCookies();
    cartPage.logout();
  });

  this.When(/^Prerequisites user set the Address$/, (table) => {
    let shippingAddress = table.rowsHash();
    testPrerequisites.setLoginCookies();
    testPrerequisites.setCartCookies();

    let JSESSIONIDCookie = browser.params.JSESSIONIDCookie;
    let uniqloTokenCookie = browser.params.uniqloTokenCookie;
    browser.call(() => {
      return testPrerequisites.addNewUserAddress(uniqloTokenCookie, JSESSIONIDCookie, shippingAddress).then(() => {
        console.log('New User Address added.');
      });
    });
    console.log('in the function');
  });

  this.When(/^Prerequisites Reset user( Address)*( Credit Card)*( Cart data)*$/, (address, creditCard, cartData) => {
    browser.waitForLoading();
    testPrerequisites.setLoginCookies();
    testPrerequisites.setCartCookies();

    let JSESSIONIDCookie = browser.params.JSESSIONIDCookie;
    let uniqloTokenCookie = browser.params.uniqloTokenCookie;

    let mcnuCookie = browser.params.mcnuCookie;
    let tvuCookie = browser.params.tvuCookie;
    let mcngCookie = browser.params.mcngCookie;
    let tvgCookie = browser.params.tvgCookie;

    if (creditCard) {
      browser.call(() => {
        return testPrerequisites.getUserCreditCard(JSESSIONIDCookie).then((creditCardResponse) => {
          console.log('CreditCard get.');
          if (creditCardResponse && creditCardResponse.db_key) {
            testPrerequisites.deleteUserCreditCard(JSESSIONIDCookie, creditCardResponse, uniqloTokenCookie).then(() => {
              console.log('CreditCard deleted.');
            });
          } else {
            console.log('User does not have any CreditCard.');
          }
        });
      })
    }

    if (address) {
      browser.call(() => {
        return testPrerequisites.resetUserAddress(uniqloTokenCookie).then(() => {
          console.log('Address reset.');
        });
      })
    }

    if (cartData) {
      browser.call(() => {
        return testPrerequisites.deleteUserUqCart(mcnuCookie, tvuCookie).then(() => {
          testPrerequisites.deleteUqCartCookies();
          console.log('UQ Cart deleted.');
        });
      })
    }

    if (cartData) {
      browser.call(() => {
        return testPrerequisites.deleteUserGuCart(mcngCookie, tvgCookie).then(() => {
          testPrerequisites.deleteGuCartCookies();
          console.log('GU Cart deleted.');
        });
      })
    }

    browser.pause(2500); // Wait for prerequisites API calls to end
  });

  this.When(/^User updates the quantity of product "([^"]*)?" with "([^"]*)?"$/, (productSku, quantity) => {
    let products = browser.params.featureContext.products;
    products.forEach((prod, index) => {
      let qty = undefined;
      if (prod.sku === productSku) {
        if (prod.multiBuy === 'yes') {
          products.splice(index + 1, 0, prod);
          qty = +products[index].quantity + +quantity;
        } else {
          products[index].quantity = +products[index].quantity + +quantity;
        }
        cartPage.updateQuantity(products[index], qty);

        browser.params.featureContext.products = products;
      }
    });
  });

  this.When(/^User delete item "([^"]*)?" from Cart page$/, (productSku) => {
    let products = browser.params.featureContext.products;
    products.forEach((prod, index) => {
      if (prod.sku === productSku) {
        browser.waitForLoading();
        cartPage.deleteProductsFromCart(products[index]);
        products.splice(index, 1);
      }
    });
  });

  this.When(/^User validates the( uq| gu)* cart for shipping messages$/, (cartType) => {
    cartType = cartType.trim();
    cartPage.validateCartMesageForFreeShipping(cartType);
  });
    
  this.Then(/^User confirms that the cart is empty$/, () => {
    cartPage.validateCartIsEmpty();
  });

  this.When(/^User gets the order summary price details$/, {retry: 2}, () => {
    cartPage.openOrderSummarySection();
    browser.params.featureContext.priceDetails = cartPage.getPriceDetails();
  });

  this.When(/^User triggers checkout$/, () => {
    cartPage.triggerCheckout();
  });

this.When(/^User closes and reopens the browser$/, () => {
    browser.reload();
    cartPage.open();
  });

  this.When(/^User refresh the browser$/, () => {
    browser.refresh();
  });

  this.When(/^User (enables|disables) the gift option$/, (enables) => {
    cartPage.enableGiftOption(enables === 'enables');
  });

  this.Then(/^User is successfully logged in$/, {retry: 2}, () => {
    cartPage.validateLogin();
    testPrerequisites.setLoginCookiesBeforeLogin();
    cartPage.dismissMergingAlert();
  });

  this.Then(/^User is redirected to Cart page$/, () => {
    cartPage.validateCartPageURL();
  });

  this.When(/^User selects Contact Us$/, () => {
    cartPage.gotoContactUs();
  });

  this.Then(/^User is redirected to FAQ Page$/, () => {
    cartPage.validateFAQURL();
  });

  this.Then(/^Product "([^"]*)?" is deleted from cart$/, (productSku) => {
    let products = browser.params.featureContext.products;
    products.forEach((prod, index) => {
      if (prod.sku === productSku) {
        cartPage.validateProductNotPresentInCart(prod);
      }
    });
  });

  this.Then(/^Product quantity is successfully updated$/, () => {
    let products = browser.params.featureContext.products;
    products.forEach((prod, index) => {
      cartPage.validateQuantityUpdate(products[index]);
    });
  });

  this.Then(/^Product "([^"]*)?" quantity is not updated with "([^"]*)?"$/, (productSku, quantity) => {
    let products = browser.params.featureContext.products;
    products.forEach((prod, index) => {
      if (prod.sku === productSku) {
        products[index].quantity = +products[index].quantity - +quantity;
      }
      cartPage.validateQuantityUpdate(products[index]);
    });
  });

  this.Then(/^An error message is displayed because (100.000 Yen cart value|99 products in cart) limit was exceeded$/, (value) => {
    if (value === '100.000 Yen cart value') {
      cartPage.validatePriceLimitErrorMessage();
    }
    if (value === '99 products in cart') {
      cartPage.validateSizeLimitErrorMessage();
    }
  });

  this.Then(/^User verifies no giftcard details are displayed in Cart page$/, () => {
    let priceDetails = browser.params.featureContext.priceDetails;
    cartPage.openOrderSummarySection();
    cartPage.verifyCartGiftCardDetails(priceDetails);
  });

  this.Then(/^Coupon is applied in cart$/, () => {
    let couponDetails = browser.params.featureContext.coupon;
    console.log('Added Coupon');
    cartPage.validateAppliedCoupon(couponDetails[0].couponName);
  });

  this.Then(/^Coupon amount is correct on Cart page$/, () => {
    let couponDetails = browser.params.featureContext.coupon;
    cartPage.validateCouponAmount(couponDetails[0].amount);
  });

  this.Then(/^Products are present in Cart page$/, () => {
    let products = browser.params.featureContext.products;
    let totalProducts = 0;
    products.forEach((prod) => {
      cartPage.validateProductPresentInCart(prod);
      totalProducts += +prod.quantity;
    });
    cartPage.validateTotalProducts(totalProducts);
  });

  this.Then(/^User validates the recently viewed items in cart page$/, () => {
    let products = browser.params.featureContext.products
    products.reverse().forEach((prod) => {
      cartPage.validateRecentlyViewed(prod.id);  
    });    
  });
  this.When(/^User triggers fast checkout$/, () => {
    browser.setCookie({
      name: 'concierge_store',
      value : '10101396',
    });
    cartPage.triggerCheckout();
  });
};
