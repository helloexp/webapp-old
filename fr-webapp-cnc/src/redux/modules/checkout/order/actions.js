import reactCookie from 'react-cookie';
import config from 'config';
import { cartApi, orderApi, apiTypes } from 'config/api';
import getSiteConfig from 'config/site';
import * as cartActions from 'redux/modules/cart';
import { updateLoader } from 'redux/modules/app';
import { isUserDefaultDetailsLoaded, loadDefaultDetails } from 'redux/modules/account/userInfo';
import { resetCard, sendToBlueGate } from 'redux/modules/checkout/payment/creditCard/actions';
import { getPaymentStoreDetails } from 'redux/modules/checkout/payment/store';
import {
  getCurrentHost,
  replaceUrlParams,
  getCurrentBrand,
  getUrlWithQueryData,
  redirect,
} from 'utils/routing';
import { isStoreStaffEmail } from 'utils/validation';
import isObject from 'utils/isObject';
import { removeCheckoutStatus } from 'redux/modules/checkout';
import { loadDeliveryMethodOptions, resetNextDayDeliveryDontCareFlag } from 'redux/modules/checkout/delivery';
import { loadRecentlyViewedProductIds } from 'redux/modules/style';
import { fetchGiftBags, fetchMessageCards } from 'redux/modules/checkout/gifting/actions';
import { isGiftBagsLoaded } from 'redux/modules/checkout/gifting/selectors';
import { cancelOrder } from 'redux/modules/account/orderHistory';
import ClientStorage from 'utils/clientStorage';
import { routes } from 'utils/urlPatterns';
import { ignoreResponseFailures } from 'utils/requestResponse';
import { constantsGenerator } from 'utils';
import { checkIfApplePayGuestUserInConfirmPage } from 'utils/applePay';
import { LocalStorage } from 'helpers/WebStorage';
import { getCommonOrderParams, getExtraConfig } from 'utils/order';

const generateConstants = constantsGenerator('order/retry');

export const SAVE_ORDER = 'checkout/SAVE_ORDER';
export const SAVE_ORDER_SUCCESS = 'checkout/SAVE_ORDER_S';
export const SAVE_ORDER_FAIL = 'checkout/SAVE_ORDER_F';
export const CONFIRM_ORDER = 'order/CONFIRM_ORDER';
export const CONFIRM_ORDER_SUCCESS = 'order/CONFIRM_ORDER_S';
export const CONFIRM_ORDER_FAIL = 'order/CONFIRM_ORDER_F';

export const FETCH_ORDER_SUMMARY = 'order/FETCH_ORDER_SUMMARY';
export const FETCH_ORDER_SUMMARY_SUCCESS = 'order/FETCH_ORDER_SUMMARY_S';
export const FETCH_ORDER_SUMMARY_FAIL = 'order/FETCH_ORDER_SUMMARY_F';
export const CHANGE_ORDER_PROCESS = 'order/CHANGE_ORDER_PROCESS';
export const FETCH_DELIVERY_DETAILS_SUCCESS = 'order/FETCH_DELIVERY_DETAILS_S';
export const SET_ORDER_SUMMARY = 'checkout/order/SET_ORDER_SUMMARY';
export const SET_DIFFERENCE = 'checkout/order/SET_DIFFERENCE';

export const SAVE_ORDER_KEY = 'uniqlo/cart/SAVE_ORDER_KEY';
export const SET_ORDER_KEY = 'uniqlo/cart/SET_ORDER_KEY';
export const REMOVE_ORDER_KEY = 'uniqlo/cart/REMOVE_ORDER_KEY';

export const SAVE_ORDER_NUMBER = 'uniqlo/cart/SAVE_ORDER_NUMBER';
export const SET_ORDER_NUMBER = 'uniqlo/cart/SET_ORDER_NUMBER';
export const REMOVE_ORDER_NUMBER = 'uniqlo/cart/REMOVE_ORDER_NUMBER';

