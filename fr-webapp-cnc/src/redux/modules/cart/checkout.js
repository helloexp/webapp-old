/**
 * Checkout flow
 * -------------
 * This file has the methods for performing checkout process when user clicks the
 * checkout button in cart page. A set of promises are evaluated sequentially and
 * based on whether the promises are resolved or rejected, we take decisions to
 * redirect user to delivery page, payment page or review order page (final state).
 */

import reactCookie from 'react-cookie';
import * as cartActions from 'redux/modules/cart';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import * as paymentActions from 'redux/modules/checkout/payment/actions';
import * as userInfoActions from 'redux/modules/account/userInfo';
import * as authActions from 'redux/modules/account/auth';
import * as giftCardActions from 'redux/modules/checkout/payment/giftCard/actions';
import { popAPIErrorMessage, resetDetailedErrorMessages } from 'redux/modules/errorHandler';
import {
  restoreSelectedStore,
  setUQPaymentAndRedirect,
} from 'redux/modules/checkout/payment/store';
import { setCheckoutStatus, getCheckoutStatus, removeCheckoutStatus, removeCookieToResetCheckout } from 'redux/modules/checkout';

import { mapUserAddressIfNeded } from 'redux/modules/account/mappings/userInfoMapping';
import { SessionStorage } from 'helpers/WebStorage';
import { ignoreResponseFailures } from 'utils/requestResponse';
import { replace } from 'react-router-redux';
import { getCurrentBrand, getUrlWithQueryData, root } from 'utils/routing';
import { isStoreStaffEmail } from 'utils/validation';
import { getCartPaymentType } from 'redux/modules/cart/selectors';
import { routes } from 'utils/urlPatterns';
import config from 'config';
import constants from 'config/site/default';
import noop from 'utils/noop';
import { isPickupStoreAddress, isShippingDeliveryMethods } from 'utils/deliveryUtils';
import { cookies } from './api';

const REDIRECT_TO = 'uniqlo/checkout/REDIRECT';

export const SAVE_CHECKOUT = 'cart/SAVE_CH';
export const REMOVE_CHECKOUT = 'cart/REMOVE_CH';
export const GET_CHECKOUT = 'cart/GET_CH';

const {
  payment: { cashOnDelivery: COD, creditCard: CREDIT_CARD, giftCard: GIFT_CARD, uniqloStore: UQ_STORE, postPay: POST_PAY },
  deliveryTypes: { SHIPPING, YU_PACKET, YAMATO_MAIL, STORE_PICKUP },
  deliveryPreferences: { SPLIT_DELIVERY, GROUP_DELIVERY },
  gds: { positive },
  pages: { PAYMENT, DELIVERY },
} = constants;
const { sessionStorageKeys: { dontCareNextDayDelvFlag } } = config.app;

/**
 * Checks if shipping address is completed
 */
export function isAddressComplete(address) {
  return (
    // Check if there's name and lastname to make sure the shipping address is completed
    address
      && address.firstName
      && address.lastName
      && address.prefecture
    ||
    // Sometimes Account platform returns `givenName` instead of `firstName`
    // same for `familyName` instead of `lastName`.
    address
      && address.givenName
      && address.familyName
    ||
    // For new users, if they select pick up at uniqlo, the shipping address
    // will be the selected uniqlo store, therefore we can't rely only on firstname and lastname
    // but on the actual address selection
    isPickupStoreAddress(address)
  );
}

/**
 * Redirect using redirectMiddleWare
 * @private
 * @param {String} location
 */
function redirectTo(location) {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    dispatch({
      type: REDIRECT_TO,
      redirect: { location: getUrlWithQueryData(location, { brand }) },
    });
  };
}

/**
 * if delivery type is null for a cart, we have to call ship_to with only the zip code set in address.
 * The zip code used here comes from default shipping address.
 * @param  {Boolean} hasSelectedDelivery Delievery type or empty string which means that we are resetting the delivery type.
 * @return {Promise} Resolves immediately if deliveryType is null or returns a Promise that resolves after the API call.
 */
export function getAndSetShipTo(hasSelectedDelivery) {
  return dispatch => (
    hasSelectedDelivery
      ? Promise.resolve()
      : dispatch(userInfoActions.loadAllUserInfoAddresses())
        .then(() => dispatch(deliveryActions.getDefaultShippingAddressAndSavePostalCodeToShipTo(false)))
  );
}

/**
 * Check if the deliveryMethod selected for each split is valid.
 * @param {Array} deliveryMethods
 * @param {Object} deliveryMethodList
 * @param {String} deliveryPreference
 * @param {Number} splitCount
 * @returns {Boolean} returns `true` if all shipments are available
 */
function validateDeliveryMethods(deliveryMethods = [], deliveryMethodList, deliveryPreference, splitCount) {
  if (deliveryPreference === SPLIT_DELIVERY && deliveryMethods.length !== splitCount) {
    return false;
  }

  return deliveryMethods.every((item) => {
    const splitDelvMethods = deliveryMethodList[item.splitNo] &&
      deliveryMethodList[item.splitNo][deliveryPreference] || {};

    return !!(
      Object.keys(splitDelvMethods).length &&
      splitDelvMethods.deliveryTypes.length &&
      splitDelvMethods.deliveryTypes.includes(item.deliveryType)
    );
  });
}

