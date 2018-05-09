/**
 * This file contains all the private and public actions to manage the cart products.
 *  - Adding to cart
 *  - Generate a new cart
 *  - Remove products from cart
 *  - Update a product
 *  - Requests a new cart if current cart is invalid
 */
import { cartApi } from 'config/api';
import { getCurrentBrand, replaceUrlParams } from 'utils/routing';
import { removeCheckoutStatus, setCookieToResetCheckout } from 'redux/modules/checkout';
import { resetNextDayDeliveryDontCareFlag } from 'redux/modules/checkout/delivery';
import { popAPIErrorMessage } from 'redux/modules/errorHandler';
import constants from 'config/site/default';
import { promiseConfig, removeConfig, errorHandler } from './api';
import {
  getCart,
  load,
  removeCartCookie,
  resetCart,
  saveCartNumber,
  setCartNumber,
  bookProvisionalInventory,
  updateCartCountCookies,
  checkAndPopErrorMessage,
  resetReceiptStatus,
  isLoaded as isCartLoaded,
} from './cart';
import { removeCheckout } from './checkout';

export const ADD_ITEM = 'uniqlo/cart/ADD_ITEM';
export const ADD_ITEM_SUCCESS = 'uniqlo/cart/ADD_ITEM_S';
export const ADD_ITEM_FAIL = 'uniqlo/cart/ADD_ITEM_F';

export const RETURN_TO_CART = 'uniqlo/cart/RETURN_TO_CART';
export const RETURN_TO_CART_SUCCESS = 'uniqlo/cart/RETURN_TO_CART_S';
export const RETURN_TO_CART_FAIL = 'uniqlo/cart/RETURN_TO_CART_F';

export const GENERATE_CART = 'uniqlo/cart/GENERATE_CART';
export const GENERATE_CART_SUCCESS = 'uniqlo/cart/GENERATE_CART_S';
export const GENERATE_CART_FAIL = 'uniqlo/cart/GENERATE_CART_F';

export const REMOVE_ITEM = 'uniqlo/cart/REMOVE_ITEM';
export const REMOVE_ITEM_SUCCESS = 'uniqlo/cart/REMOVE_ITEM_S';
export const REMOVE_ITEM_FAIL = 'uniqlo/cart/REMOVE_ITEM_F';

// @private
function addProductToExistingCart(cartObject, cart, brand = 'uq') {
  const params = {
    client_id: cartApi.clientId,
    client_secret: cartApi.clientSecret,
    cart_no: cart.cartNumber,
    token: cart.token,
    l1_goods_cd: cartObject.l1Code,
    l2_goods_cd: cartObject.l2Code,
    goods_cnt: cartObject.quantity,
  };

  if (cartObject.inseamType) {
    params.alteration_flg = cartObject.inseamType;
    params.modify_size = cartObject.inseamLength;
  }

  return {
    types: [ADD_ITEM, ADD_ITEM_SUCCESS, ADD_ITEM_FAIL],
    brand,
    promise: client => client.post(cartApi.addToCart, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params,
    }),
    errorHandler: { ...errorHandler, customErrorKey: 'addToExistingCart' },
  };
}

// @private
// Count the existing items on cart
export function countItems(items) {
  let total = 0;

  items.forEach((item) => {
    total += parseInt(item.count, 10);
  });

  return total;
}

// @private
function generateCart(cartObject, brand = 'uq') {
  const params = {
    client_id: cartApi.clientId,
    client_secret: cartApi.clientSecret,
    l1_goods_cd: cartObject.l1Code,
    l2_goods_cd: cartObject.l2Code,
    goods_cnt: cartObject.quantity,
  };

  if (cartObject.inseamType && cartObject.inseamLength) {
    params.alteration_flg = cartObject.inseamType;
    params.modify_size = cartObject.inseamLength;
  }

  return {
    types: [GENERATE_CART, GENERATE_CART_SUCCESS, GENERATE_CART_FAIL],
    brand,
    promise: client => client.post(cartApi.generate, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params,
    }),
    errorHandler: { ...errorHandler, customErrorKey: 'generateCart' },
  };
}

/**
 * We only add products to Uniqlo cart, we don't support adding products to GU.
 * This actions generates a new cart if there's not one on the state already, otherwise
 * it use the existing cart.
 * If there's an existing cart but it's invalid or expired, this action will try
 * to generate a new cart and remove the existing.
 *
 * @param  {String} l1code  The l1code of the product to add
 * @param  {String} l2code  The l2code of the product to add
 * @param  {Number|String} quantity  The number of items to add for the same product.
 * @return {Promise}        Return a promise
 **/
export function addToCart(cartObject, brand = 'uq') {
  return (dispatch, getState) => {
    const cart = getCart(getState(), brand);
    let pendingPromise;

    // If there's no cart, generate a new one and add the product
    // then save the cart number and token in a cookie to access them
    // in the server side on the first request
    if (!cart.cartNumber) {
      pendingPromise = dispatch(generateCart(cartObject, brand))
            .then(result => dispatch(saveCartNumber(result, brand)));
    } else {
      pendingPromise = dispatch(addProductToExistingCart(cartObject, cart, brand));
    }

    return pendingPromise.then(() => dispatch(bookProvisionalInventory(brand)));
  };
}