export const REMOVE_ORDER_SUCCESS = 'uniqlo/cart/REMOVE_ORDER_S';
export const GET_ORDER_DETAILS_LIST_SUCCESS = 'order/GET_ORDER_DETAILS_LIST_S';
export const GET_ORDER_DETAILS_LIST_FAIL = 'order/GET_ORDER_DETAILS_LIST_F';
export const SET_CURRENT_REVIEW_PAYMENT = 'order/SET_CURRENT_REVIEW_PAYMENT';
export const CLEAR_ORDER_DETAILS = 'order/CLEAR_ORDER_DETAILS';

export const READ_AFFILIATE_SITE_ID = 'uniqlo/order/READ_AFFILIATE_SITE_ID';
export const READ_AFFILIATE_TIME_ENTERED = 'uniqlo/order/READ_AFFILIATE_TIME_ENTERED';

const REMOVE_ORDER_FAIL = 'uniqlo/cart/REMOVE_ORDER_F';
const REMOVE_ORDER = 'uniqlo/cart/REMOVE_ORDER';
const GET_ORDER_DETAILS_LIST = 'order/GET_ORDER_DETAILS_LIST';
const { RETRY_ORDER_LIST, RETRY_ORDER_LIST_SUCCESS, RETRY_ORDER_LIST_FAIL } = generateConstants('RETRY_ORDER_LIST');
const { RETRY_ORDER_CANCEL, RETRY_ORDER_CANCEL_SUCCESS, RETRY_ORDER_CANCEL_FAIL } = generateConstants('RETRY_ORDER_CANCEL');

const REDIRECT_TO_CART = 'order/REDIRECT_TO_CART';
const REDIRECT_TO_CONFIRM_ORDER = 'order/REDIRECT_TO_CONFIRM_ORDER';
const REDIRECT_FROM_ORDER_HISTORY = 'order/REDIRECT_FROM_ORDER_H';

export const CONFIRM_ORDER_BY_ID = 'order/CONFIRM_ORDER_BY_ID';
export const CONFIRM_ORDER_SUCCESS_BY_ID = 'order/CONFIRM_ORDER_BY_ID_S';
export const CONFIRM_ORDER_FAIL_BY_ID = 'order/CONFIRM_ORDER_F';

export const SHOW_REGISTRATION_SUCCESS_SCREEN = 'order/SHOW_REGISTRATION_SUCCESS_SCREEN';
export const TOGGLE_REGISTRATION_MODAL = 'order/TOGGLE_REGISTRATION_MODAL';

const { cookies, localStorageKeys } = config.app;
const {
  payment,
  deliveryTypes,
  creditCard,
  brandName,
  brand: brandCode,
  order: { orderErrorCodes, retryCodes, donotRetryCodes, orderStatus },
  CUSTOMER_NOTES_BASE_URL,
} = getSiteConfig();

const errorHandler = { apiType: apiTypes.GDS, showMessage: true, enableReaction: true };
const promiseConfig = {
  host: cartApi.host,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};

const deletePromiseConfig = {
  ...promiseConfig,
  host: cartApi.hostForRemove,
};

export function isOrderLoaded(state) {
  return state && state.order && state.order.ord_no;
}

export function saveOrderNumber(result) {
  const expires = new Date();

  expires.setTime(expires.getTime() + cookies.cartExpires);

  return {
    type: SAVE_ORDER_NUMBER,
    cookie: {
      key: cookies.orderCookie,
      value: result.orderList,
      format: 'json',
      expires,
      domain: cookies.domain,
    },
  };
}