/**
 * Sets delivery type as null (''), then
 * sets shipTo as postalCode only in the case of new user otherwise resolves an empty promise, then
 * books provisional inventory (to get shipping `delivery date` in delivery selectable API), then
 * calls delivery selectable API to get shipping `delivery lead date and time`
 * @private
 * @params {Boolean} newUser is true for new user flow and false otherwise
 * @params {Boolean} hasSelectedDelivery is provided if the delviery page should a preselected type.
 */
function prepareForRedirectToDelivery(newUser, hasSelectedDelivery) {
  return (dispatch, getState) => {
    const { payment } = getState();
    const brand = getCurrentBrand(getState());
    let callPIBFlag = !hasSelectedDelivery;

    const paymentPromise = () => {
      if (payment.paymentMethod && [UQ_STORE, COD].includes(payment.paymentMethod)) {
        return dispatch(paymentActions.setPaymentMethod(''))
          .then(() => dispatch(deliveryActions.loadDeliveryMethodOptions()));
      }

      return Promise.resolve();
    };

    const deliveryResetPromise = () => {
      const isDeliveryOptionsLoaded = getState().delivery.methodOptionsLoaded;
      const deliveryOptionsPromise = () => (
        isDeliveryOptionsLoaded
          ? Promise.resolve()
          : dispatch(deliveryActions.loadDeliveryMethodOptions())
      );

      return deliveryOptionsPromise().then(() => {
        const { deliveryMethod: shipments, deliveryPreference, deliveryMethodList, splitCount } = getState().delivery;

        // If the current delivery type is not available in delivery_selectable, reset the delivery_type
        if (hasSelectedDelivery && !validateDeliveryMethods(shipments, deliveryMethodList, deliveryPreference, splitCount)) {
          callPIBFlag = true;

          return dispatch(deliveryActions.setDeliveryWithDefaultPreferenceIfNeeded(true));
        }

        return Promise.resolve();
      });
    };

    const deliveryPromise = () => (newUser
      ? dispatch(getAndSetShipTo(hasSelectedDelivery))
      : dispatch(deliveryActions.setLocalDeliveryMethodTypeAndSelection(hasSelectedDelivery))
        .then(() => dispatch(getAndSetShipTo(hasSelectedDelivery))));

    return paymentPromise()
      .then(() => deliveryResetPromise())
      .then(() => deliveryPromise())
      .then(() => (callPIBFlag ? dispatch(cartActions.bookAndLoadDeliveryOptions(brand)) : Promise.resolve()));
  };
}

/**
 * Redirects to delivery page after
 * preparing for redirect
 * @private
 * @params {Boolean} newUser is true for new user flow and false otherwise
 * @params {Boolean} hasSelectedDelivery is provided if the delivery page should a preselected type.
 * @params {Boolean} toggleOption is true when user is redirected to deliveryPage for next_day_delivery promotion.
 */
function redirectToDeliveryPage(newUser, hasSelectedDelivery, toggleOption) {
  return dispatch => dispatch(prepareForRedirectToDelivery(newUser, hasSelectedDelivery))
    .then(() => toggleOption && dispatch(deliveryActions.toggleDeliveryEditOption()))
    .then(() => dispatch(redirectTo(routes.delivery)));
}

/**
 * Redirects to payment page after
 * calling PIB and delivery selectable
 * @private
 */
function redirectToPaymentPage() {
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    dispatch(setCheckoutStatus(DELIVERY));

    return getState().cart.callPIB
      ? dispatch(cartActions.bookAndLoadDeliveryOptions(brand)).then(() => dispatch(redirectTo(routes.payment)))
      : dispatch(redirectTo(routes.payment));
  };
}

/**
 * Set current brand as query param
 * @private
 * @param {String} brand
 */
function setCurrentBrand(brand) {
  return (dispatch, getState) => {
    const { routing: { location, locationBeforeTransitions } } = getState();
    const currentLocation = location || locationBeforeTransitions;

    if (!currentLocation.query.brand) {
      dispatch(replace({ ...currentLocation, search: `?brand=${brand}` }));
    }
  };
}

/**
 * Load selectable delivery methods to check if current
 * delivery type is available in the list
 * @private
 */
