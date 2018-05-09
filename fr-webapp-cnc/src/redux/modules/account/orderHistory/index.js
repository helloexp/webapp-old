import { orderApi, apiTypes } from 'config/api';
import { getOrderDetailList, clearOrderDetails } from 'redux/modules/checkout/order';
import { getProductGenderList } from 'redux/modules/productGender';
import { getStoreDetails } from 'redux/modules/checkout/delivery/store/actions';
import { fetchGiftBags, fetchMessageCards } from 'redux/modules/checkout/gifting/actions';
import { isGiftBagsLoaded, isMessageCardsLoaded } from 'redux/modules/checkout/gifting/selectors';
import { getPaymentStoreDetails } from 'redux/modules/checkout/payment/store';
import { loadDeliveryMethodOptions, isDeliveryMethodOptionsLoaded } from 'redux/modules/checkout/delivery';
import { redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import constants from 'config/site/default';
import noop from 'utils/noop';
import { getProductIdList } from 'redux/modules/mappings/cartMappings';
import { mapOrderHistory } from '../mappings/orderHistoryMappings';

export const ORDER_HISTORY_LOAD = 'accounts/ORDER_HISTORY_LOAD';
export const ORDER_HISTORY_LOAD_SUCCESS = 'accounts/ORDER_HISTORY_LOAD_S';
export const ORDER_HISTORY_LOAD_FAIL = 'accounts/ORDER_HISTORY_LOAD_F';
export const CANCEL_ORDER = 'accounts/CANCEL_ORDER';
export const CANCEL_ORDER_SUCCESS = 'accounts/CANCEL_ORDER_S';
export const CANCEL_ORDER_FAIL = 'accounts/CANCEL_ORDER_F';
const CLEAR_ORDER_HISTORY = 'accounts/CLEAR_ORDER_HISTORY';

const INCREMENT_PAGE_NUMBER = 'accounts/INCREMENT_PAGE_NUMBER';
const RESET_PAGE_NUMBER = 'accounts/RESET_PAGE_NUMBER';

const { deliveryTypes: { STORE_PICKUP }, payment: { uniqloStore }, brandName, order: { orderStatus: orderRecievedStatus }, brand: brandCode } = constants;
const errorHandler = { showMessage: true, enableReaction: true };

const initialState = {
  orderHistoryList: [],
  loaded: false,
  orderDetail: {},
  confirmedOrderNumber: '',
  pageNumber: 0,
};

const promiseConfig = {
  host: `${orderApi.base}/${orderApi.brand}/${orderApi.region}`,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ORDER_HISTORY_LOAD_SUCCESS:
      const orderHistory = action.result;
      const updatedList = [
        ...(state.loaded ? state.orderHistoryList : []),
        ...orderHistory.order_history_inf_list.map(order => mapOrderHistory(order)),
      ];

      return {
        ...state,
        orderHistoryList: updatedList,
        orderCount: orderHistory.record_count,
        loaded: true,
      };
    case CLEAR_ORDER_HISTORY:
      return {
        ...state,
        orderHistoryList: [],
        orderCount: 0,
        loaded: false,
      };
    case ORDER_HISTORY_LOAD_FAIL:
      return {
        ...state,
      };
    case CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        loaded: false,
      };
    case INCREMENT_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: ++state.pageNumber,
      };
    case RESET_PAGE_NUMBER:
      return {
        ...state,
        pageNumber: 0,
      };
    case CANCEL_ORDER_FAIL:
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.orderHistory && globalState.orderHistory.loaded;
}

export function clearOrderHistory() {
  return {
    type: CLEAR_ORDER_HISTORY,
  };
}

