/**
 * This file contains several function related to cart, but not the ones related
 * to managing the products, for that take a look at `./products.js`.
 *
 *  - Loading cart
 *  - Saving and removing cookies
 *  - Gifting
 *  - Safe for later
 *  - Requests a new cart if current cart is invalid
 */
import { cartApi, catalogApi } from 'config/api';
import constants from 'config/site/default';
import config from 'config';
import getSiteConfig from 'config/site';
import { getCurrentBrand, replaceUrlParams, getUrlWithQueryData, redirect } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { scrollToTop } from 'utils/scroll';
import { formateLastUpdateDate } from 'utils/formatDate';
import noop from 'utils/noop';
import { setNativeAppCart, checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import { LocalStorage } from 'helpers/WebStorage';
import { loadRecentlyViewedProductIds } from 'redux/modules/style';
import { setNativeAppApplePayStatus } from 'redux/modules/applePay';
import { initializeWishlist } from 'redux/modules/wishlist/actions';
import { fetchGiftBags, fetchGiftBagAmounts } from 'redux/modules/checkout/gifting/actions';
import { isGiftBagsLoaded } from 'redux/modules/checkout/gifting/selectors';
import { isAuthenticated, confirmLogout, removeGuestCookie } from 'redux/modules/account/auth';
import { getProductGenderList } from 'redux/modules/productGender';
import { getProductIdList, getInventory } from 'redux/modules/mappings/cartMappings';
import { removeCheckoutStatus } from 'redux/modules/checkout';
import { loadDeliveryMethodOptions, setSelectedDeliveryType, resetNextDayDeliveryDontCareFlag } from 'redux/modules/checkout/delivery';
import { resetCard } from 'redux/modules/checkout/payment/creditCard/actions';
import { getCartCouponInformation } from 'redux/modules/membership/coupons';
import { popAPIErrorMessage, popDetailedErrorMessage, resetInventoryError, resetDetailedErrorMessages } from 'redux/modules/errorHandler';
import { cookies, errorHandler, promiseConfig, updateConfig, removeConfig } from './api';

export const SAVE_CART_TOKEN = 'uniqlo/cart/SAVE_CART_TOKEN';
export const REMOVE_CART_TOKEN = 'uniqlo/cart/REMOVE_CART_TOKEN';
export const RESET_CART = 'uniqlo/cart/RESET_CART';
export const SET_CART_NUMBER = 'uniqlo/cart/SET_CART_NUMBER';
export const SET_CART_TOKEN = 'uniqlo/cart/SET_CART_TOKEN';
export const SHOW_CART_MODAL = 'uniqlo/cart/SHOW_CART_MODAL';

export const ITEM_COUNT = 'uniqlo/cart/INCREMENT_DECREMENT_ITEM';
export const ITEM_COUNT_SUCCESS = 'uniqlo/cart/INCREMENT_DECREMENT_ITEM_SUCCESS';
export const ITEM_COUNT_FAIL = 'uniqlo/cart/INCREMENT_DECREMENT_ITEM_FAIL';

export const LOAD_CART = 'uniqlo/cart/LOAD_CART';
export const LOAD_CART_SUCCESS = 'uniqlo/cart/LOAD_CART_SUCCESS';
export const LOAD_CART_FAIL = 'uniqlo/cart/LOAD_CART_FAIL';

export const DELETE_CART = 'uniqlo/cart/DELETE_CART';
export const DELETE_CART_SUCCESS = 'uniqlo/cart/DELETE_CART_S';
export const DELETE_CART_FAIL = 'uniqlo/cart/DELETE_CART_F';

export const REFRESH_CART = 'uniqlo/cart/REFRESH_CART';
export const REFRESH_CART_SUCCESS = 'uniqlo/cart/REFRESH_CART_S';
export const REFRESH_CART_FAIL = 'uniqlo/cart/REFRESH_CART_F';

export const LOAD_CATALOG_DATA = 'cart/LOAD_CATALOG';
export const LOAD_CATALOG_DATA_SUCCESS = 'cart/LOAD_CATALOG_S';
export const LOAD_CATALOG_DATA_FAIL = 'cart/LOAD_CATALOG_F';

export const UPDATE_ITEMS_INVENTORY_STATUS = 'cart/UPD_INVENTORY_STATUS';
export const RESET_L2CODE_INVENTORY_STATUS = 'cart/RESET_L2CODE_INVENTORY_STATUS';

export const SET_RECEIPT_FLAG = 'cart/SET_RECEIPT_FLAG';
export const RESET_RECEIPT_FLAG = 'cart/RESET_RECEIPT_FLAG';
export const GET_RECEIPT_FLAG = 'cart/GET_RECEIPT_FLAG';
export const CLEAR_CART_GIFTING = 'cart/CLEAR_CART_GIFTING';

export const SET_CALL_PIB_FLAG = 'cart/SET_CALL_PIB_FLAG';

// TODO: remove this action type when GDS update is in place. redmine 40467
export const RESET_SHIPPINGFEE_WORKAROUND = '/cart/RST_SHIPFEE_WRKARND';

const SET_CART_COUNT_TOTAL_COOKIE = 'cart/COUNT_TOTAL_UPDATE';
const REDIRECT_TO_CART = 'cart/REDIRECT_TO_CART';

/**
 * @private
 *  Returns the smallest id number in giftbags
 *  @param giftbags  {Array} Array of giftbags returned by api.
 *  @param brand  {String} The current brand.
 * @return {String} Smallest id in giftbags.
 **/
export function findSmallestId(giftBags, brand) {
  let giftBagId = null;

  giftBags.forEach((bag) => {
    if (bag.brand === brand && (!giftBagId || parseInt(giftBagId, 10) > parseInt(bag.id, 10))) {
      giftBagId = bag.id;
    }
  });

  return giftBagId;
}

/**
 *  Returns the cart number/token from state based on the brand param
 *  if brand param is not defined, then it checks for the brand query param, default to `uq`.
 *  @param globalState  {Object} The redux global state.
 *  @param brand        {String} The brand to load.
 **/
export function getCart(globalState, brand) {
  const selectedBrand = getCurrentBrand(globalState, brand);

  return globalState.cart[selectedBrand];
}

export function isLoaded(globalState, brand = 'uq') {
  const selectedBrand = getCurrentBrand(globalState, brand);
  const cart = getCart(globalState, selectedBrand);

  return cart.loaded;
}

// Check if the cart number and cart token exist on state
// for the given brand.
export function isCreated(globalState, brand = 'uq') {
  const selectedBrand = getCurrentBrand(globalState, brand);
  const cart = getCart(globalState, selectedBrand);

  return !!(cart.token && cart.cartNumber);
}

/**
 * When inventory booking fails, this action gets called by the error handler,
 * we need send this to the reducer to show the errors on the given product.
 * @param {String} brand - The brand that failed
 * @param {Array} inventoryDetails - The array of items that failed to book
 */
export function updateItemsInventoryStatus(brand, inventoryDetails = []) {
  return (dispatch, getState) => {
    const cart = getCart(getState(), brand);

    dispatch({
      type: UPDATE_ITEMS_INVENTORY_STATUS,
      brand,
      inventoryDetails: getInventory(inventoryDetails, cart.items),
    });

    if (inventoryDetails.length > 0) dispatch(resetInventoryError());
  };
}

/**
 * Resets inventory error status for cart item identified by l2Code
 * @param {String} brand  - current cart's brand
 * @param {String} l2Code - l2Code of the product being edited/deleted
 */
export function resetL2CodeInventoryStatus(brand, l2Code) {
  return {
    type: RESET_L2CODE_INVENTORY_STATUS,
    brand,
    l2Code,
  };
}

export function checkAndPopErrorMessage(seqNo, brand, count) {
  return (dispatch, getState) => {
    const globalState = getState();
    const hasErrorMessage = !!globalState.errorHandler.customErrors.provisionalInventory;

    if (hasErrorMessage) {
      const updatedCount = ~~count;
      const selectedBrand = getCurrentBrand(globalState, brand);
      let cart = getCart(globalState, selectedBrand);
      const { cartItems: cartItemErrors } = globalState.errorHandler.detailedErrors;
      const modifiedItem = cart.items.find(item => item.seqNo === seqNo) || {};
      const modifiedItemL2Code = modifiedItem.l2Code;

      // !count => 'count' is undefined, cart item was deleted
      // updatedCount < ~~modifiedItem.count => cart item count has been reduced
      if (!count || updatedCount < ~~modifiedItem.count) {
        // for normal products, total goods count for the l2Code = cartItem(l2Code).goods_cnt
        let modifiedL2TotalCount = updatedCount;

        // if the modified product has multi-buy option
        if (modifiedItem.multiBuy) {
          // for multi-buy products, total goods count for the l2Code = Σ cartItem(l2Code).goods_cnt
          modifiedL2TotalCount = cart.items.reduce((sum, cartItem) => {
            if (cartItem.l2Code === modifiedItemL2Code) {
              // calculate total goods count for an l2Code
              return sum + (
                // in the case of the modified item, use the 'updatedCount'
                cartItem.seqNo === seqNo ? updatedCount : ~~cartItem.count
              );
            }

            return sum;
          }, 0);

          const { count: securedCount } = cart.inventoryDetails[modifiedItemL2Code] || {};

          // clear inventory status and make checkout button ACTIVE if total
          // no.of items for a particular l2Code satisfies the PIB secure count.
          if (modifiedL2TotalCount <= securedCount) {
            dispatch(resetL2CodeInventoryStatus(brand, modifiedItemL2Code));
          }

          // If PIB returned 'detailResultCode' for any of the cart items, errorHandler stores that error
          // response under 'detailedErorrs'. The error is mapped as: detailedErrors.cartItems[l2Code]
          // Error correspoding to an l2Code under 'detailedErrors' is removed only if the item is deleted.
          if (modifiedL2TotalCount === 0 && cartItemErrors[modifiedItemL2Code]) {
            dispatch(popDetailedErrorMessage('cartItems', modifiedItemL2Code));
          }

        // If the edited/deleted product is not a multi-buy product, there won't be other any other cart items
        // with the same l2Code. Also for a DELETE operation the argument 'count' will be 'undefined'.
        // This means we can remove the corresponding l2Code error message from 'detailedErrors'.
        } else if (!count && cartItemErrors[modifiedItemL2Code]) {
          dispatch(popDetailedErrorMessage('cartItems', modifiedItemL2Code));
        }

        // Remove all l2Code error message under 'detailedErrors' if cart is empty
        if (cart.items.length === 0) {
          dispatch(resetDetailedErrorMessages(['cartItems']));
        }

        const newState = getState();

        cart = getCart(newState, selectedBrand);
        const { cartItems: newCartItemErrors } = newState.errorHandler.detailedErrors;
        const shouldKeepErrMsg = cart.items.some((item) => {
          const itemL2Code = item.l2Code;

          // We keep the top errror message if there is an error under 'detailedErrors' for an l2Code.
          if (newCartItemErrors[itemL2Code]) {
            return true;
          }

          const product = cart.inventoryDetails[itemL2Code] || {};
          const securedCount = item.multiBuy ? product.count : product.secured;
          const isOutOfStock = securedCount === 0;
          const isLowInStock = securedCount > 0;

          if (item.seqNo === seqNo) {
            // Modified product seqNo is same as iterated item.seqNo,
            return (
              // we keep the error message:
              // if item is out-of-stock but we're just changing the count
              isOutOfStock && modifiedL2TotalCount > 0 ||
              // OR if item is low-in-stock, but the new count is still not secured
              isLowInStock && securedCount < modifiedL2TotalCount
            );
          }

          let l2ProductCount = ~~item.count;

          if (item.multiBuy) {
            l2ProductCount = cart.items.reduce((sum, cartItem) => (
              itemL2Code === cartItem.l2Code ? sum + ~~cartItem.count : sum
            ), 0);
          }

          // this is NOT the modified item, keep the message if it is out-of-stock OR low-in-stock
          return isOutOfStock || isLowInStock && securedCount < l2ProductCount;
        });

        if (!shouldKeepErrMsg) {
          dispatch(popAPIErrorMessage('provisionalInventory', true));
        }
      }
    }
  };
}

/**
 *  Sets the cart number and token from cookie
 *  to the cart state on first render.
 *  @param brand  {String} The brand to load, if null it will check for `brand` query parameter.
 **/
export function setCartNumber(brand) {
  return (dispatch, getState) => {
    const selectedBrand = getCurrentBrand(getState(), brand);
    const keys = {
      number: selectedBrand === 'uq' ? cookies.cartNumberUqCookie : cookies.cartNumberGuCookie,
      token: selectedBrand === 'uq' ? cookies.cartTokenUqCookie : cookies.cartTokenGuCookie,
    };

    dispatch({
      type: SET_CART_TOKEN,
      brand: selectedBrand,
      cookie: {
        key: keys.token,
        domain: cookies.domain,
      },
    });
    dispatch({
      type: SET_CART_NUMBER,
      brand: selectedBrand,
      cookie: {
        key: keys.number,
        domain: cookies.domain,
      },
    });
  };
}

export function setProductGenderList(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState, brand);
    const cart = getCart(globalState, selectedBrand);

    return cart.items.length &&
      dispatch(getProductGenderList(getProductIdList(cart.items), brand));
  };
}

