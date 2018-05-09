import { mapGift } from 'redux/modules/checkout/mappings/giftingMappings';
import { mapDeliveryMethod } from 'redux/modules/checkout/mappings/deliveryMappings';
import
  getOrderSummary,
  { getOrderMapping, getShippingAddress, getAllOrderItems, getBarcodeInfo, mapOrderDetailsForGuestUserApplePay }
from 'redux/modules/checkout/mappings/orderSummaryMappings';
import { LOAD_CART_SUCCESS } from 'redux/modules/cart/cart';
import { APPLE_PAY_ORDER_SUCCESS } from 'redux/modules/applePay';
import atob from 'atob';
import { getDateFromShortTimestampFormat } from 'utils/formatDate';
import { getBlueGateMapping } from 'redux/modules/checkout/payment/creditCard/creditInfoMappings';

import {
  SAVE_ORDER_SUCCESS,
  SAVE_ORDER_FAIL,
  CONFIRM_ORDER_SUCCESS,
  FETCH_ORDER_SUMMARY_SUCCESS,
  CHANGE_ORDER_PROCESS,
  FETCH_DELIVERY_DETAILS_SUCCESS,
  SET_ORDER_SUMMARY,
  SET_ORDER_NUMBER,
  REMOVE_ORDER_NUMBER,
  GET_ORDER_DETAILS_LIST_SUCCESS,
  GET_ORDER_DETAILS_LIST_FAIL,
  REMOVE_ORDER_SUCCESS,
  SET_DIFFERENCE,
  SET_CURRENT_REVIEW_PAYMENT,
  SET_ORDER_KEY,
  CLEAR_ORDER_DETAILS,
  READ_AFFILIATE_SITE_ID,
  READ_AFFILIATE_TIME_ENTERED,
  CONFIRM_ORDER_SUCCESS_BY_ID,
  SHOW_REGISTRATION_SUCCESS_SCREEN,
  TOGGLE_REGISTRATION_MODAL,
} from './actions';