function getOrderOfCurrentBrand(pageNumber, responseConfig) {
  return (dispatch, getState) => dispatch({
    types: [RETRY_ORDER_LIST, RETRY_ORDER_LIST_SUCCESS, RETRY_ORDER_LIST_FAIL],
    promise: (client, brand) => client.get(orderApi.placeOrder, {
      ...promiseConfig,
      host: `${orderApi.base}/${brand}/${orderApi.region}`,
      params: {
        client_id: orderApi.clientId,
        page_no: pageNumber,
        disp_count: '5',
      },
    }),
  }).then((response) => {
    const currentBrand = getCurrentBrand(getState());
    const orderDataToCancel = response.order_history_inf_list.length && response.order_history_inf_list.find(order =>
      order.ord_brand_kbn === brandCode[currentBrand]);
    const maxPageNumber = Math.ceil(response.record_count / 5);

    if (orderDataToCancel) {
      return Promise.resolve({ order_history_inf_list: [{ ...orderDataToCancel, ...responseConfig }] });
    } else if (pageNumber === maxPageNumber) {
      return Promise.resolve();
    }

    return dispatch(getOrderOfCurrentBrand(++pageNumber, responseConfig));
  });
}

function getOrderDataToCancel(orderError) {
  const orderDataExist = orderError.ord_no && orderError.upd_date && orderError.hash_key;
  const responseConfig = { cancelOrder: true, retryOrder: !donotRetryCodes.includes(orderError.resultCode) };

  return (dispatch) => {
    // PART 1/3: if error code is 2300, it means that user is editing a cart which was already used to place as order.
    // this is usually bad except in cases where pay at store option was made.
    if (orderErrorCodes.includes(orderError.resultCode) && !orderDataExist) {
      return dispatch(getOrderOfCurrentBrand(1, responseConfig));

    // PART 2/3: if error response has ord_no, upd_date and hash_key, it means that data for canceling a order is exist,
    // so need to cancel athe order retry again.
    } else if (orderDataExist) {
      return Promise.resolve({ order_history_inf_list: [{ ...orderError, ...responseConfig }] });
    }

    return Promise.reject();
  };
}

/**
 * Loads the current order number on state.
 * The order number get's loaded to state from the cookies on first renderer.
 */
export function getOrderDetailsById(orderNo, hashKey) {
  return (dispatch, getState) => dispatch({
    types: [CONFIRM_ORDER_BY_ID, CONFIRM_ORDER_SUCCESS_BY_ID, CONFIRM_ORDER_FAIL_BY_ID],
    promise: (client, brand) => client.get(orderApi.order, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params: {
        client_id: cartApi.clientId,
        ord_no: orderNo,
        hash_key: hashKey,
        native_app: orderApi.nativeApp,
      },
    }),
    errorHandler: { ...errorHandler, customErrorKey: 'getOrderDetails' },
  }).then(() => {
    const { order: { orders } } = getState();
    const orderDetails = orders[orderNo] && orders[orderNo].orderDetails;

    if (orderDetails.payment_type === payment.uniqloStore) {
      const storeCode = orderDetails.pay_In_Store_Barcode_info && orderDetails.pay_In_Store_Barcode_info.check_in_store_cd;

      return dispatch(getPaymentStoreDetails(storeCode));
    }

    return true;
  });
}

/**
 * Reads the affiliate cookies and loads them to react state.
 * @return {Promise<*>}
 */
export function loadAffiliateCookies() {
  return (dispatch) => {
    const { affiliateCookies } = cookies;

    const readAffiliateIdAndTime = (affiliateName) => {
      dispatch({
        type: READ_AFFILIATE_SITE_ID,
        cookie: {
          key: affiliateCookies[affiliateName].siteId,
        },
        affiliate: affiliateName,
      });
      dispatch({
        type: READ_AFFILIATE_TIME_ENTERED,
        cookie: {
          key: affiliateCookies[affiliateName].timeEntered,
        },
        affiliate: affiliateName,
      });
    };

    // Read LinkShare cookies
    readAffiliateIdAndTime('ls');
    // read new CA affiliate cookies
    readAffiliateIdAndTime('ca');

    return Promise.resolve();
  };
}

