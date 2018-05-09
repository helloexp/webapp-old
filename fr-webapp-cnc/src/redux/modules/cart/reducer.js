/**
 * This file manage only the reducers, no actions are in here, only the cart reducer
 * to handle the cart state.
 */
import { getAllCartItems } from 'redux/modules/mappings/cartMappings';
import getOrderSummary from 'redux/modules/checkout/mappings/orderSummaryMappings';
import { mapDeliveryAddress, mapDeliveryMethod, mapBillingToLocalAddress } from 'redux/modules/checkout/mappings/deliveryMappings';
import { mapGift } from 'redux/modules/checkout/mappings/giftingMappings';
import { getByCriteria } from 'utils';
import { MULTIBUY_FLAG } from 'config/site/default';
import { FETCH_ORDER_SUMMARY_SUCCESS } from 'redux/modules/checkout/order/actions';
import { SET_DELIVERY_METHOD_SUCCESS, SET_SELECTED_DELIVERY_TYPE } from 'redux/modules/checkout/delivery/actions';
import { LOAD_BILLING_ADDRESS_SUCCESS } from 'redux/modules/checkout/payment/actions';

import {
  countItems,
  ADD_ITEM_SUCCESS,
  ADD_ITEM_FAIL,
  GENERATE_CART_SUCCESS,
  GENERATE_CART_FAIL,
  REMOVE_ITEM_SUCCESS,
} from './products';

import {
  CLEAR_CART_GIFTING,
  ITEM_COUNT_SUCCESS,
  LOAD_CART,
  LOAD_CART_SUCCESS,
  LOAD_CART_FAIL,
  LOAD_CATALOG_DATA_SUCCESS,
  LOAD_CATALOG_DATA_FAIL,
  REMOVE_CART_TOKEN,
  RESET_CART,
  SET_CART_NUMBER,
  SET_CART_TOKEN,
  SHOW_CART_MODAL,
  UPDATE_ITEMS_INVENTORY_STATUS,
  RESET_L2CODE_INVENTORY_STATUS,
  REFRESH_CART,
  REFRESH_CART_SUCCESS,
  REFRESH_CART_FAIL,
  SET_RECEIPT_FLAG,
  GET_RECEIPT_FLAG,
  RESET_RECEIPT_FLAG,
  RESET_SHIPPINGFEE_WORKAROUND,
  SET_CALL_PIB_FLAG,
} from './cart';

import {
  SAVE_CHECKOUT,
  REMOVE_CHECKOUT,
  GET_CHECKOUT,
} from './checkout';

const initialState = {
  uq: {
    cartNumber: null,
    token: null,

    gift: null,
    loaded: false,
    cartLoadError: null,
    minimumFreeShipping: 5000,
    totalAmount: 0,
    paymentAmount: 0,
    totalItems: 0,
    items: [],
    /**
     * @prop {Object} inventoryDetails - An object containing the products that are
     * low on inventory or out of stock.
     */
    inventoryDetails: {},
    // TODO: remove this field when GDS update is in place. redmine 40467
    shippingFeeWorkaround: true,
  },
  gu: {
    cartNumber: null,
    token: null,

    gift: null,
    loaded: false,
    cartLoadError: null,
    minimumFreeShipping: 5000,
    totalAmount: 0,
    paymentAmount: 0,
    totalItems: 0,
    items: [],
    /**
     * @prop {Object} inventoryDetails - An object containing the products that are
     * low on inventory or out of stock.
     */
    inventoryDetails: {},
    // TODO: remove this field when GDS update is in place. redmine 40467
    shippingFeeWorkaround: true,
  },
  coupon: null,
  defaultGiftBox: {},
  laterItems: [],
  likeItems: [],
  // No such details are coming from the API
  shipments: [],
  cartModel: false,
  isCartLoading: false,
  catalogData: {},
  refreshingCart: false,
  selectedDeliveryType: 'none',
};