export function loadOrderHistory(pageNumber = 1, count = 5) {
  return {
    types: [ORDER_HISTORY_LOAD, ORDER_HISTORY_LOAD_SUCCESS, ORDER_HISTORY_LOAD_FAIL],
    promise: client => client.get(orderApi.placeOrder, {
      ...promiseConfig,
      params: {
        client_id: orderApi.clientId,
        page_no: pageNumber,
        disp_count: count,
      },
    }),
    errorHandler: { enableReaction: true },
  };
}

export function cancelOrder(order) {
  return {
    types: [CANCEL_ORDER, CANCEL_ORDER_SUCCESS, CANCEL_ORDER_FAIL],
    promise: client => client.get(orderApi.order, {
      ...promiseConfig,
      host: `${orderApi.hostForRemove}/${order.orderBrand}/${orderApi.region}`,
      params: {
        client_id: orderApi.clientId,
        ord_no: order.orderNumber,
        upd_date: order.updatedDate || order.upd_date,
        hash_key: order.hashKey,
      },
    }),
    errorHandler: { ...errorHandler, apiType: apiTypes.GDS, customErrorKey: 'getOrderDetails' },
  };
}

/**
 * @public Function to cancel an order and clear the order details loaded in state
 */
export function cancelOrderAndClearDetails(order) {
  return dispatch => dispatch(cancelOrder(order))
    .then(() => dispatch(clearOrderDetails()));
}

/**
 * @private Action creater to set page number to store
 */
function incrementPageNumber() {
  return {
    type: INCREMENT_PAGE_NUMBER,
  };
}

/**
 * @private Action creater to reset page number in store
 */
function resetPageNumber() {
  return {
    type: RESET_PAGE_NUMBER,
  };
}

/**
 * @private A function to get hashKey from state
 */
function getHashKey(id, state) {
  const orderItem = state.orderHistory.orderHistoryList.find(item => item.orderNumber === id);

  return orderItem && orderItem.hashKey || '';
}

let getMoreDetails = noop;
// maximum count for a single order history list API call
const maximumOrderCount = 50;

/**
 * @private An action to get order details from API if not exist in store
 */
function getOrderDetails(id) {
  return (dispatch, getState) => {
    dispatch(incrementPageNumber());
    const state = getState();

    const historyPromise = getHashKey(id, state)
      ? Promise.resolve()
      : dispatch(loadOrderHistory(state.orderHistory.pageNumber, maximumOrderCount));

    return historyPromise.then(() => {
      const hash = getHashKey(id, getState());

      return hash
        ? dispatch(getOrderDetailList({ ord_no: id, hash_key: hash }))
        : dispatch(getMoreDetails(id));
    });
  };
}

getMoreDetails = function getMoreList(id) {
  return (dispatch, getState) => {
    const { orderCount, pageNumber } = getState().orderHistory;

    return (orderCount - (maximumOrderCount * pageNumber)) > 1
      ? dispatch(getOrderDetails(id))
      : Promise.reject();
  };
};

export function loadDeliveryMethodsIfNeeded(orderList) {
  return (dispatch, getState) => {
    const state = getState();
    let orderBrand;
    const shouldLoadDeliverySelectable = !!(orderList.find((order) => {
      const { ord_sts: orderStatus, ord_brand_kbn: brand } = order;

      orderBrand = brand === brandCode.uq ? brandName.uq : brandName.gu;
      const cart = state.cart[orderBrand];
      const isCart = !!(cart && cart.cartNumber && cart.token);

      return (orderStatus === orderRecievedStatus && isCart);
    }));

    if (!isDeliveryMethodOptionsLoaded(state) && shouldLoadDeliverySelectable) {
      return dispatch(loadDeliveryMethodOptions(orderBrand));
    }

    return Promise.resolve();
  };
}

export function loadOrderHistoryAndDeliveryMethods(pageNumber) {
  return dispatch => dispatch(loadOrderHistory(pageNumber))
    .then(result => dispatch(loadDeliveryMethodsIfNeeded(result.order_history_inf_list)));
}

/**
 * An action to initialize order history page
 */