export function deleteOrder(orderData) {
  return (dispatch) => {
    const { ord_no, upd_date, hash_key } = orderData;

    return dispatch({
      types: [RETRY_ORDER_CANCEL, RETRY_ORDER_CANCEL_SUCCESS, RETRY_ORDER_CANCEL_FAIL],
      promise: (client, brand) => client.get(orderApi.order, {
        ...promiseConfig,
        host: `${orderApi.hostForRemove}/${brand}/${orderApi.region}`,
        params: {
          client_id: orderApi.clientId,
          ord_no,
          upd_date,
          hash_key,
        },
      }),
    });
  };
}

export function cancelOrderAndRetry(orderError, receipt = '') {
  return (dispatch, getState) => {
    const globalState = getState();
    const orderParams = getCommonOrderParams(globalState);

    if (orderError && orderError.resultCode) {
      return dispatch(getOrderDataToCancel(orderError))
      .then(({ order_history_inf_list: orderHistoryResults }) => {
        const orderData = Array.isArray(orderHistoryResults) && orderHistoryResults[0];
        const status = orderData.ord_sts === orderStatus && retryCodes.includes(orderError.resultCode);

        // PART 3/3: the previous order list call and this condition will confirm if previous order was pay at store
        // or error response with data for canceling an order.
        // since this is expected behaviour, we silently cancel the outstanding order and retry the original place order call.
        if (orderData && (status || orderData.cancelOrder)) {
          return dispatch(deleteOrder(orderData))
          .then(() => {
            if (orderData.retryOrder || (status && orderData.retryOrder)) {
              return dispatch({
                types: [SAVE_ORDER, SAVE_ORDER_SUCCESS, SAVE_ORDER_FAIL],
                promise: (client, brand = brandName.uq) => client.post(orderApi.placeOrder, {
                  ...promiseConfig,
                  host: replaceUrlParams(promiseConfig.host, { brand }),
                  params: {
                    receipt_flg: receipt,
                    ...orderParams,
                  },
                }),
                errorHandler: { ...errorHandler, customErrorKey: 'placeOrder' },
              });
            }

            return Promise.resolve();
          });
        }

        return Promise.resolve();
      });
    }

    return Promise.reject(orderError);
  };
}

export function isConciergeCheckout(globalState) {
  const {
    payment: paymentState, delivery, userInfo, paymentStore,
  } = globalState;

  if (paymentState && delivery && userInfo && paymentStore) {
    const {
      payment: { paymentMethod: paymentType },
      delivery: { deliveryMethod },
      userInfo: { userDefaultDetails },
      paymentStore: { appliedStore },
    } = globalState;
    const brand = getCurrentBrand(globalState);
    const cart = cartActions.getCart(globalState, brand);
    const conciergeStoreId = ~~reactCookie.load(cookies.conciergeStoreId);
    const paymentStoreId = isObject(appliedStore)
      ? brand === brandName.uq && appliedStore.id || appliedStore.imsStoreId4
      : '';

   /*
    * If all of the below condition qualifies, then
    * it means that this was a Fast-Forwarded ⏩ checkout process.
    * In fact, the user/customer is a store-staff (aka concierge).
    */

    return !!(
      // has "concierge_store" cookie?
      conciergeStoreId &&
      // is user email hosted "@uniqlo.store"?
      isStoreStaffEmail(userDefaultDetails.email) &&
      // is deliveryType === "11"?
      deliveryMethod.length && deliveryMethod[0].deliveryType === deliveryTypes.STORE_PICKUP &&
      // is paymentType === "B"?
      paymentType === payment.uniqloStore &&
      // is store-id in cookie same as delivery-store-id?
      conciergeStoreId === ~~cart.shippingAddress.cellPhoneNumber &&
      // is store-id in cookie same as payment-store-id?
      conciergeStoreId === ~~paymentStoreId
    );
  }

  return false;
}

