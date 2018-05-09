import constants from 'config/site/default';

const { brandName } = constants;

export const routes = {
  addressBook: 'account/addresses',
  addToCart: 'add-to-cart',
  barCode: 'account/coupon/barcode',
  cart: 'cart',
  checkout: 'checkout',
  confirmOrder: 'checkout/order/confirm',
  coupons: 'checkout/coupons',
  creditCard: 'account/creditcards',
  creditCardRegistered: 'account/creditcards/registered',
  creditCardRemoved: 'account/creditcards/removed',
  delivery: 'checkout/delivery',
  deliveryStore: 'checkout/delivery/store',
  gifting: 'checkout/gifting',
  login: 'login',
  memberInfo: 'account',
  membershipCoupon: 'account/coupon',
  mySizeComplete: 'mysize/complete',
  mySizeConfirm: 'mysize/confirm',
  mySizeCreate: 'mysize/create',
  mySizeEdit: 'mysize/edit',
  mySizeView: 'mysize/view',
  orderCancel: 'account/order/cancel',
  orderDetails: 'account/order',
  orderHistory: 'account/order',
  payment: 'checkout/payment',
  paymentStore: 'checkout/payment/store',
  reviewOrder: 'checkout/order/review',
  wishlist: 'wishlist',
  productDetails: 'store/goods',
};

export const routePatterns = {
  cart: /cart\/?$/,
  checkout: /checkout\/?$/,
  confirmOrder: /checkout\/order\/confirm\/?$/,
  coupons: /checkout\/coupons\/?$/,
  creditCard: /account\/creditcards/,
  login: /login\/?/,
  pdp: /store\/goods\/.*/,
  reviewOrder: /checkout\/order\/review\/?$/,
  delivery: /checkout\/delivery\/?$/,
  deliveryStore: /checkout\/delivery\/store\/?$/,
  payment: /checkout\/payment\/?$/,
  paymentStore: /checkout\/payment\/store\/?$/,
  orderCancel: /account\/order\/cancel/,
  gifting: /checkout\/gifting\/?$/,
  // used only in App.js; should match all sub-routes under /account
  account: /account/,
  // used only in yahoo.js; should match all sub-routes under /checkout
  checkoutPages: /checkout/,
};

export const apiUrlPatterns = {
  GDS: {
    put: /restful\/api\/put/i,
    delete: /restful\/api\/delete/i,
  },
};

/**
 * Gets brand from API endpoint
 * @param {String} endpoint - API endpoint URL
 * @returns {String('uq'|'gu'|'')} brand
 */
export function getBrandFromAPIEndpoint(endpoint) {
  if (/\/uq\//.test(endpoint)) {
    return brandName.uq;
  } else if (/\/gu\//.test(endpoint)) {
    return brandName.gu;
  }

  return '';
}