export function addProductsBackToCart(orderNo, brand = 'uq') {
  return (dispatch, getState) => {
    const globalState = getState();
    const { orderHistory: { orderHistoryList } } = globalState;
    const { cartNumber, token } = getCart(globalState, brand);
    const orderDetails = orderHistoryList.find(order => order.orderNumber === orderNo);
    const params = {
      client_secret: cartApi.clientSecret,
      client_id: cartApi.clientId,
      ord_no: orderNo,
      hash_key: orderDetails.hashKey,
    };

    let cartPromise = Promise.resolve();

    if (cartNumber && token) {
      if (isCartLoaded(globalState, brand)) {
        params.cart_no = cartNumber;
        params.token = token;
      } else {
        cartPromise = dispatch(load(brand)).then(() => {
          const { items: cartItems } = getCart(getState(), brand);

          // When calling `POST /orderedcart` API, if there is an existing cart,
          // then the parameters `cart_no` and `token` are required for cart-merge process.
          // But if cart does not has any items, then we do not need to send them.
          if (cartItems.length > 0) {
            params.cart_no = cartNumber;
            params.token = token;
          }

          return Promise.resolve();
        });
      }
    }

    if (orderDetails) {
      return cartPromise
        .then(() => dispatch({
          types: [RETURN_TO_CART, RETURN_TO_CART_SUCCESS, RETURN_TO_CART_FAIL],
          promise: client => client.post(cartApi.returnToCart, {
            ...promiseConfig,
            host: replaceUrlParams(promiseConfig.host, { brand }),
            params,
          }),
          errorHandler: { ...errorHandler, customErrorKey: 'backToCart' },
        })
        // Save new `cart_no` and `token` in cookies
        .then(result => dispatch(saveCartNumber(result, brand, null, true))))
        // Update new `cart_no` and `token` in state
        .then(() => dispatch(setCartNumber(brand)));
    }

    return Promise.resolve();
  };
}

// @private
function removeItem(seqNo, brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState, brand);
    const cart = getCart(globalState, selectedBrand);

    return dispatch({
      types: [REMOVE_ITEM, REMOVE_ITEM_SUCCESS, REMOVE_ITEM_FAIL],
      brand: selectedBrand,
      promise: client => client.get(cartApi.cartItem, {
        ...removeConfig,
        host: replaceUrlParams(removeConfig.host, { brand }),
        params: {
          cart_seq_no: seqNo,
          cart_no: cart.cartNumber,
          token: cart.token,
          client_id: cartApi.clientId,
        },
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'removeCartItem' },
    });
  };
}

export function cleanUpCNCCookies(brand) {
  return (dispatch) => {
    // Remove cart from state and cookies as
    // GDS removes the cart on serverside.
    dispatch(setCookieToResetCheckout(brand));
    dispatch(resetNextDayDeliveryDontCareFlag(brand));
    dispatch(removeCheckout());
    dispatch(removeCheckoutStatus(brand));
    dispatch(resetCart(brand));
    // Remove receipt_flg cookie
    dispatch(resetReceiptStatus(brand));

    return dispatch(removeCartCookie(brand));
  };
}

/**
 * We need to remove items for Uniqlo and GU, this action calls the correct API
 * based on the brand, if not brand is set defaults to Uniqlo.
 *
 * @param  {String} seqNo  The sequence number to remove, this data comes from GDS response
 * @param  {String} brand  The brand that the given items belongs to (uq, gu)
 * @return {Promise}       Return a promise to handle server response
 **/
export function removeCartItem(seqNo, brand) {
  return (dispatch, getState) => {
    const selectedBrand = getCurrentBrand(getState(), brand);

    return dispatch(removeItem(seqNo, selectedBrand))
    .then(() => {
      const cart = getCart(getState(), selectedBrand);

      dispatch(checkAndPopErrorMessage(seqNo, brand));
      // If there are items just load the cart
      if (cart.items.length !== 0) {
        return dispatch(load(brand))
          .then((response) => {
            const hasItemCountError = !!getState().errorHandler.customErrors.setCartItemCount;
            const { cart: { THRESHOLD_AMOUNT } } = constants;

            if ((response.payments_amt < THRESHOLD_AMOUNT) && hasItemCountError) {
              dispatch(popAPIErrorMessage('setCartItemCount', true));
            }

            if (response.cart_dtl_list) {
              return dispatch(updateCartCountCookies(brand));
            }

            // `response.cart_dtl_list` is undefined implies cart does not has any more items.
            // This is a necessary and sufficient condition in order to clean up all CNC cookies.
            return dispatch(cleanUpCNCCookies(brand));
          });
      }

      return dispatch(cleanUpCNCCookies(brand));
    });
  };
}