export function processOrder(receipt) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cartBrand = getCurrentBrand(globalState);
    const extraConfig = getExtraConfig(globalState);
    const { payment: { paymentMethod: paymentType } } = globalState;

    const placeOrder = () => {
      const orderParams = getCommonOrderParams(getState());

      return dispatch({
        types: [SAVE_ORDER, SAVE_ORDER_SUCCESS, SAVE_ORDER_FAIL],
        promise: (client, brand = brandName.uq) => client.post(orderApi.placeOrder, {
          ...promiseConfig,
          host: replaceUrlParams(promiseConfig.host, { brand }),
          params: {
            receipt_flg: receipt,
            ...orderParams,
          },
        }),
        errorHandler: { ...errorHandler, customErrorKey: 'placeOrder' },
      }).catch(error => dispatch(cancelOrderAndRetry(error, receipt)));
    };

    return dispatch(loadAffiliateCookies())
      .then(() => dispatch(placeOrder))
      .then(result => dispatch(saveOrderNumber(result)))
      .then(() => {
        dispatch(removeCheckoutStatus(cartBrand));
        dispatch(resetNextDayDeliveryDontCareFlag(cartBrand));
        // Remove receipt_flg cookie
        dispatch(cartActions.resetReceiptStatus(cartBrand));

        // save orderPlacedFlag flag for deciding whether or not to send order cofirmation tracking GA call
        ClientStorage.set(localStorageKeys.orderPlacedFlag, 'y');

        if (paymentType === payment.creditCard && extraConfig.credit_payment_type !== creditCard.registeredCard) {
          const { order, creditCard: card } = getState();

          dispatch(sendToBlueGate(card, order.blueGateReqInfo));

          return false;
        }

        const { ord_no: orderNo, hash_key: hashKey } = getState().order.orderList[0];
        const conciergeStoreId = ~~reactCookie.load(cookies.conciergeStoreId);

        if (isConciergeCheckout(globalState)) {
          /**
           * In case of conceirge-fast-checkout we will not take user to order-confirm page,
           * instead user will be directly taken to customerNotesURL.
           * @see {@link https://www.pivotaltracker.com/story/show/153693392}
           **/

          dispatch(getOrderDetailsById(orderNo, hashKey))
          .then(() => {
            const { barcodeInfo: { barcodeNumber } } = getState().order.orders[orderNo];
            const customerNotesUrl = getUrlWithQueryData(
              CUSTOMER_NOTES_BASE_URL,
              { orderNo, barCd: barcodeNumber, storeNo: conciergeStoreId },
            );

            redirect(customerNotesUrl);
          });

          // The caller of `processOrder` method is an event-handler in ReviewOrder page component.
          // It expects the promise to return a boolean in order to decide about the redirection.
          // Returning a `false` here avoids redirection to order-confirm page.
          return false;
        }

        return true;
      });
  };
}