function validateDeliveryType() {
  return (dispatch, getState) => dispatch(deliveryActions.loadDeliveryMethod())
    .then(() => {
      const {
        deliveryMethod,
        deliveryMethodList,
        methodOptionsLoaded,
        deliveryPreference,
        isSplitDeliveryAvailable,
        isShippingGroupDeliveryAvailable,
        splitCount,
      } = getState().delivery;

      if (
        // split delivery not available, but is selected
        !isSplitDeliveryAvailable && deliveryPreference === SPLIT_DELIVERY ||
        // group delivery not available, but is selected
        !isShippingGroupDeliveryAvailable && deliveryPreference === GROUP_DELIVERY
      ) {
        return Promise.reject({ shouldResetDelivery: true });
      }

      // check if delivery type selectable
      if (
        methodOptionsLoaded &&
        validateDeliveryMethods(deliveryMethod, deliveryMethodList, deliveryPreference, splitCount)
      ) {
        return Promise.resolve();
      }

      // if any delivery method is not valid
      return Promise.reject();
    })
    .catch((errParams = {}) => {
      /**
       * Go to delivery page:
       * - if no delivery method is chosen OR
       * - if split delivery is chosen which is no longer available OR
       * - if group delivery is chosen which is no longer available OR
       * - if any delivery method is not avialable in selectable delivery types
       */
      dispatch(redirectToDeliveryPage(false, errParams.shouldResetDelivery));

      return Promise.reject();
    });
}

/**
 * -  Fetch shipping address, if there's one registered, we don't need to validate
 *    anything else and proceed to the next validations.
 * -  fetch default user info then check if user has familyName and givenName
 *    if not, user will be redirected to delivery page
 * @private
 */
function checkUserInfo() {
  return (dispatch, getState) => {
    const {
      delivery: { deliveryMethod: shipments, deliveryPreference, currentShippingAddress },
      userInfo: { userDefaultDetails: defaultAddress },
    } = getState();

    // If there's a shipping address, we are good to go
    // to the next validation.
    if (isAddressComplete(currentShippingAddress)) {
      return Promise.resolve();
    }

    // Let's check if there's a default address to use as shipto
    if (isAddressComplete(defaultAddress)) {
      return Promise.resolve(defaultAddress);
    }

    // Continue if Uniqlo Store is selected (11)
    if (deliveryPreference === GROUP_DELIVERY && shipments[0].deliveryType === STORE_PICKUP) {
      return Promise.resolve();
    }

    // If user doesn't has a familyName and givenName then it is possibly a new user.
    // Hence reset delivery type to null and redirect to delivery page.
    dispatch(deliveryActions.resetDeliveryMethodOption());
    // This is a new user condition so passing Boolean true as first argument
    dispatch(redirectToDeliveryPage(true));

    return Promise.reject();
  };
}

/**
 * Check if 001 is default shipping address, if not fetch all user addresses and
 * find out the default shipping address. If none found, redirect user to delivery
 * @private
 * @param {Object} defaultAddress - the default address '001' obtained from user info API
 */
function getDefaultShippingAddress(defaultAddress) {
  return (dispatch) => {
    // If user has no default shippingAddress yet, but has opted
    // to set 001 as the default shipping address we can proceed.
    if (defaultAddress.isDefaultShippingAddress) {
      return Promise.resolve(defaultAddress);
    }

    // 001 is not default shipping address, hence load all available user
    // addresses and check whether one of them is a default shipping addresss.
    return dispatch(userInfoActions.loadAllUserInfoAddresses())
      .then((addresses = []) => {
        // find the address with having flag "isDefaultShippingAddress"
        const defaultShippingAddress = addresses.find(address => address.isDefaultShippingAddress);

        return defaultShippingAddress ? Promise.resolve(defaultShippingAddress) : Promise.reject();
      })
      // if user does not has a default shipping, then go to delivery
      .catch(() => {
        dispatch(redirectToDeliveryPage());

        // exit checkout flow
        return Promise.reject();
      });
  };
}

/**
 * Check if the default_shipping_address and current_shipping_address matches.
 * If not, set the default_shipping_address as current_shipping_address.
 * This ensures that shipping address is the one selected as default_shipping_address.
 * @private
 * @param {Object} defaultShippingAddress - address selected as default_shipping_address.
 * @param {Object} currentShippingAddress - the current shipping address of user.
 * @param {Array} shipments - delivery types selected for cart.
 */
function isDefaultShippingAndCurrentShippingSame(defaultShippingAddress = {}, currentShippingAddress = {}, shipments = []) {
  const addressKeys = Object.keys(currentShippingAddress) || [];
  const newShippingAddress = mapUserAddressIfNeded(defaultShippingAddress);

  if (isShippingDeliveryMethods(shipments)) {
    return addressKeys.every(key =>
      (newShippingAddress.hasOwnProperty(key) ? newShippingAddress[key] === currentShippingAddress[key] : true)
    );
  }

  return true;
}

/**
 * Checks if cart is applicable for next_day_delivery
 * If not, proceed in normal flow.
 * If yes, take user to delivery method view, if he hasn't selected a shipping preference in current session.
 * In this case, also reset the payment method if it's COD or UQ_STORE - to ensure all delivery options are available for choice.
 * @private
 * @param {Boolean} isShippingSaved - To avoid duplicate PIB calls.
 */
