/* eslint-disable react/jsx-sort-props */
import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { injectAsyncReducers } from 'redux/create';
import { routes } from 'utils/urlPatterns';
import { maybeAddYahooTracker } from 'utils/yahoo';

/**
 * @typedef {Object} require
 */

// polyfill needed since server side rendering won't have require.ensure
if (typeof require.ensure !== 'function') require.ensure = function ensure(dependencies, callback) { callback(require); };

let store = null;

const homeGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const modules = {
      home: require('containers/Home/Home'),
    };

    cb(null, modules[moduleName]);
  }, 'home');
};

const cartGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const reducers = {
      certona: require('../redux/modules/certona').default,
      coupons: require('../redux/modules/membership/coupons').default,
      delivery: require('../redux/modules/checkout/delivery').default,
      gifting: require('../redux/modules/checkout/gifting/reducer'),
      order: require('../redux/modules/checkout/order/reducer'),
      payment: require('../redux/modules/checkout/payment/reducer'),
      productGender: require('../redux/modules/productGender').default,
      silveregg: require('../redux/modules/silveregg').default,
      styleRecommendations: require('../redux/modules/style').default,
      applePay: require('../redux/modules/applePay').default,
      userInfo: require('../redux/modules/account/userInfo').default,
      wishlist: require('../redux/modules/wishlist/reducer'),
    };

    const modules = {
      cart: require('../pages/Cart'),
    };

    injectAsyncReducers(store, reducers);
    cb(null, modules[moduleName]);
    maybeAddYahooTracker();
  }, 'cart');
};

export const checkoutGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const reducers = {
      address: require('../redux/modules/account/address').default,
      certona: require('../redux/modules/certona').default,
      coupons: require('../redux/modules/membership/coupons').default,
      creditCard: require('../redux/modules/checkout/payment/creditCard/reducer'),
      delivery: require('../redux/modules/checkout/delivery').default,
      deliveryStore: require('../redux/modules/checkout/delivery/store/reducer'),
      giftCard: require('../redux/modules/checkout/payment/giftCard/reducer'),
      gifting: require('../redux/modules/checkout/gifting/reducer'),
      orderHistory: require('../redux/modules/account/orderHistory').default,
      payment: require('../redux/modules/checkout/payment/reducer'),
      paymentStore: require('../redux/modules/checkout/payment/store').default,
      styleRecommendations: require('../redux/modules/style').default,
      userInfo: require('../redux/modules/account/userInfo').default,
      wishlist: require('../redux/modules/wishlist/reducer'),
    };

    injectAsyncReducers(store, reducers);

    maybeAddYahooTracker();

    switch (moduleName) {
      case 'checkout':
        return cb(null, require('../pages/Checkout'));
      case 'confirmOrder':
        return cb(null, require('../pages/Checkout/ConfirmOrder'));
      case 'delivery':
        return cb(null, require('../pages/Checkout/Delivery'));
      case 'payment':
        return cb(null, require('../pages/Checkout/Payment'));
      case 'reviewOrder':
        return cb(null, require('../pages/Checkout/ReviewOrder'));
      default:
        return true;
    }
  }, 'checkout');
};

const checkoutMiscGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const reducers = {
      deliveryStore: require('../redux/modules/checkout/delivery/store/reducer'),
      delivery: require('../redux/modules/checkout/delivery').default,
      gifting: require('../redux/modules/checkout/gifting/reducer'),
      payment: require('../redux/modules/checkout/payment/reducer'),
      paymentStore: require('../redux/modules/checkout/payment/store').default,
      userInfo: require('../redux/modules/account/userInfo').default,
    };

    injectAsyncReducers(store, reducers);

    maybeAddYahooTracker();

    switch (moduleName) {
      case 'coupons':
        return cb(null, require('../pages/Checkout/Coupons'));
      case 'deliveryStore':
        return cb(null, require('../pages/Checkout/Delivery/PickupStore/StoresMap'));
      case 'gifting':
        return cb(null, require('../pages/Checkout/Gifting'));
      case 'paymentStore':
        return cb(null, require('../pages/Checkout/Payment/StorePayment/StoresMap'));
      default:
        return true;
    }
  }, 'checkoutMisc');
};

const loginGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const modules = {
      login: require('../pages/Account/Login'),
      logout: require('../pages/Account/Logout'),
    };

    cb(null, modules[moduleName]);
  }, 'login');
};

const mySizeGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const reducers = {
      mySize: require('../redux/modules/mySize').default,
      purchaseHistory: require('../redux/modules/account/purchaseHistory').default,
    };

    injectAsyncReducers(store, reducers);

    switch (moduleName) {
      case 'complete':
        return cb(null, require('../pages/MySize/CompleteSizes'));
      case 'confirm':
        return cb(null, require('../pages/MySize/ConfirmSizes'));
      case 'edit':
      case 'create':
        return cb(null, require('../pages/MySize/CreateEdit'));
      case 'view':
        return cb(null, require('../pages/MySize/ViewMySize'));
      default:
        return true;
    }
  }, 'mySize');
};

const accountGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const reducers = {
      address: require('../redux/modules/account/address').default,
      coupons: require('../redux/modules/membership/coupons').default,
      deliveryStore: require('../redux/modules/checkout/delivery/store/reducer'),
      gifting: require('../redux/modules/checkout/gifting/reducer'),
      orderHistory: require('../redux/modules/account/orderHistory').default,
      payment: require('../redux/modules/checkout/payment/reducer'),
      productGender: require('../redux/modules/productGender').default,
      delivery: require('../redux/modules/checkout/delivery').default,
      userInfo: require('../redux/modules/account/userInfo').default,
      paymentStore: require('../redux/modules/checkout/payment/store').default,
    };

    injectAsyncReducers(store, reducers);

    switch (moduleName) {
      case 'addressBook':
        return cb(null, require('../pages/Account/Address'));
      case 'barCode':
        return cb(null, require('../pages/BarCode'));
      case 'coupons':
        return cb(null, require('../pages/Checkout/Coupons'));
      case 'creditCard':
        return cb(null, require('../pages/Account/CreditCard'));
      case 'creditCardRegistered':
        return cb(null, require('../pages/Account/CreditCard/RegistrationCompleted'));
      case 'delivery':
        return cb(null, require('../pages/Checkout/Delivery'));
      case 'memberInfo':
        return cb(null, require('../pages/Account/MembershipInfo'));
      case 'membershipCoupon':
        return cb(null, require('../pages/Membership'));
      case 'orderCancel':
        return cb(null, require('../pages/Account/OrderHistory/OrderCancel'));
      case 'orderDetails':
        return cb(null, require('../pages/Account/OrderHistory/OrderDetails'));
      case 'orderHistory':
        return cb(null, require('../pages/Account/OrderHistory'));
      default:
        return true;
    }
  }, 'account');
};

const miscGroup = moduleName => (nextState, cb) => {
  require.ensure([], (require) => {
    const modules = {
      addToCart: require('../pages/AddToCart'),
    };

    cb(null, modules[moduleName]);
  }, 'misc');
};