export function removeOrder() {
  return (dispatch, getState) => {
    const { order } = getState();

    return dispatch({
      types: [REMOVE_ORDER, REMOVE_ORDER_SUCCESS, REMOVE_ORDER_FAIL],
      promise: (client, brand) => client.post(orderApi.order, {
        ...deletePromiseConfig,
        host: replaceUrlParams(deletePromiseConfig.host, { brand }),
        params: {
          client_id: cartApi.clientId,
          ord_no: order.orderNo,
          hash_key: order.hashKey,
          upd_date: order.orderDetails.upd_date,
          native_app: orderApi.nativeApp,
        },
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'deleteOrder' },
    });
  };
}

export function fetchOrderSummary() {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = cartActions.getCart(globalState, getCurrentBrand(globalState));
    const selectedBrand = getCurrentBrand(globalState);

    return dispatch({
      types: [FETCH_ORDER_SUMMARY, FETCH_ORDER_SUMMARY_SUCCESS, FETCH_ORDER_SUMMARY_FAIL],
      brand: selectedBrand,
      promise: (client, brand) => client.get(cartApi.addToCart, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        params: {
          client_id: cartApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'loadCart' },
    });
  };
}

export function setOrderNumber() {
  // Sets the order no: and hashKey from cookie
  // to the order state on first render.
  return {
    type: SET_ORDER_NUMBER,
    cookie: {
      key: cookies.orderCookie,
    },
  };
}

export function removeOrderCookie() {
  return {
    type: REMOVE_ORDER_NUMBER,
    cookie: {
      key: cookies.orderCookie,
      domain: cookies.domain,
      remove: true,
    },
  };
}

export function changeOrderProcessTo(value) {
  return {
    type: CHANGE_ORDER_PROCESS,
    value,
  };
}

// TO Avoid fetching the order details via fetch request
// cart api already has this info in review order page.
// required to set it
export function setOrderSummary(summary) {
  return {
    type: SET_ORDER_SUMMARY,
    orderSummary: summary,
  };
}

export function getOrderDetailList({ ord_no: orderNo, hash_key }) {
  return {
    types: [GET_ORDER_DETAILS_LIST, GET_ORDER_DETAILS_LIST_SUCCESS, GET_ORDER_DETAILS_LIST_FAIL],
    promise: (client, brand) => client.get(orderApi.order, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params: {
        client_id: cartApi.clientId,
        ord_no: orderNo,
        hash_key,
        native_app: orderApi.nativeApp,
      },
    }),
    errorHandler: { ...errorHandler, customErrorKey: 'orderDetailsDisplay' },
    orderNo,
  };
}

// Clear the order details loaded for order history
export function clearOrderDetails() {
  return {
    type: CLEAR_ORDER_DETAILS,
  };
}

/**
 * @private
 * This function load the giftbags and gift messages cards if required by this order.
 * Is only used to initialize the order confirm page.
 */
function loadGiftBagsAndMessageCardsIfNeeded() {
  return (dispatch, getState) => {
    if (!isGiftBagsLoaded(getState())) {
      return dispatch(fetchGiftBags())
        .then(() => dispatch(fetchMessageCards()));
    }

    return Promise.resolve();
  };
}

/**
 *  Initializes the Order confirm page.
 */
export function initializeOrderConfirmPage({ store: { dispatch, getState } }) {
  const { payment: { uniqloStore } } = getSiteConfig();
  const state = getState();

  dispatch(loadRecentlyViewedProductIds());

  // If there is no order number in the store ie. from cookie, should redirect to cart page
  const brand = getCurrentBrand(state);
  const checkoutBrand = cartActions.getCheckoutBrand(state);
  const otherBrand = brand === brandName.gu ? brandName.uq : brandName.gu;
  const { routing: { locationBeforeTransitions: { query } }, order: { orderList } } = state;

  if (checkoutBrand && checkoutBrand !== brand) {
    return dispatch({
      type: REDIRECT_TO_CONFIRM_ORDER,
      redirect: {
        location: getUrlWithQueryData(routes.confirmOrder, { ...query, brand: checkoutBrand }),
      },
    });
  }

  if (orderList && orderList.length) {
    const promises = [];

    if (cartActions.isCreated(state, otherBrand) && !cartActions.isLoaded(state, otherBrand)) {
      promises.push(dispatch(cartActions.load(otherBrand)));
    }

    // Guest users of apple pay dont have currently placed orders attached to them.
    // We do not ask for login in confirm page for them.
    // Since order_id/GET is login restricted avoid calling the API.
    if (!checkIfApplePayGuestUserInConfirmPage(routes.confirmOrder)) {
      if (!isUserDefaultDetailsLoaded(state)) {
        promises.push(dispatch(loadDefaultDetails()));
      }

      if (!isGiftBagsLoaded(state)) {
        promises.push(dispatch(fetchGiftBags()));
      }

      state.order.orderList.forEach((order) => {
        promises.push(dispatch(getOrderDetailsById(order.ord_no, order.hash_key)).then(() => {
          const { orderDetails: curOrderDetails } = getState().order.orders[order.ord_no];

          // cart cookies should NOT be cleared if the order was done using pay at store option.
          if (curOrderDetails.payment_type !== uniqloStore) {
            dispatch(cartActions.resetCart(brand));
            dispatch(cartActions.removeCheckout());
          } else {
            dispatch(cartActions.removeCartCountCookies(brand));
            dispatch(loadDeliveryMethodOptions());
          }
        }));
      });

      promises.push(dispatch(loadGiftBagsAndMessageCardsIfNeeded()));
    } else {
      // For apple pay guest users
      dispatch(cartActions.resetCart(brand));
      dispatch(cartActions.removeCheckout());
      dispatch(removeOrderCookie());
    }

    dispatch(resetCard());

    return ignoreResponseFailures(promises);
  }

  if (checkIfApplePayGuestUserInConfirmPage(routes.confirmOrder)) {
    LocalStorage.removeItem(localStorageKeys.applePayFlag);
  }

  return dispatch({
    type: REDIRECT_TO_CART,
    redirect: {
      location: getUrlWithQueryData(routes.cart, { brand }),
    },
  });
}