function nextDayDeliveryCheck(isShippingSaved) {
  return (dispatch, getState) => {
    const {
      delivery: { deliveryMethod, nextDateOptions },
      auth: { user: { memberHash } },
      payment,
    } = getState();
    const brand = getCurrentBrand(getState());
    // Check whether the same user has ever set any shipping preference for the current cart for the current browser session.
    const sessionNotExpired = memberHash === SessionStorage.getItem(`${brand}-${dontCareNextDayDelvFlag}`);

    // if user has next_day_delivery available, then redirect to delivery page
    const isNextDayAvailableButSelectedAnother = !!deliveryMethod.find((split = {}) =>
      [YU_PACKET, SHIPPING, YAMATO_MAIL].includes(split.deliveryType) &&
      nextDateOptions[split.splitNo] && nextDateOptions[split.splitNo][SPLIT_DELIVERY]
    );

    if (isNextDayAvailableButSelectedAnother) {
      if (
        // user has already selected next_day_delivery
        deliveryMethod.find((split = {}) =>
          split.deliveryReqDate === nextDateOptions[split.splitNo][SPLIT_DELIVERY].date
        ) ||
        // OR already ignored next day availability in this checkout session
        sessionNotExpired
      ) {
        return Promise.resolve();
      }

      // If user has selected COD or UQ_STORE payment method, reset it so all delivery options will be shown in delivery page.
      if ([UQ_STORE, COD].includes(payment.paymentMethod)) {
        return dispatch(paymentActions.setPaymentMethod(''))
        .then(() => dispatch(deliveryActions.reloadDeliveryMethodOptions()))
        .then(() => {
          // newUser = true, hasSelectedDelivery = true, toggleOption = true
          dispatch(redirectToDeliveryPage(true, true, true));

          return Promise.reject();
        });
      }

      // newUser = true, hasSelectedDelivery = true, toggleOption = true
      dispatch(redirectToDeliveryPage(true, true, true));

      return Promise.reject();
    }

    if (isShippingSaved) {
      dispatch(cartActions.setCallPIBFlag(false));
    }

    return Promise.resolve();
  };
}

/**
 * Check shipping address, on failure redirect to delivery
 * if we have a default_shipping_address and current_shipping_address is different, post default address as current_shipping_address.
 * @private
 */
function checkShippingAddress() {
  return (dispatch, getState) => {
    const {
      delivery: { currentShippingAddress, deliveryMethod },
      userInfo: { userDefaultDetails: defaultAddress },
    } = getState();

    // we are here because user has not already selected a shipping address
    return dispatch(getDefaultShippingAddress(defaultAddress || {})).then((address) => {
      // found a defaultShippingAddress, lets update state and server
      if (Object.keys(address).length > 0) {
        // If shipping address is complete and it's the same as the one chosen as default_shipping_address,
        // continue with the next validations
        if (isAddressComplete(currentShippingAddress)) {
          if (isDefaultShippingAndCurrentShippingSame(address, currentShippingAddress, deliveryMethod)) {
            return dispatch(nextDayDeliveryCheck());
          }

          // update shippingAddress in the state
          dispatch(deliveryActions.setShippingSelectedAddress(mapUserAddressIfNeded(address)));
          // state updation completed synchronously, now update the server and continue checkout flow

          return dispatch(deliveryActions.saveShippingAddress())
            .then(() => dispatch(deliveryActions.loadDeliveryMethodOptions()))
            .then(() => {
              const {
                deliveryMethod: deliveryMethods,
                deliveryMethodList,
                methodOptionsLoaded,
                deliveryPreference,
                splitCount,
              } = getState().delivery;

              if (methodOptionsLoaded && validateDeliveryMethods(deliveryMethods, deliveryMethodList, deliveryPreference, splitCount)) {
                return Promise.resolve();
              }

              // Atleast one of the current deliveryMethods is not supported for the shipping address chosen.
              // Hence reset delivery methods and go to delivery page.
              dispatch(redirectToDeliveryPage(true, true));

              return Promise.reject();
            })
            .then(() => dispatch(nextDayDeliveryCheck(true)));
        }
      }

      // couldn't find or set shippingAddress successfully
      // This is a new user condition so passing Boolean true as first argument
      dispatch(redirectToDeliveryPage(true));

      return Promise.reject();
    });
  };
}

/**
 * Check if user has a paymentType selected already
 * @private
 */
function checkPaymentType() {
  return (dispatch, getState) => {
    const state = getState();
    const cart = cartActions.getCart(state, getCurrentBrand(state));

    return Promise.resolve({ hasPaymentType: !!cart.paymentType });
  };
}

/**
 * Check if 001 and current_billing_address matches.
 * @private
 * @param {Object} defaultAddress - 001.
 * @param {Object} currentBillingAddress - the current billing address of user.
 */
function isDefaultAddressAndCurrentBillingSame(defaultAddress = {}, currentBillingAddress = {}) {
  const addressKeys = Object.keys(currentBillingAddress) || [];

  return addressKeys.every(key =>
    (defaultAddress.hasOwnProperty(key) ? defaultAddress[key] === currentBillingAddress[key] : true)
  );
}

/**
 * https://www.pivotaltracker.com/n/projects/2003565/stories/147816943
 * if we have a complete 001 and current_billing_address, but both are different, post 001 as current_billing_address.
 * @param {Boolean} isNotNewUserStoresSelection - User can have an incomplete 001 if pick up at store, pay at store combination is selected.
 * @private
 */