export function refreshCart(productBrand) {
  return (dispatch, getState) => dispatch({
    types: [REFRESH_CART, REFRESH_CART_SUCCESS, REFRESH_CART_FAIL],
    promise: (client, brand) => {
      const currentBrand = productBrand || brand;
      const cart = getCart(getState(), currentBrand);

      return client.post(cartApi.cart, {
        ...updateConfig,
        host: replaceUrlParams(updateConfig.host, { brand: currentBrand }),
        params: {
          client_id: cartApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      });
    },
    errorHandler: { ...errorHandler, customErrorKey: 'provisionalInventory' },
  });
}

/**
 *  Two cookies are saved, one holding the cart number
 *  and the cart token. This is required by GDS in order to do the merging at login.
 *  We also need to send the expiration date to sync expiration cart with GDS.
 *  @param result  {Object} Data with `token` and `cart_no` values.
 *  @param expirationDate  {Date} (Optional) The date when the cookie should expire
 */
export function saveCartNumber(result, brand, expirationDate) {
  // GDS is setting the cookie on this especific path
  const path = cookies.cartPath;
  const expires = expirationDate || new Date();

  expires.setTime(expires.getTime() + cookies.cartExpires);

  return (dispatch) => {
    dispatch({
      type: SAVE_CART_TOKEN,
      cookie: {
        key: brand === 'uq' ? cookies.cartTokenUqCookie : cookies.cartTokenGuCookie,
        value: result.token,
        expires,
        domain: cookies.domain,
        path,
      },
    });

    dispatch({
      type: SAVE_CART_TOKEN,
      cookie: {
        key: brand === 'uq' ? cookies.cartNumberUqCookie : cookies.cartNumberGuCookie,
        value: result.cart_no,
        expires,
        domain: cookies.domain,
        path,
      },
    });
  };
}

/**
 * @private
 * Updates the expiration cookie date from server side date when the cart loads.
 * @param brand {String} The brand of the cart
 * @param data {Object} The response from cart load, we only need the cart number, token and the latest upd_date.
 **/
function checkExpirationCart(brand, data) {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState, brand);
    const cart = getCart(globalState, selectedBrand);
    const formatedDate = formateLastUpdateDate(data.upd_date);
    const expiration = new Date(formatedDate);

    dispatch(saveCartNumber({
      token: cart.token,
      cart_no: cart.cartNumber,
    }, selectedBrand, expiration));

    return Promise.resolve(data);
  };
}