/**
*@function to remove order cookie and go to order history page.
*/
export function removeOrderAndContinue() {
  return (dispatch, getState) => {
    const state = getState();
    const brand = getCurrentBrand(state);
    const { UQ_LINK_TO_TOP_PAGE, GU_LINK_TO_TOP_PAGE } = getSiteConfig();

    // removes order numbver and hash_key from cookie
    dispatch(removeOrderCookie());

    // redirects to UQ home or GU home or UQ order history
    let redirectTo = UQ_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(true));

    if (brand === brandName.gu) {
      redirectTo = GU_LINK_TO_TOP_PAGE.replace('{%hostname}', getCurrentHost(true));
    }

    return dispatch({
      type: REDIRECT_FROM_ORDER_HISTORY,
      redirect: {
        location: redirectTo,
      },
    });
  };
}

export function setCurrentReviewPayment(currentReviewPayment) {
  return {
    type: SET_CURRENT_REVIEW_PAYMENT,
    payload: currentReviewPayment,
  };
}

export function getOrderAndCancel() {
  return (dispatch, getState) => {
    const { order: { orderNo, hashKey } } = getState();

    if (orderNo && hashKey) {
      return dispatch(getOrderDetailList({ ord_no: orderNo, hash_key: hashKey }))
      .then((res) => {
        const orderBrand = res.ord_brand_kbn === '10' ? brandName.uq : brandName.gu;

        return dispatch(cancelOrder({ updatedDate: res.upd_date, orderNumber: orderNo, hashKey, orderBrand }));
      });
    }

    return Promise.resolve();
  };
}

/**
 * Checks if there's a difference in the price. We need to calculate the difference
 * in order to show a warning message at review page.
 * This is only clientside validation. If the user refresh the page we won't
 * know if there's a difference on the total.
 */
export function setDifference() {
  return (dispatch, getState) => {
    const { order: { difference, orderSummary } } = getState();

    // If this is the first time we are culculating the difference
    if (difference.currentTotal === null) {
      dispatch({
        type: SET_DIFFERENCE,
        difference: {
          currentTotal: orderSummary.total,
          delta: 0,
        },
      });

      return Promise.resolve();
    }

    // If we have a previous total, let's calculate if there's any difference
    dispatch({
      type: SET_DIFFERENCE,
      difference: {
        currentTotal: orderSummary.total,
        delta: orderSummary.total - difference.currentTotal,
      },
    });

    return Promise.resolve();
  };
}

export function showRegistrationSuccessScreen() {
  return {
    type: SHOW_REGISTRATION_SUCCESS_SCREEN,
  };
}

export function toggleRegistrationModal(value) {
  return {
    type: TOGGLE_REGISTRATION_MODAL,
    value,
  };
}

export function closeUserRegistrationPopup() {
  return (dispatch) => {
    dispatch(updateLoader());

    return dispatch(toggleRegistrationModal(false));
  };
}