function compareBillingAddress(isNotNewUserStoresSelection) {
  return (dispatch, getState) => {
    const {
      cart: { billingAddress },
      userInfo: { userDefaultDetails },
    } = getState();
    const defaultAddress = mapUserAddressIfNeded(userDefaultDetails);
    const resetBilling = !paymentActions.isBillingAddressIncompleted(billingAddress)
      && !isDefaultAddressAndCurrentBillingSame(defaultAddress, billingAddress);

    if (resetBilling && (userInfoActions.isDefaultDetailsComplete({ userInfo: { userDefaultDetails: defaultAddress } }) || isNotNewUserStoresSelection)) {
      return dispatch(deliveryActions.saveAsBillingAddress(defaultAddress))
        .then(() => dispatch(paymentActions.saveBillingAddressLocally(defaultAddress)));
    }

    return Promise.resolve();
  };
}

/**
 * Validates two scenarios:
 *  - payment type is "0" GIFT_CARD
 *  - payment type is "1" CREDIT_CARD which means user is
 *    is using credit card and gift together for payment.
 * @private
 * @param {String} paymentType - GIFT_CARD = "0" or CREDIT_CARD = "1"
 */
function validateGiftCardPayment(paymentType) {
  // load cart to check if giftCard applied in cart
  return (dispatch, getState) => {
    const brand = getCurrentBrand(getState());

    return dispatch(cartActions.load(brand)).then(() => {
      // get new state
      const state = getState();
      const { cart } = state;
      const { orderSummary } = cartActions.getCart(state, getCurrentBrand(state));
      const { total, giftCardPayment } = orderSummary;

      // giftCardFlag is a string which can have values either "0" or "1"
      const isGiftCardApplied = parseInt(cart.giftCardFlag, 10);

      // gift card is not applied to the card and payment type is CREDIT_CARD
      // which means we are using a credit alone not mixing with gift card
      if (!isGiftCardApplied && paymentType === CREDIT_CARD) {
        // safe to proceed
        return Promise.resolve();
      }

      if (isGiftCardApplied && paymentType === CREDIT_CARD && total <= giftCardPayment) {
        return dispatch(paymentActions.setPaymentMethod(GIFT_CARD));
      }

      if (
        // Check whether gift card is applied to the cart
        isGiftCardApplied && (
          // when payment type can be "0" (GIFT_CARD) only if total amountin cart is paid
          // using only gift card. When it fails user should be redirected to payment page.
          // [TODO: Revisit and enable this validation]
          // paymentType === GIFT_CARD && (total === giftCardPayment) ||
          paymentType === GIFT_CARD ||

          // mixing credit card and gift card
          paymentType === CREDIT_CARD && (total > giftCardPayment)
        )
      ) {
        return Promise.resolve();
      }

      // why we are here is because of one of the following reasons:
      //  - This is not a credit card only payment (either we are mixing credit card and gift card
      //    OR we are using a gift card alone), but a gift card is NOT applied to the cart.
      //  - Payment type is GIFT_CARD but total cart value is not paid using gift card (this
      //    can happen when user adds new items to cart after setting GIFT_CARD as payment type).
      //  - We are mixing credit card and gift card, but total cart value is less than or equal to
      //    amount applied from gift card (this is NOT allowed because GDS does not update the
      //    payment type automatically when user removes cart items after selecting a payment type).
      dispatch(redirectToPaymentPage());

      return Promise.reject();
    });
  };
}

/**
 * TL;DR:
 *  - Validate payment type against selectable payment methods.
 *  - If payment type is GIFT_CARD, validate it
 *  - If payment type is CREDIT_CARD, check if it is mixed with gift card and then validate it
 *  - If payment type is UQ_STORE validate if there's a store on localstorage
 *  - All of the above fails, take user to payment page
 * @private
 * @param {Object} paymentTypeStatus - an object with key { hasPaymentType: true/false }
 */