/**
 * @private
 * Loads the cart from the GDS API
 * @param brand {String} The brand of the cart
 **/
function fetchCart(brand = 'uq') {
  return (dispatch, getState) => {
    const globalState = getState();
    const isCurrentBrand = brand === getCurrentBrand(globalState);
    const cart = getCart(globalState, brand);

    return dispatch({
      types: [LOAD_CART, LOAD_CART_SUCCESS, LOAD_CART_FAIL],
      brand,
      isCurrentBrand,
      promise: client => client.get(cartApi.cart, {
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

/**
 * Loads the cart and updates the expiration date on the cookie based on the server response.
 * We update the expiration date on every load because we don't know when the cookie it's
 * about to expire.
 * @param {String} brand The brand of the cart to load. Supported values: 'uq' or 'gu'
 */
export function load(brand) {
  return dispatch => (
    dispatch(fetchCart(brand))
      .then(data => dispatch(checkExpirationCart(brand, data)))
  );
}

function setItemCount(seqNo, count, brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState, brand);
    const cart = getCart(globalState, selectedBrand);

    return dispatch({
      types: [ITEM_COUNT, ITEM_COUNT_SUCCESS, ITEM_COUNT_FAIL],
      promise: client => client.post(cartApi.cartItem, {
        ...updateConfig,
        host: replaceUrlParams(updateConfig.host, { brand }),
        params: {
          cart_seq_no: seqNo,
          cart_no: cart.cartNumber,
          token: cart.token,
          client_id: cartApi.clientId,
          goods_cnt: count,
        },
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'setCartItemCount' },
    })
    .then(() => dispatch(checkAndPopErrorMessage(seqNo, brand, count)))
    .catch(noop);
  };
}

export function removeCartCookie(brand) {
  return (dispatch, getState) => {
    // GDS is setting the cookie on this especific path
    const path = cookies.cartPath;
    const selectedBrand = getCurrentBrand(getState(), brand);
    const brandCookies = selectedBrand === 'uq'
      ? { token: cookies.cartTokenUqCookie, number: cookies.cartNumberUqCookie }
      : { token: cookies.cartTokenGuCookie, number: cookies.cartNumberGuCookie };

    dispatch({
      type: REMOVE_CART_TOKEN,
      brand: selectedBrand,
      cookie: {
        key: brandCookies.token,
        remove: true,
        domain: cookies.domain,
        path,
      },
    });
    dispatch({
      type: REMOVE_CART_TOKEN,
      brand: selectedBrand,
      cookie: {
        key: brandCookies.number,
        remove: true,
        domain: cookies.domain,
        path,
      },
    });
  };
}

export function showCartModal(open) {
  return {
    type: SHOW_CART_MODAL,
    open,
  };
}

export function removeCartCountCookies(brand) {
  // reset the native app cart details only if this is a UQ cart
  if (brand === 'uq') {
    setNativeAppCart({ cart_num: '0' });
  }

  return dispatch => Promise.all([
    dispatch({
      type: SET_CART_COUNT_TOTAL_COOKIE,
      cookie: {
        key: cookies.cartNumberCookie[brand],
        remove: true,
        path: cookies.cartPath,
        domain: cookies.domain,
      },
    }),
    dispatch({
      type: SET_CART_COUNT_TOTAL_COOKIE,
      cookie: {
        key: cookies.cartTotalCookie[brand],
        remove: true,
        path: cookies.cartPath,
        domain: cookies.domain,
      },
    }),
  ]);
}

export function updateCartCountCookies(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const { totalItems, totalAmount, cartNumber, token } = globalState.cart[brand];

    // update the native app's cart details if the cart brand is UQ.
    if (brand === 'uq') {
      if (cartNumber && token) {
        setNativeAppCart({
          cart_no: cartNumber,
          token,
          cart_num: totalItems,
        });
      } else {
        setNativeAppCart({
          cart_num: 0,
        });
      }
    }

    return Promise.all([
      dispatch({
        type: SET_CART_COUNT_TOTAL_COOKIE,
        cookie: {
          key: cookies.cartNumberCookie[brand],
          value: totalItems.toString(),
          path: cookies.cartPath,
          domain: cookies.domain,
        },
      }),
      dispatch({
        type: SET_CART_COUNT_TOTAL_COOKIE,
        cookie: {
          key: cookies.cartTotalCookie[brand],
          value: totalAmount.toString(),
          path: cookies.cartPath,
          domain: cookies.domain,
        },
      }),
    ]);
  };
}

export function resetCart(brand) {
  return (dispatch, getState) => {
    const selectedBrand = getCurrentBrand(getState(), brand);

    dispatch(removeCartCookie(selectedBrand));
    dispatch(removeCartCountCookies(selectedBrand));
    dispatch({
      type: RESET_CART,
      brand: selectedBrand,
    });
  };
}

export function loadCatalogData(itemIds, brand) {
  const onlineIds = itemIds.join(',');

  return {
    types: [LOAD_CATALOG_DATA, LOAD_CATALOG_DATA_SUCCESS, LOAD_CATALOG_DATA_FAIL],
    promise: client => client.get(catalogApi.productList, {
      host: `${catalogApi.base}/${catalogApi.version}/${brand}/${catalogApi.region}`,
      params: {
        clientID: catalogApi.client,
        locale: catalogApi.language,
        onlineID: onlineIds,
        count: itemIds.length,
      },
    }),
    brand,
  };
}

// Provisional inventory booking API dispatching action
export function bookProvisionalInventory(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const { cart: { checkoutBrand, refreshingCart }, auth: { user } } = globalState;
    const bookItems = checkoutBrand && checkoutBrand === brand && isAuthenticated(user) && !refreshingCart;

    // check for checkout cookie (checkoutBrand) and authentication
    return bookItems
      // Dispatches provisional Inventory API call
      ? dispatch(refreshCart(checkoutBrand))
          // reset inventoryDetails on PIB success
          .then(() => {
            const inventoryDetails = getCart(globalState, brand).inventoryDetails || {};

            if (Object.keys(inventoryDetails).length > 0) {
              dispatch(updateItemsInventoryStatus(brand, []));
            }

            return Promise.resolve();
          })
      // Returns a Promise if above condition not satisfied
      : Promise.resolve();
  };
}

// Action to book provisional Inventory and loading the delivery_selectable on success
// to get the updated the `expected date time` for each delivery type.
export function bookAndLoadDeliveryOptions(brand) {
  return dispatch => dispatch(bookProvisionalInventory(brand))
    .then(() => dispatch(loadDeliveryMethodOptions()));
}

/**
 * Method to set `callPIB` flag.
 * This is used to avoid extra api calls in checkout process.
 * @param  {Boolean} callPIB=true call PIB
 * @return {Object} action.callPIB decides whether PIB call has to be done or not
 */
export function setCallPIBFlag(callPIB) {
  return {
    type: SET_CALL_PIB_FLAG,
    callPIB,
  };
}

export function setCountAndLoad(seqNo, count, brand) {
  return dispatch => dispatch(setItemCount(seqNo, count, brand))
    .then(() => dispatch(load(brand)))
    .then(() => dispatch(updateCartCountCookies(brand)));
}

export function setReceiptStatus(brand, status) {
  return {
    type: SET_RECEIPT_FLAG,
    brand,
    cookie: {
      key: cookies.orderReceiptStatus,
      value: status,
      domain: cookies.domain,
    },
  };
}

export function resetReceiptStatus(brand) {
  return {
    type: RESET_RECEIPT_FLAG,
    brand,
    cookie: {
      key: cookies.orderReceiptStatus,
      remove: true,
      domain: cookies.domain,
    },
  };
}

export function getReceiptStatus(brand) {
  return {
    type: GET_RECEIPT_FLAG,
    brand,
    cookie: {
      key: cookies.orderReceiptStatus,
    },
  };
}

export function removeCart(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState, brand);
    const cart = getCart(globalState, selectedBrand);

    return dispatch({
      types: [DELETE_CART, DELETE_CART_SUCCESS, DELETE_CART_FAIL],
      brand: selectedBrand,
      promise: client => client.get(cartApi.cart, {
        ...removeConfig,
        host: replaceUrlParams(removeConfig.host, { brand }),
        params: {
          client_id: cartApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { enableReaction: true },
    }).then(() => {
      dispatch(resetNextDayDeliveryDontCareFlag(brand));
      dispatch(removeCheckoutStatus(brand));
      dispatch(resetCart(brand));
      dispatch(resetReceiptStatus(brand));
    });
  };
}

// @private
// GDS needs a PUT, POST or DELETE call to update shipping fee.
// Inventory API is not suitable for this. So using cart quantity update call instead.
// TODO: remove this action when GDS update is in place. redmine 40467
export function doShippingFeeWorkaround(brand, items) {
  return (dispatch, getState) => {
    const globalState = getState();
    const { auth: { user }, applePay: { isLoginCookieInvalid } } = globalState;
    const { shippingFeeWorkaround, orderSummary } = getCart(globalState, brand);
    const firstItem = items.length && items[0].length && items[0][0];

    if (firstItem && shippingFeeWorkaround && isAuthenticated(user) && !isLoginCookieInvalid && orderSummary && orderSummary.shippingCost) {
      return Promise.all([
        dispatch({ type: RESET_SHIPPINGFEE_WORKAROUND, brand }),
        dispatch(setCountAndLoad(firstItem.seqNo, firstItem.count, brand)),
      ]);
    }

    return Promise.resolve();
  };
}

export function initializeCartPage({ store: { dispatch, getState } }) {
  const { brandName: { uq, gu } } = constants;
  const { localStorageKeys } = config.app;
  const promises = [];
  const globalState = getState();
  const currentBrand = getCurrentBrand(globalState);
  const currentCart = getCart(globalState, currentBrand);
  const { routing: { locationBeforeTransitions: { query: { cart_no: cartNumber, token } } }, auth: { user } } = globalState;
  const setCartPromise = [];
  // Check if cart from params is same as local cart
  const isSameCart = currentCart.cartNumber === cartNumber && currentCart.token === token;

  dispatch(loadRecentlyViewedProductIds());
  dispatch(initializeWishlist(currentBrand))
    .catch(noop);

  LocalStorage.removeItem(localStorageKeys.applePayFlag);
  dispatch(removeGuestCookie());

  // If cart number and token is available from params and is not same as local cart, logout and load that cart to local
  if (cartNumber && token && ![cartNumber, token].includes('null') && !isSameCart) {
    if (isAuthenticated(user)) {
      setCartPromise.push(dispatch(confirmLogout()));
    }

    setCartPromise.push(dispatch(saveCartNumber({ token, cart_no: cartNumber }, currentBrand)));
    setCartPromise.push(dispatch(setCartNumber(currentBrand)));
  }

  return Promise.all(setCartPromise).then(() => {
    const currentState = getState();
    const uqCart = getCart(currentState, uq);
    const guCart = getCart(currentState, gu);
    const { gifting: { giftBagAmounts } } = currentState;

    // reset data in state.creditCard in cases where user used minibag link to start over.
    promises.push(dispatch(resetCard()));

    // If there's a UQ cart we need to load it!
    if (uqCart.cartNumber) {
      promises.push(dispatch(load(uq)).then(() => {
        const additionalActions = [
          dispatch(setProductGenderList(uq)),
          dispatch(getCartCouponInformation(uq)),
          dispatch(updateCartCountCookies(uq)),
        ];

        return Promise.all(additionalActions);
      }));
    } else {
      promises.push(dispatch(updateCartCountCookies(uq)));
    }

    // If there's a GU cart we need to load it!
    if (guCart.cartNumber) {
      promises.push(dispatch(load(gu)).then(() => {
        const additionalActions = [
          dispatch(setProductGenderList(gu)),
          dispatch(getCartCouponInformation(gu)),
          dispatch(updateCartCountCookies(gu)),
        ];

        return Promise.all(additionalActions);
      }));
    } else {
      promises.push(dispatch(updateCartCountCookies(gu)));
    }

    if (Object.keys(giftBagAmounts).length === 0) {
      dispatch(fetchGiftBagAmounts());
    }

    if (!isGiftBagsLoaded(globalState)) {
      dispatch(fetchGiftBags());
    }

    dispatch(setSelectedDeliveryType());

    if (checkUQNativeApp() || checkGUNativeApp()) {
      const { applePay: { supportedNetworks } } = getSiteConfig();

      // do not block initial rendering
      dispatch(setNativeAppApplePayStatus(supportedNetworks));
    }

    return Promise.all(promises);
  });
}

/**
 * This action clears the content of state.cart.gifting when editing
 * an existing gifting.
 */
export function clearCartGifting() {
  return {
    type: CLEAR_CART_GIFTING,
  };
}

export function switchCart(targetBrand) {
  return (dispatch, getState) => {
    scrollToTop(document.body, 0, 0);
    redirect(getUrlWithQueryData(routes.cart, { brand: targetBrand }));

    return dispatch(load(targetBrand))
      .then(() => {
        if (getState().errorHandler.customErrors.setCartItemCount) {
          dispatch(popAPIErrorMessage('setCartItemCount', true));
        }

        dispatch(checkAndPopErrorMessage(null, targetBrand));
      });
  };
}

/**
 * validation utility that redirects to cart page with brand param in URL if cart was found to be empty/null.
 * This is useful for preventing API calls with invalid cart number and token.
 * @param  {Boolean} forceRedirect=true Enable or disable the redirection to cart. Usefull in cases
 *                                      where the action is triggered from multiple places of same page.
 * @return {Promise}  A promise that immediately if cart is good, otherise a rejection.
 */
export function checkCartExists(forceRedirect = true) {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);

    if (!isCreated(globalState, brand)) {
      if (forceRedirect) {
        dispatch({
          type: REDIRECT_TO_CART,
          redirect: { location: getUrlWithQueryData(routes.cart, { brand }) },
        });
      }

      return Promise.reject();
    }

    return Promise.resolve();
  };
}
