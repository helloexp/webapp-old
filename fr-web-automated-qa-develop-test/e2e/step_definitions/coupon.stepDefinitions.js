let cartPage = require('../pages/cart.page');
let orderReviewPage = require('../pages/orderReview.page');
let couponPage = require('../pages/coupon.page');
let testPrerequisites = require('../utilities/testPrerequisites');
let couponList = require('../data/coupons');

module.exports = function () {

  this.When(/^User adds a( uq| gu)* coupon( from Cart page| from Order Review page)*$/, (couponType, location) => {
    couponType = couponType ? couponType.trim() : 'uq';
    location = location ? location.trim() : 'from Cart page';
    let couponDetails = {};
    if (browser.params.featureContext.coupon.couponId) {
      couponDetails = browser.params.featureContext.coupon.couponId
    } else {
      let env = process.env.npm_config_env || 'test3';
      couponDetails = couponList.filterByUsage(env+"-"+couponType);
      browser.params.featureContext.coupon = couponDetails;
    }

    if (location === 'from Cart page') {
      cartPage.openCouponPanel();
    }
    if (location === 'from Order Review page') {
      orderReviewPage.openCouponPanel();
      delete browser.params.featureContext.priceDetails.saleTax;
    }
    if (couponType === 'uq') {
      couponPage.addCouponByName(couponDetails[0].couponId);
    }
    if (couponType === 'gu') {
      couponPage.addCouponByName(couponDetails[0].couponId);

      browser.params.featureContext.coupon = couponDetails;
    }
  });

this.When(/^User deletes the coupon( from Cart page| from Order Review page)*$/, (location) => {
    location = location ? location.trim() : 'from Cart page';

    if (location === 'from Cart page') {
      cartPage.changeCoupon();
    }
    if (location === 'from Order Review page') {
      orderReviewPage.changeCoupon();
    }
    couponPage.deleteCoupon();    
    delete browser.params.featureContext.coupon;
  });
};