export default function reducer(state = initialState, action = {}) {
  let cart;
  let response;

  switch (action.type) {
    case GENERATE_CART_SUCCESS:
      // generates a cart for a guest or register user
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          // take defaults from initialState to avoid missing fields like minimumFreeShipping
          ...cart,
          cartNumber: action.result.cart_no,
          token: action.result.token,
        },
      };
    case SET_CART_TOKEN:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          token: action.cookie.value,
        },
      };
    case SET_CART_NUMBER:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          cartNumber: action.cookie.value,
        },
      };
    case REMOVE_CART_TOKEN:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          cartNumber: null,
          token: null,
        },
      };
    case LOAD_CART:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          isCartLoading: true,
        },
      };
    // FETCH_ORDER_SUMMARY_SUCCESS and LOAD_CART_SUCCESS are essentially doing the same API calls.
    // combining the actions here keeps the cart redux more up to date without an extra API call overheads.
    case FETCH_ORDER_SUMMARY_SUCCESS:
    case LOAD_CART_SUCCESS:
      response = action.result;
      const { brand: actionBrand, isCurrentBrand } = action;
      const cartItems = response.cart_dtl_list
        ? getAllCartItems(response.cart_dtl_list)
        : [];

      const newState = {
        ...state,
        [actionBrand]: {
          ...state[actionBrand],
          cartLoadError: null,
          gift: response.gift_flg,
          hasGift: response.gift_flg === '1',
          cartGift: mapGift(response),
          items: cartItems,
          isCartLoading: false,
          lastUpdatedDate: response.upd_date,
          loaded: true,
          orderSummary: getOrderSummary(response),
          shippingAddress: mapDeliveryAddress(response),
          totalAmount: response.total_amt_in_tax,
          paymentAmount: response.payments_amt,
          totalItems: countItems(cartItems),
          paymentType: response.payment_type,
          couponFlag: response.coupon_flg,
          firstOrderFlag: response.first_ord_flg,
          receiptFlag: response.receipt_flg,
          giftCardBrandFlag: response.gift_card_flg,
          coupon_id: response.coupon_id,
        },
      };

      if (!isCurrentBrand) {
        // If the last loaded cart's brand differ from checkout brand or
        // brand in URL search query, we return newly calculated state.cart[brand]
        // and will NOT update the common properties under state.cart.
        return newState;
      }

      // Do this only if last loaded cart brand is same as
      // brand in URL search query (or checkout brand).
      return {
        ...newState,
        billingAddress: mapBillingToLocalAddress(response),
        cartGift: mapGift(response),
        deliveryMethod: mapDeliveryMethod(response),
        giftCardFlag: response.gift_card_flg,
      };
    case LOAD_BILLING_ADDRESS_SUCCESS:
      const convertedBillingAddress = action.noMapping ? action.billingAddress : mapBillingToLocalAddress(action.result);

      return {
        ...state,
        billingAddress: convertedBillingAddress,
      };
    case LOAD_CART_FAIL:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          items: [],
          totalItems: 0,
          loaded: false,
          isCartLoading: false,
          cartLoadError: action.error,
        },
      };
    case ADD_ITEM_SUCCESS:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          totalItems: state.uq.totalItems + 1,
        },
      };

    case REMOVE_ITEM_SUCCESS:
      cart = state[action.brand];

      // Last item on the cart? Then remove everything!
      if (cart.items.length === 1) {
        return {
          ...state,
          [action.brand]: {
            ...cart,
            items: [],
            itemRemoved: action.result.status,
            totalItems: 0,
          },
        };
      }

      return {
        ...state,
        [action.brand]: {
          ...cart,
          itemRemoved: action.result.status,
          totalItems: cart.totalItems - 1,
        },
      };
    case SHOW_CART_MODAL:
      const { open: cartModel } = action;

      return {
        ...state,
        cartModel,
      };
    case ADD_ITEM_FAIL:
    case GENERATE_CART_FAIL:
    case LOAD_CATALOG_DATA_FAIL:
      return {
        ...state,
        error: action.error,
      };

    case RESET_CART:
      return {
        ...state,
        [action.brand]: {
          ...initialState[action.brand],
        },
      };
    case SAVE_CHECKOUT:
      return {
        ...state,
        checkoutBrand: action.brand,
      };
    case GET_CHECKOUT:
      return {
        ...state,
        checkoutBrand: action.cookie.value,
      };
    case REMOVE_CHECKOUT:
      return {
        ...state,
        checkoutBrand: null,
      };
    case LOAD_CATALOG_DATA_SUCCESS:
      const { result: { items: products } } = action;
      const { items } = state[action.brand];
      const productsCount = items && items.length;
      const catalogData = {};

      if (productsCount > 0) {
        items.forEach((item) => {
          const { id, colorCode, sizeCd: sizeCode, multiBuy } = item;
          const skuIdWithFlag = `${id}-${colorCode}-${sizeCode}`;
          const currentProduct = products.find(current => current.productID === id);
          const sku = getByCriteria(currentProduct.SKUs, { colorCode, sizeCode });
          const defaultSku = getByCriteria(currentProduct.SKUs, { id: currentProduct.defaultSKU });

          if (sku) {
            catalogData[skuIdWithFlag] = {
              ...sku,
              salesStart: (defaultSku && defaultSku.salesStart) || sku.salesStart,
            };
          }
          const catalogSKU = catalogData[skuIdWithFlag];

          if (multiBuy && catalogSKU && !catalogSKU.flags.includes(MULTIBUY_FLAG)) {
            catalogSKU.flags.push(MULTIBUY_FLAG);
          }
        });
      }

      return {
        ...state,
        catalogData,
      };
    case UPDATE_ITEMS_INVENTORY_STATUS:
      const { inventoryDetails, brand } = action;

      cart = state[brand];

      return {
        ...state,
        [brand]: {
          ...cart,
          inventoryDetails,
        },
      };
    case RESET_L2CODE_INVENTORY_STATUS:
      cart = state[action.brand];
      const newInventoryDetails = { ...cart.inventoryDetails };

      delete newInventoryDetails[action.l2Code];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          inventoryDetails: newInventoryDetails,
        },
      };
    case REFRESH_CART:
      return {
        ...state,
        refreshingCart: true,
      };
    case REFRESH_CART_SUCCESS:
    case REFRESH_CART_FAIL:
      return {
        ...state,
        refreshingCart: false,
      };
    // Will set 'receiptFlag' as undefined (action.cookie.value)
    case RESET_RECEIPT_FLAG:
    case SET_RECEIPT_FLAG:
    case GET_RECEIPT_FLAG:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          receiptFlag: action.cookie.value,
        },
      };
    // TODO: remove this case block when GDS update is in place. redmine 40467
    case RESET_SHIPPINGFEE_WORKAROUND:
      cart = state[action.brand];

      return {
        ...state,
        [action.brand]: {
          ...cart,
          shippingFeeWorkaround: false,
        },
      };
    case CLEAR_CART_GIFTING:
      return {
        ...state,
        cartGift: {},
      };
    case SET_DELIVERY_METHOD_SUCCESS: {
      const { deliveryType } = action;

      return {
        ...state,
        deliveryMethod: {
          deliveryType,
        },
      };
    }
    case SET_SELECTED_DELIVERY_TYPE:
      return {
        ...state,
        selectedDeliveryType: action.deliveryType || 'none',
      };
    case SET_CALL_PIB_FLAG:
      return {
        ...state,
        callPIB: !!action.callPIB,
      };
    case ITEM_COUNT_SUCCESS:
    default:
      return state;
  }
}