function validatePaymentType(paymentTypeStatus) {
  const { hasPaymentType } = paymentTypeStatus;

  return (dispatch, getState) => {
    let paymentSelectableCallStatus = false;
    let creditCardCallStatus = false;

    const paymentSelectableCallFail = () => {
      dispatch(redirectToPaymentPage());

      return Promise.reject();
    };

    const promises = Promise.all([
      dispatch(paymentActions.getPaymentMethodsSelectable()).then(() => {
        paymentSelectableCallStatus = true;

        return this;
      }).catch(() => this),
      dispatch(paymentActions.getCreditCardInfo()).then(() => {
        creditCardCallStatus = true;

        return this;
      }).catch(() => this),
    ]);

    return promises.then(() => {
      if (!paymentSelectableCallStatus) {
        return paymentSelectableCallFail();
      }

      const state = getState();
      const { payment, creditCard: { ccLastFourDigits } } = state;
      const { paymentMethods } = payment;
      const paymentType = getCartPaymentType(state);
      const paymentMethod = payment.paymentMethod || paymentType;
      const isPaymentTypeValid = hasPaymentType && paymentMethods.includes(paymentMethod);

      if (isPaymentTypeValid) {
        // payment type is "0" GIFT_CARD
        if (paymentMethod === GIFT_CARD) {
          // validate it and proceed with checkout
          return dispatch(validateGiftCardPayment(GIFT_CARD));
        }

        // payment type is "B" UQ_STORE
        if (paymentMethod === UQ_STORE) {
          // We need to check if there's a uniqlo store on localstorage
          return dispatch(restoreSelectedStore())
            .then((data) => {
              if (data && data.store) {
                // There's a store saved in this device!
                // Proceed to next validation before getting to order review
                return Promise.resolve();
              }

              // There's no store, we need to send the user to payment page
              return dispatch(paymentSelectableCallFail());
            });
        }

        // payment type is "3" COD or "D" Post pay
        if (paymentMethod === COD || paymentMethod === POST_PAY) {
          // We are safe to contiue with the checkout flow
          return Promise.resolve();
        }

        if (paymentMethod === CREDIT_CARD) {
          // payment type is "1" CREDIT_CARD
          if (!creditCardCallStatus && !ccLastFourDigits) {
            // As payment type is CREDIT_CARD and there is no credit card we should move to payment page
            return dispatch(paymentSelectableCallFail());
          }

          // payment type is "1" CREDIT_CARD, check if it is mixed with gift card.
          // in that case validate gift card payment, otherwise proceed with checkout
          if (creditCardCallStatus) {
            return dispatch(validateGiftCardPayment(CREDIT_CARD));
          }
        }
      } else if (paymentMethod === CREDIT_CARD && paymentMethods.includes(GIFT_CARD)) {
        return dispatch(validateGiftCardPayment(CREDIT_CARD));
      }

      // scenarios to come up to here:
      //  1. doesn't have a payment type (new user or new cart)
      //  2. has a payment type but is NOT selectable
      return dispatch(paymentSelectableCallFail());
    });
  };
}

/**
 * check if user has a shipping address otherwise validates
 * default address and sets it as default shipping address.
 * [TODO] this check can be avoided by checking the state to see if
 * it is already loaded. But as of now, the billing address is not
 * getting saved to state on this API call, instead we have a flag
 * which I found unreliable while testing checkout flow.
 * @private
 */
function checkBillingAddress() {
  return (dispatch, getState) => {
    const globalState = getState();

    if (!globalState.delivery.isBillingAddress) {
      const {
        delivery: { currentShippingAddress },
        userInfo: { userDefaultDetails: defaultAddress },
      } = globalState;

      // check if all required fields of 001 address is available
      if (userInfoActions.isDefaultDetailsComplete(globalState)) {
        return dispatch(deliveryActions.saveAsBillingAddress(defaultAddress));
      }

      // If shipto is already selected, we need to send the user to payment page
      // In there he can add the shipping address.
      if (isAddressComplete(currentShippingAddress)) {
        dispatch(redirectToPaymentPage());
      } else {
        // If there's not a shipping address selected and
        // user has neither billing address nor a valid default address as per above criteria
        dispatch(redirectToDeliveryPage());
      }

      return Promise.reject();
    }

    return Promise.resolve();
  };
}

/**
 * check first_order_flg to redirect user to delviery options page.
 *
 * @param  {String} cartBrand currently selected brand
 */
function checkFirstOrderFlag(cartBrand) {
  return (dispatch, getState) => {
    const getShipToAndBillTo = ignoreResponseFailures([
      dispatch(userInfoActions.loadDefaultDetails()),
    ]);

    return getShipToAndBillTo
      .then(() => {
        const globalState = getState();
        const currentCart = cartBrand && globalState.cart[cartBrand];
        const firstOrderFlag = currentCart && currentCart.firstOrderFlag;
        const { currentShippingAddress, isBillingAddress } = globalState.delivery;

        if (!isAddressComplete(currentShippingAddress) && !isBillingAddress && firstOrderFlag === '1') {
          // let deliveryType = '';

          // if (deliveryTypes && deliveryTypes.length === 1 && deliveryTypes[0] === YAMATO_MAIL) {
          //   deliveryType = YAMATO_MAIL;
          // }

          dispatch(deliveryActions.setAddressToEdit(currentShippingAddress));
          // [TODO] see what happens if we do not supply `deliveryType` for YAMATO_MAIL
          // dispatch(redirectToDeliveryPage(true, deliveryType));
          dispatch(redirectToDeliveryPage(true));

          return Promise.reject();
        }

        return Promise.resolve();
      });
  };
}

/**
 * The method checks whether it's a fresh session or not.
 * @private
 * @returns {Promise}
 */