/* KEEP THE ROUTES IN ALPHABETICAL + HIERARCHICAL ORDER */
const addressBook = <Route path={routes.addressBook} key="addressbook" getComponents={accountGroup('addressBook')} />;
const addToCart = __DEVELOPMENT__ ? <Route path={routes.addToCart} key="AddToCart" getComponents={miscGroup('addToCart')} /> : null;
const barCode = <Route path={routes.barCode} key="BarCode" getComponents={accountGroup('barCode')} />;
const cart = <Route path={routes.cart} key="cart" getComponents={cartGroup('cart')} />;
const checkout = <Route path={routes.checkout} key="checkout" getComponents={checkoutGroup('checkout')} />;
const confirmOrder = <Route path={routes.confirmOrder} key="confirmOrder" getComponents={checkoutGroup('confirmOrder')} />;
const coupons = <Route path={routes.coupons} key="coupons" getComponents={accountGroup('coupons')} />;
const creditCard = <Route path={routes.creditCard} key="CreditCard" getComponents={accountGroup('creditCard')} />;
const creditCardRegistered = <Route path={routes.creditCardRegistered} key="CreditCardRegistered" getComponents={accountGroup('creditCardRegistered')} />;
const delivery = <Route path={routes.delivery} key="delivery" getComponents={accountGroup('delivery')} />;
const deliveryStore = <Route path={routes.deliveryStore} key="deliverystore" getComponents={checkoutMiscGroup('deliveryStore')} />;
const gifting = <Route path={routes.gifting} key="gifting" getComponents={checkoutMiscGroup('gifting')} />;
const home = <IndexRoute getComponents={homeGroup('home')} key="home" />;
const login = <Route path={routes.login} key="login" getComponents={loginGroup('login')} />;
const logout = <Route path="logout" key="logout" getComponents={loginGroup('logout')} />;
const memberInfo = <Route path={routes.memberInfo} key="memberInfo" getComponents={accountGroup('memberInfo')} />;
const membershipCoupon = <Route path={routes.membershipCoupon} key="membershipCoupon" getComponents={accountGroup('membershipCoupon')} />;
const mySizeComplete = <Route path={routes.mySizeComplete} key="mySizeComplete" getComponents={mySizeGroup('complete')} />;
const mySizeConfirm = <Route path={routes.mySizeConfirm} key="mySizeConfirm" getComponents={mySizeGroup('confirm')} />;
const mySizeCreate = <Route path={routes.mySizeCreate} key="mySizeCreate" getComponents={mySizeGroup('create')} />;
const mySizeEdit = <Route path={`${routes.mySizeEdit}/:id`} key="mySizeEdit" getComponents={mySizeGroup('edit')} />;
const mySizeView = <Route path={routes.mySizeView} key="mySizeView" getComponents={mySizeGroup('view')} />;
const orderCancel = <Route path={`${routes.orderCancel}/:id`} key="orderCancel" getComponents={accountGroup('orderCancel')} />;
const orderDetails = <Route path={`${routes.orderDetails}/:id`} key="orderdetails" getComponents={accountGroup('orderDetails')} />;
const orderHistory = <Route path={routes.orderHistory} key="orderhistory" getComponents={accountGroup('orderHistory')} />;
const payment = <Route path={routes.payment} key="payment" getComponents={checkoutGroup('payment')} />;
const paymentStore = <Route path={routes.paymentStore} key="paymentstore" getComponents={checkoutMiscGroup('paymentStore')} />;
const reviewOrder = <Route path={routes.reviewOrder} key="reviewOrder" getComponents={checkoutGroup('reviewOrder')} />;
/* KEEP THE ROUTES IN ALPHABETICAL + HIERARCHICAL ORDER (REPEATING this JUST because people don't seem to read the first comment OK BRO OCD much? :D) */

export function getPublicRoutes(storeInstance) {
  const optionalRoutes = [];

  if (__DEVELOPMENT__) {
    optionalRoutes.push(addToCart);
  }

  store = storeInstance;

  return [
    ...optionalRoutes,
    barCode,
    cart,
    home,
    login,
    logout,
  ];
}

export function getAuthenticatedRoutes(storeInstance) {
  store = storeInstance;

  return [
    addressBook,
    barCode,
    checkout,
    confirmOrder,
    coupons,
    creditCard,
    creditCardRegistered,
    delivery,
    deliveryStore,
    gifting,
    memberInfo,
    membershipCoupon,
    mySizeComplete,
    mySizeConfirm,
    mySizeCreate,
    mySizeEdit,
    mySizeView,
    orderCancel,
    orderDetails,
    orderHistory,
    payment,
    paymentStore,
    reviewOrder,
  ];
}