export function initializeOrderHistoryPage({ store: { dispatch } }) {
  dispatch(clearOrderHistory());

  return dispatch(loadOrderHistoryAndDeliveryMethods(1));
}

/**
 * An action to initialize order details page
 */
export function initializeOrderDetailsPage({ store: { dispatch, getState }, params: { id } }) {
  dispatch(resetPageNumber());
  const { isOrderDetailsLoaded, details: orderDetails } = getState().order;

  return (!isOrderDetailsLoaded || orderDetails.ord_no !== id)
    ? dispatch(getOrderDetails(id))
        .then(() => {
          const state = getState();
          const details = state.order.details;
          const promises = [];
          const orderBrand = details.ord_brand_kbn === brandCode.uq ? brandName.uq : brandName.gu;
          const cart = state.cart[orderBrand];
          const isCart = !!(cart && cart.cartNumber && cart.token);

          if (details && details.order_detail_list) {
            const recieveStoreCode = details.store_recv_inf && details.store_recv_inf.recev_store_cd;
            const payAtStoreCode = details.pay_In_Store_Barcode_info && details.pay_In_Store_Barcode_info.check_in_store_cd;

            if (details.payment_type === uniqloStore && payAtStoreCode) {
              promises.push(dispatch(getPaymentStoreDetails(payAtStoreCode, orderBrand)));
            }

            if (details.order_delv.delv_type === STORE_PICKUP && recieveStoreCode) {
              promises.push(dispatch(getStoreDetails(recieveStoreCode)));
            }

            promises.push(dispatch(getProductGenderList(getProductIdList(details.order_detail_list), orderBrand)));
          }

          if (!isDeliveryMethodOptionsLoaded(state) && details.ord_sts === orderRecievedStatus && isCart) {
            promises.push(dispatch(loadDeliveryMethodOptions(orderBrand)));
          }

          if (!isGiftBagsLoaded(state) && details.gift_flg === '1') {
            promises.push(dispatch(fetchGiftBags(orderBrand)));
          }

          if (!isMessageCardsLoaded(state) && details.message_card_id) {
            promises.push(dispatch(fetchMessageCards(orderBrand)));
          }

          return Promise.all(promises);
        })
        .catch(() => redirect(routes.orderHistory))
    : Promise.resolve();
}

/**
 * @private A function to get orderDetails for canceling the order, from state
 */
export function getOrderDetailForCancel({ order: { orderKey, details }, orderHistory: { orderHistoryList } }, id) {
  return orderHistoryList.filter(order => order.orderNumber === id)[0] || (details.ord_no === id && details) || {};
}

/**
 * An action to initialize cancel order page
 */
export function initializeCancelPage({ store: { dispatch, getState }, params: { id } }) {
  dispatch(resetPageNumber());
  const promise = Object.keys(getOrderDetailForCancel(getState(), id)).length
    ? Promise.resolve()
    : dispatch(getOrderDetails(id))
    .then(() => {
      const state = getState();
      const { ord_brand_kbn: brand, ord_sts: orderStatus } = state.order.details;
      const orderBrand = brand === brandCode.uq ? brandName.uq : brandName.gu;
      const cart = state.cart[orderBrand];
      const isCart = !!(cart && cart.cartNumber && cart.token);

      if (!isDeliveryMethodOptionsLoaded(state) && orderStatus === orderRecievedStatus && isCart) {
        return (dispatch(loadDeliveryMethodOptions(orderBrand)));
      }

      return Promise.resolve;
    });

  return promise.catch(() => redirect(routes.orderHistory));
}

export function getOrderItemDetails(state, id) {
  const itemDetails = getOrderDetailForCancel(state, id);

  if (Object.keys(itemDetails).length) {
    return {
      ...itemDetails,
      ...(!itemDetails.orderNumber && mapOrderHistory(itemDetails) || {}),
      hashKey: getHashKey(id, state),
    };
  }

  return {};
}