function checkSessionKeys() {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);
    const checkoutStatus = getCheckoutStatus(globalState);
    const paymentType = globalState.cart[brand].paymentType;

    const giftCardPromise = () => {
      if (globalState.cart[brand].giftCardBrandFlag === positive) {
        return dispatch(giftCardActions.loadGiftCards()).catch((error) => {
          dispatch(giftCardActions.updateFailedGiftCards(error));
        });
      }

      return Promise.resolve();
    };

    const deliveryResetPromise = () => {
      const { currentShippingAddress } = getState().delivery;

      /**
       * `setDeliveryWithDefaultPreferenceIfNeeded` resets the delivery type to null
       * with delivery preference as defaultDeliveryPreference
       */
      return dispatch(deliveryActions.setDeliveryWithDefaultPreferenceIfNeeded(true))
        .then(() => (currentShippingAddress.postalCode ? dispatch(getAndSetShipTo()) : Promise.resolve()))
        .then(() => dispatch(cartActions.bookAndLoadDeliveryOptions(brand)));
    };

    if (checkoutStatus === PAYMENT) {
      return Promise.resolve();
    } else if (checkoutStatus === DELIVERY) {
      const { deliveryPreference, deliveryMethod: shipments } = getState().delivery;
      const isDeliveryTypeNotUQStore = !(
        deliveryPreference === GROUP_DELIVERY &&
        shipments[0].deliveryType === STORE_PICKUP
      );

      return giftCardPromise()
        .then(() => dispatch(checkShippingAddress()))
        .then(() => dispatch(paymentActions.editPaymentSegment(false, !!paymentType)))
        .then(() => dispatch(compareBillingAddress(isDeliveryTypeNotUQStore)))
        .then(() => {
          dispatch(redirectTo(routes.payment));

          return Promise.reject();
        }
      );
    }

    return giftCardPromise()
      .then(() => dispatch(paymentActions.editPaymentSegment(false, !!paymentType)))
      .then(() => deliveryResetPromise())
      .then(() => dispatch(compareBillingAddress(true)))
      .then(() => {
        dispatch(redirectTo(routes.delivery));

        return Promise.reject();
      });
  };
}

/**
 * This thunk is basically does what its name says.
 * Handles both partially added (added but not confirmed)
 * and confirmed gift cards on cart, removes all giftcards
 * and makes the way clear for concierge-fast-checkout.
 * @returns {Promise<*>}
 */
function removeGiftCardsIfAny() {
  return (dispatch, getState) => {
    const state = getState();
    const cart = cartActions.getCart(state, getCurrentBrand(state));
    const { payment: { paymentMethod } } = state;

    // giftCardBrandFlag is a string which can have values either "0" or "1"
    const isGiftCardApplied = cart.giftCardBrandFlag === positive;

    // when payment type is credit-card, it is okay to suspect that
    // a giftcard may be partially added (added but not confirmed).
    if (isGiftCardApplied || paymentMethod === CREDIT_CARD) {
      const cleanupGiftCards = () => {
        // clean up all error messages if any
        dispatch(resetDetailedErrorMessages(['giftCards']));
        dispatch(popAPIErrorMessage('loadGiftCards', true));

        // remove giftcards, parameter avoids loadGiftCards after removal job
        return dispatch(giftCardActions.removeAllGiftCards(true));
      };

      // load giftcards, if none exists skip error handling when API fails
      return dispatch(giftCardActions.loadGiftCards([2107]))
        // if partially added (added but not confirmed), update giftcards in globalState
        .catch(error => dispatch(giftCardActions.updateFailedGiftCards(error)))
        // in either case (partially added OR confirmed gift card),
        // we now have giftcard data at 'globalState.giftCard.giftCards'
        .then(cleanupGiftCards, cleanupGiftCards);
    }

    return Promise.resolve();
  };
}

/**
 * Concierge Fast-forwarded ⏩ checkout
 * If the the email address belongs to a store-staff (example@uniqlo.store)
 * and the store cookie ('concierge_store') with store-id is available,then we set
 * the particular store for payment and pickup, and skip normal checkout flow
 * for a faster order execution.
 * {@link https://www.pivotaltracker.com/story/show/153693392}
 * @returns {Promise<*>}
 */
function checkFastForwardCheckout() {
  return (dispatch, getState) => {
    const conciergeStoreId = reactCookie.load(cookies.conciergeStoreId);

    // If 'concierge_store' cookie is not present, go with normal checkout flow.
    if (!conciergeStoreId) {
      return Promise.resolve();
    }

    const userInfoPromise = userInfoActions.isUserDefaultDetailsLoaded(getState())
      ? Promise.resolve()
      : dispatch(userInfoActions.loadDefaultDetails());

    return userInfoPromise.then(() => {
      const { userInfo: { userDefaultDetails } } = getState();
      const isStoreStaff = isStoreStaffEmail(userDefaultDetails.email);

      // If user is not a store-staff, we go with normal checkout flow.
      if (!isStoreStaff) {
        return Promise.resolve();
      }

      // load store details using store id,
      // then set shipping address and delivery type "11" (store delivery)
      return dispatch(deliveryActions.confirmStorePickupShippingMethod(conciergeStoreId))
        .then(() => dispatch(removeGiftCardsIfAny()))
        .then(() => {
          const state = getState();
          const { deliveryStore: { storeDetail } } = state;
          const brand = getCurrentBrand(state);

          // save store details in localStorage
          dispatch(restoreSelectedStore({ [brand]: storeDetail }));

          return Promise.resolve();
        })
        // check billingAddress, if not present we set user's default address
        .then(() => dispatch(checkBillingAddress()))
        // Set payment type as "B" (store payment)
        // and Fast-forward ⏩ to order review page
        .then(() => dispatch(setUQPaymentAndRedirect()))
        // Skip the normal checkout flow
        .then(() => Promise.reject());
    });
  };
}