const initialState = {
  orders: {},
  orderProcessed: false,
  deliveryArrivesAt: {},
  orderDetailList: {},
  orderSummary: {},
  details: {},
  /**
   * Calculate the difference in total price at review order page,
   * in order to show a warning message if the payment needs to be updated.
   */
  difference: {
    currentTotal: null,
    delta: null,
  },
  lsSiteId: null,
  lsTimeEntered: null,
  caSiteId: null,
  caTimeEntered: null,
  isRegistrationSuccess: false,
  hideRegistrationError: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SAVE_ORDER_SUCCESS:
      const result = action.result;
      const { creditRegInfo, orderList = [] } = result;

      return {
        ...state,
        orderList: result.orderList,
        blueGateReqInfo: creditRegInfo
          ? getBlueGateMapping(creditRegInfo)
          : orderList[0].bgRequestInfoResponse,
        orderProcessed: true,
        orders: {},
      };
    case SAVE_ORDER_FAIL:
      return {
        ...state,
        orderProcessed: false,
      };
    case CONFIRM_ORDER_SUCCESS_BY_ID:
      let orderResult = action.result;

      return {
        ...state,
        orders: {
          ...state.orders,
          [orderResult.ord_no]: {
            ...getOrderMapping(orderResult),
            orderNo: orderResult.ord_no,
            hashKey: orderResult.hash_key,
            orderDetails: orderResult,
            orderSummary: getOrderSummary(orderResult),
            orderShippingAddress: getShippingAddress(orderResult.order_delv),
            orderConfirmDetails: orderResult.order_delv,
            items: getAllOrderItems(orderResult.order_detail_list),
            cartGift: mapGift(orderResult),
            barcodeInfo: getBarcodeInfo(orderResult),
            deliveryMethod: {
              deliveryType: action.result.order_delv.delv_type,
              deliveryReqDate: action.result.order_delv.delv_req_dt,
              deliveryReqTime: action.result.order_delv.delv_req_time,
            },
          },
        },
      };
    case CONFIRM_ORDER_SUCCESS:
      orderResult = action.result;

      return {
        ...state,
        ...getOrderMapping(orderResult),
        orderDetails: orderResult,
        orderSummary: getOrderSummary(orderResult),
        orderShippingAddress: getShippingAddress(orderResult.order_delv),
        orderConfirmDetails: orderResult.order_delv,
        items: getAllOrderItems(orderResult.order_detail_list),
        cartGift: mapGift(orderResult),
        barcodeInfo: getBarcodeInfo(orderResult),
        deliveryMethod: mapDeliveryMethod(action.result.order_delv),
      };
    // FETCH_ORDER_SUMMARY_SUCCESS and LOAD_CART_SUCCESS are essentially doing the same API calls.
    // combining the actions here keeps the cart redux more up to date without an extra API call overheads.
    case LOAD_CART_SUCCESS:
      if (!action.isCurrentBrand) {
        // If the last loaded cart's brand differ from checkout brand or
        // brand in URL search query, we return newly calculated state.cart[brand]
        // and will NOT update the common properties under state.cart.
        return state;
      }
    // If loaded cart's brand is same as brand in URL search query (or checkout brand) we can update
    // state.order with order data from GET cart. So let's fall-through FETCH_ORDER_SUMMARY_SUCCESS
    case FETCH_ORDER_SUMMARY_SUCCESS: // eslint-disable-line no-fallthrough
      return {
        ...state,
        ...getOrderMapping(action.result),
        orderSummary: getOrderSummary(action.result),
      };

    case CHANGE_ORDER_PROCESS:
      return {
        ...state,
        orderProcessed: action.value,
      };
    case FETCH_DELIVERY_DETAILS_SUCCESS:
      return {
        ...state,
        deliveryArrivesAt: {
          ...state.deliveryArrivesAt,
          shippingPrice: action.result.shippingPrice,
          timeFrame: action.result.timeframe,
          selectedDate: action.result.selectedDate,
        },
      };
    case SET_ORDER_SUMMARY:
      return {
        ...state,
        orderSummary: action.orderSummary,
      };
    case SET_ORDER_NUMBER:
      if (action.cookie.value) {
        const data = JSON.parse(atob(action.cookie.value));

        return {
          ...state,
          orderList: data,
        };
      }

      return {
        ...state,
        orderList: [],
      };
    case REMOVE_ORDER_NUMBER:
      return {
        ...state,
        orderList: [],
      };
    case REMOVE_ORDER_SUCCESS:
      return {
        ...state,
        orderList: [],
        orderProcessed: false,
      };

    case SET_CURRENT_REVIEW_PAYMENT:
      return {
        ...state,
        currentReviewPayment: action.payload,
      };

    case GET_ORDER_DETAILS_LIST_SUCCESS:
      return {
        ...state,
        details: action.result,
        isOrderDetailsLoaded: true,
      };
    case CLEAR_ORDER_DETAILS:
      return {
        ...state,
        details: {},
        isOrderDetailsLoaded: false,
      };
    case SET_ORDER_KEY:
      return {
        ...state,
        orderKey: action.cookie.value,
      };
    case SET_DIFFERENCE:
      return {
        ...state,
        difference: action.difference,
      };
    case READ_AFFILIATE_SITE_ID:
      const siteId = action.cookie && action.cookie.value;
      const affSiteId = `${action.affiliate}SiteId`;

      return {
        ...state,
        [affSiteId]: (!siteId || siteId.length > 64) ? initialState[affSiteId] : siteId,
      };
    case READ_AFFILIATE_TIME_ENTERED:
      const timeEntered = action.cookie && action.cookie.value;
      const affTime = `${action.affiliate}TimeEntered`;

      const canParse = !!getDateFromShortTimestampFormat(timeEntered);

      return {
        ...state,
        [affTime]: canParse ? timeEntered : initialState[affTime],
      };
    case SHOW_REGISTRATION_SUCCESS_SCREEN:
      return {
        ...state,
        isRegistrationSuccess: true,
      };
    case TOGGLE_REGISTRATION_MODAL:
      return {
        ...state,
        isRegistrationModalActive: action.value,
      };
    case APPLE_PAY_ORDER_SUCCESS:
      const orders = mapOrderDetailsForGuestUserApplePay(action);

      return {
        ...state,
        orders,
        orderList: action.result.orderList,
      };
    case GET_ORDER_DETAILS_LIST_FAIL:
    default:
      return state;
  }
}