/**
 * The method which runs a series of promises and decides whether
 * to take user to delivery page or payment page or review order page
 * @export
 * @param {String} brand
 * @returns {Promise}
 */
export function checkout(brand) {
  return (dispatch, getState) => {
    const resetCheckoutSession = reactCookie.load(`${brand}-${cookies.resetCheckoutSession}`);

    if (resetCheckoutSession) {
      dispatch(removeCookieToResetCheckout(brand));
      dispatch(removeCheckoutStatus(brand));
    }

    // set current brand as a url query
    dispatch(setCurrentBrand(brand));
    dispatch(cartActions.setCallPIBFlag(false));

    dispatch(deliveryActions.resetSplitDetailsLoaded());

    // initiate checkout
    return dispatch(cartActions.bookAndLoadDeliveryOptions(brand))
      .then(() => dispatch(checkFastForwardCheckout()))
      .then(() => dispatch(checkFirstOrderFlag(brand)))
      .then(() => dispatch(compareBillingAddress()))
      .then(() => dispatch(validateDeliveryType()))
      .then(() => dispatch(checkSessionKeys()))
      .then(() => dispatch(checkUserInfo()))
      .then(() => dispatch(checkShippingAddress()))
      .then(() => dispatch(checkBillingAddress()))
      .then(() => dispatch(checkPaymentType()))
      .then(paymentTypeStatus => dispatch(validatePaymentType(paymentTypeStatus)))
      // secure products in cart by calling provisional inventory
      .then(() => (getState().cart.callPIB ? dispatch(cartActions.bookAndLoadDeliveryOptions(brand)) : Promise.resolve()))
      // all is well
      .then(() => {
        dispatch(setCheckoutStatus(PAYMENT));

        return dispatch(redirectTo(routes.reviewOrder));
      })
      // Just to prevent displaying an error on the console :)
      .catch(noop);
  };
}

// Saves a checkout flag to cookie when user not logged in.
export function saveCheckout(brand, flow) {
  const domain = cookies.domain;
  const expires = new Date();

  expires.setTime(expires.getTime() + cookies.checkoutExpires);

  return (dispatch) => {
    if (flow) {
      dispatch(authActions.saveRedirectUrl(getUrlWithQueryData(`${root}/${routes.checkout}`, { brand })));
    }

    // Cookie for entire checkout process
    return dispatch({
      type: SAVE_CHECKOUT,
      cookie: {
        key: cookies.checkoutKey,
        value: brand,
        expires,
        domain,
        path: cookies.checkoutPath,
      },
      brand,
    });
  };
}

// Removes checkout flag from cookie, when checkout flow starts.
export function removeCheckout() {
  const domain = cookies.domain;

  // Removes checkout key if flow === false
  return dispatch => dispatch({
    type: REMOVE_CHECKOUT,
    cookie: {
      key: cookies.checkoutKey,
      remove: true,
      domain,
      path: cookies.checkoutPath,
    },
  });
}

// Get checkout flag from cookie. After redirection to login or continue checkout process
export function getCheckout() {
  const domain = cookies.domain;

  return (dispatch) => {
    // To get checkout cookie to store
    dispatch({
      type: GET_CHECKOUT,
      cookie: {
        key: cookies.checkoutKey,
        domain,
        path: cookies.checkoutPath,
      },
    });
  };
}

/**
 * Get saved in cookies checkout brand
 */
export function getCheckoutBrand(state) {
  return state.cart.checkoutBrand;
}

// For checking cookie is loaded or not
export function isCheckoutCookieLoaded(state) {
  return !!getCheckoutBrand(state);
}

export function checkoutFromCart() {
  return redirectTo(routes.checkout);
}

/**
 * Does some basic API calls that are needed when checkout page is loaded.
 * @param  {Object} store    redux store
 * @param  {Function} getState function that returns present state
 * @return {Promise}          a promise that finishes successfully when all necessary API calls have been made.
 */
export function initializeCheckoutPage({ store: { dispatch, getState } }) {
  const promises = [];
  const globalState = getState();
  const uqCartNumber = cartActions.getCart(globalState, 'uq');
  const guCartNumber = cartActions.getCart(globalState, 'gu');

  // If there's a UQ cart we need to load it!
  if (uqCartNumber.cartNumber && !cartActions.isLoaded(globalState, 'uq')) {
    promises.push(dispatch(cartActions.load('uq')));
  }

  // If there's a GU cart we need to load it!
  if (guCartNumber.cartNumber && !cartActions.isLoaded(globalState, 'gu')) {
    promises.push(dispatch(cartActions.load('gu')));
  }

  promises.push(dispatch(cartActions.checkCartExists()));

  return Promise.all(promises);
}
