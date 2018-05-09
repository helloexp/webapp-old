/**
 *  Payment page initialization
 */
import reactCookie from 'react-cookie';
import {
  isUserDefaultDetailsLoaded,
  loadDefaultDetails,
  loadAllUserInfoAddresses,
  isAllUserInfoAddressesLoaded,
  isDefaultDetailsComplete,
} from 'redux/modules/account/userInfo';
import { ignoreResponseFailures } from 'utils/requestResponse';
import * as cartActions from 'redux/modules/cart';
import { setCheckoutStatus } from 'redux/modules/checkout';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import * as giftActions from 'redux/modules/checkout/gifting/actions';
import * as giftCardActions from 'redux/modules/checkout/payment/giftCard/actions';
import * as paymentActions from 'redux/modules/checkout/payment/actions';
import { fakeBlueGateError, pushAPIErrorMessage } from 'redux/modules/errorHandler';
import { getCartCouponInformation } from 'redux/modules/membership/coupons';
import constants from 'config/site/default';
import config from 'config';
import { getTranslation } from 'i18n';
import noop from 'utils/noop';
import { getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { isCreditCardSaved } from 'utils/CardValidator/bluegate';
import { getOrderSummary } from 'redux/modules/checkout/order/selectors';
import { getCartPaymentType } from 'redux/modules/cart/selectors';
import {
  restoreSelectedStore,
  getPaymentStoreDetails,
  saveCheckInStoreCode,
  restoreCheckInStoreCode,
} from 'redux/modules/checkout/payment/store';

import { loadUqStoreDetailsIfNeeded } from 'redux/modules/checkout/order/initialize';
import { isGiftBagsLoaded, isMessageCardsLoaded } from 'redux/modules/checkout/gifting/selectors';
import { getPaymentMethods } from 'redux/modules/checkout/payment/selectors';
import { checkUQNativeApp, checkGUNativeApp, getStoreNumberFromStoreMode } from 'helpers/NativeAppHelper';

const REDIRECT_TO_REVIEW = 'uniqlo/payment/REDIRECT_REVIEW';
const REDIRECT_TO_DELIVERY = 'uniqlo/payment/REDIRECT_TO_DELIVERY';
const ADD_BRAND_TO_PAYMENT = 'uniqlo/payment/ADD_BRAND_TO_PAYMENT';
const { cookies } = config.app;
const {
  cvsStoreNames: [SEVEN_ELEVEN_CVS, FAMILY_MART_CVS, LAWSON_CVS],
  deliveryTypes: { STORE_PICKUP },
  deliveryPreferences: { SPLIT_DELIVERY },
  pages: { PAYMENT, DELIVERY },
  payment: { creditCard, giftCard },
} = constants;

/**
 * Checks if there is a saved UQ store.
 * If there is none, checks if this is native app.
 * If this is native app, tries to get store id from native app.
 * Native app returns store id if the user is in in-store mode.
 * Get the store details from getStoreDetail API and set it in paymentStoreDetail key.
 * Set that store as applied store.
 *
 * @private
 */
function setStoreDetailsFromNativeApp() {
  return (dispatch, getState) => {
    const state = getState();
    const { paymentStore: { appliedStore } } = state;
    const currentBrand = getCurrentBrand(state);

    // all this works only if this is native application
    if (!checkUQNativeApp() && !checkGUNativeApp()) {
      return Promise.resolve();
    }

    return dispatch(restoreCheckInStoreCode())
      .then(() => getStoreNumberFromStoreMode())
      .then((storeid) => {
        const { paymentStore: { lastCheckInStore } } = getState();

        if (storeid && storeid !== lastCheckInStore) {
          dispatch(saveCheckInStoreCode(storeid));
        }
        // if native app didn't return a store id for some reason,
        // or user has already chosen a store other than check_in_store, continue without doing anything extra
        if (!storeid || appliedStore && (appliedStore.id === storeid || storeid === lastCheckInStore)) {
          return Promise.resolve();
        }

        return dispatch(getPaymentStoreDetails(storeid))
          .then(() => {
            const { paymentStore: { paymentStoreDetail } } = getState();

            if (paymentStoreDetail && paymentStoreDetail.storeDeliveryFlag) {
              return dispatch(restoreSelectedStore({ [currentBrand]: paymentStoreDetail }));
            }

            return Promise.resolve();
          }).catch(noop);
      });
  };
}

// @private
function loadRestOfTheData() {
  return (dispatch, getState) => {
    const state = getState();
    const currentBrand = getCurrentBrand(state);
    const cart = cartActions.getCart(state, currentBrand);
    const promises = [];

    // load stored payment store option
    promises.push(
      dispatch(restoreSelectedStore())
      .then(() => dispatch(setStoreDetailsFromNativeApp()))
      .then(() => dispatch(loadUqStoreDetailsIfNeeded()))
    );

    const loadDeliveryDetailsIfNeeded = () => Promise.all([
      deliveryActions.isDeliveryMethodOptionsLoaded(state)
        ? Promise.resolve()
        : dispatch(deliveryActions.loadDeliveryMethodOptions()),
      deliveryActions.isDeliveryMethodLoaded(getState())
        ? Promise.resolve()
        : dispatch(deliveryActions.loadDeliveryMethod()).catch(noop),
    ]);

    // load available delivery options and validate pick up related details
    promises.push(
      loadDeliveryDetailsIfNeeded()
      .then(() => dispatch(paymentActions.checkDeliveryDetails(currentBrand)))
    );

    const loadBillingAndDefaultAddresses = () => {
      const addressPromises = [];

      // For Credit & Gift I want to take address from User info API
      if (!isUserDefaultDetailsLoaded(state)) {
        addressPromises.push(dispatch(loadDefaultDetails()));
      }
      addressPromises.push(dispatch(paymentActions.fetchBillingAddress()));

      return ignoreResponseFailures(addressPromises);
    };

    promises.push(loadBillingAndDefaultAddresses()
      .then(() => {
        const currentState = getState();
        const { address: { defaultCity, defaultStreet } } = getTranslation();
        const { userInfo: { userDefaultDetails }, payment: { billingAddress }, delivery: { deliveryMethod } } = currentState;
        const isBillAddrWithDummyValues = billingAddress && (
          billingAddress.city === defaultCity ||
          billingAddress.street === defaultStreet ||
          billingAddress.streetNumber === defaultStreet
        );
        const isPickupStoredelivery = deliveryMethod[0] && deliveryMethod[0].deliveryType === STORE_PICKUP;

        // Save billing address when user has complete 001 address.
        if ((paymentActions.isBillingAddressIncompleted(billingAddress)
          && isDefaultDetailsComplete(currentState))
          // If user has dummy values in billing address but the delivery type is not STORE_PICKUP, then reset billingAddress with 001.
          || (isBillAddrWithDummyValues && !isPickupStoredelivery)) {
          return dispatch(deliveryActions.saveAsBillingAddress(userDefaultDetails))
            // If user has dummy values like sevenEleven, UniqloStore in the ship_to, then update it with 001.
            .then(() => dispatch(deliveryActions.updateShipToName()))
            .then(() => dispatch(paymentActions.saveBillingAddressLocally(userDefaultDetails)));
        } else if (isDefaultDetailsComplete(currentState)) {
          return dispatch(deliveryActions.updateShipToName());
        }

        return Promise.resolve();
      })
    );
    promises.push(dispatch(paymentActions.getPaymentMethodsSelectable())
    .then(() => {
      const isGiftCardAvailable = getPaymentMethods(getState()).some(method => (method === giftCard || method === creditCard));

      if (isGiftCardAvailable) {
        promises.push(dispatch(giftCardActions.loadGiftCards()).catch((error) => {
          dispatch(giftCardActions.updateFailedGiftCards(error));
        }));
      }
    }));

    // For Credit & Gift I want to take address from User info API
    if (!isUserDefaultDetailsLoaded(state)) {
      promises.push(dispatch(loadDefaultDetails()));
    }

    // New user having an address in address book (even if he doesn't has 001) can choose
    // payment type UQ store. So we are loading address book to see if any address available
    if (!isAllUserInfoAddressesLoaded(state)) {
      promises.push(dispatch(loadAllUserInfoAddresses()));
    }

    if (!isMessageCardsLoaded(state)) {
      promises.push(dispatch(giftActions.fetchMessageCards()));
    }

    if (!giftActions.isGiftBagAmountsLoaded(state)) {
      promises.push(dispatch(giftActions.fetchGiftBagAmounts()));
    }

    if (!giftActions.isMessageCardAmountsLoaded(state)) {
      promises.push(dispatch(giftActions.fetchMessageCardAmounts()));
    }

    // Get the details of the coupon in the cart
    promises.push(dispatch(getCartCouponInformation()));

    if (!isGiftBagsLoaded(state)) {
      promises.push(dispatch(giftActions.fetchGiftBags()));
    }

    // Load the current payment method selected
    if (!state.payment.paymentMethod && cart.paymentType) {
      promises.push(dispatch(paymentActions.setLocalPaymentMethod(cart.paymentType)));
    }

    // Load credit card if not loaded already
    if (!state.payment.creditInfo || !state.payment.creditInfo.dbKey) {
      promises.push(dispatch(paymentActions.getCreditCardInfo()));
    }

    return ignoreResponseFailures(promises);
  };
}

// @private
function loadCart() {
  return (dispatch, getState) => {
    const state = getState();
    const currentBrand = getCurrentBrand(state);

    return dispatch(cartActions.load(currentBrand));
  };
}

// @private
// Shows payment page if:
// - There's not payment method selected,
// - Payment type it's creditcard but it does NOT have a credit card on bluegate
function handleRedirect() {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);
    const { payment } = globalState;

    if (!payment.paymentMethod || (payment.paymentMethod === creditCard && !isCreditCardSaved(payment.creditInfo))) {
      return Promise.resolve();
    }

    dispatch(setCheckoutStatus(PAYMENT));
    dispatch({
      type: REDIRECT_TO_REVIEW,
      redirect: {
        location: getUrlWithQueryData(routes.reviewOrder, { brand }),
      },
    });

    // If redirecting, avoid calling the rest of the APIs
    return Promise.reject();
  };
}

// @private
function loadCurrentPayment() {
  return (dispatch, getState) => {
    const promises = [];
    const globalState = getState();
    const paymentType = getCartPaymentType(globalState);

    if (paymentType) {
      promises.push(dispatch(paymentActions.setLocalPaymentMethod(paymentType)));
    }

    // Try to load the saved credit card from bluegate
    promises.push(dispatch(paymentActions.getCreditCardInfo()));

    return ignoreResponseFailures(promises);
  };
}

// @private
// This action checks if user payment is giftcard only
// and if the price has changed.
function checkGiftCardsAmount() {
  return (dispatch, getState) => {
    const globalState = getState();
    const orderSummary = getOrderSummary(globalState, { fromCheckout: true }) || {};
    const paymentType = getCartPaymentType(globalState);
    const { giftCardPayment, total } = orderSummary;

    // If payment type selected is giftcards only and
    // If giftcard payment is greater than total, we need to show an error message
    // to ask the user to update the current giftcards
    if (giftCardPayment && total) {
      if ((giftCardPayment > total) || (giftCardPayment < total && paymentType !== creditCard)) {
        return dispatch(pushAPIErrorMessage(getTranslation().reviewOrder.pleaseChangeThePayment, 'updateGiftCard'));
      }
    }

    if (paymentType === giftCard && total < giftCardPayment) {
      return dispatch(pushAPIErrorMessage(getTranslation().payment.updateGiftCards, 'updateGiftCard'));
    }

    return Promise.resolve();
  };
}

function loadAllData() {
  return (dispatch, getState) => {
    const globalState = getState();

    return dispatch(loadCart())
      .then(() => dispatch(checkGiftCardsAmount()))
      .then(() => dispatch(deliveryActions.loadDeliveryMethod()).catch(noop))
      .then((result = {}) => (!deliveryActions.isSplitDetailsLoaded(globalState) && result.split_div === SPLIT_DELIVERY
        ? dispatch(deliveryActions.loadSplitDetails()).catch(noop)
        : Promise.resolve()))
      .then(() => dispatch(loadRestOfTheData()));
  };
}

// @private
// Used when user does not have valid delivery address.
function handleRedirectToDelivery() {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);

    dispatch({
      type: REDIRECT_TO_DELIVERY,
      redirect: {
        location: getUrlWithQueryData(routes.delivery, { brand }),
      },
    });

    // If redirecting, avoid calling the rest of the APIs
    return Promise.reject();
  };
}

// @private
// Save cvs account and ship_to
function handleCVSDelivery(queryparam, cvsBrand) {
  return dispatch => dispatch(deliveryActions.setCvsShipToAccount(cvsBrand, queryparam))
    .then(() => dispatch(loadCart()), () => dispatch(handleRedirectToDelivery()))
    .then(() => dispatch(setCheckoutStatus(DELIVERY)))
    .then(() => dispatch(loadCurrentPayment()))
    .then(() => dispatch(handleRedirect()))
    .then(() => dispatch(loadRestOfTheData()));
}

export function initializePaymentPage(params) {
  return (dispatch, getState) => {
    const state = getState();
    const { routing: { locationBeforeTransitions: location } } = state;

    // we should always have a brand parameter for payment page.
    // in cases where there isn't one, we should check for existence of checkout flow cookie and supply the brand parameter from there.
    const brandPresent = location.query && location.query.brand && ['uq', 'gu'].includes(location.query.brand);
    const checkoutBrand = reactCookie.load(cookies.checkoutKey);

    if (!brandPresent && checkoutBrand) {
      return dispatch({
        type: ADD_BRAND_TO_PAYMENT,
        redirect: {
          location: getUrlWithQueryData(routes.payment, { ...location.query, brand: checkoutBrand }),
        },
      });
    }

    if (location.query) {
      const queryparam = { ...location.query, ...params };
      const resultCode = location.query.resultCode;

      if (location.query.X_finish_arg && location.query.X_mise_no) {
        return dispatch(handleCVSDelivery(queryparam, SEVEN_ELEVEN_CVS));
      } else if (location.query.fmshop_id && location.query.status) {
        return dispatch(handleCVSDelivery(queryparam, FAMILY_MART_CVS));
      } else if (location.query.name1) {
        return dispatch(handleCVSDelivery(queryparam, LAWSON_CVS));
      } else if (location.search && !(['?brand=uq', '?brand=gu'].includes(location.search)) && !resultCode) {
        // User needs to be redirected to the delivery page if other convenience store does not return the required fields for setting shipping address
        return dispatch(handleRedirectToDelivery());
      }

      if (resultCode) {
        return dispatch(loadAllData())
          .then(() => dispatch(fakeBlueGateError(resultCode)));
      }
    }

    dispatch(deliveryActions.setSelectedDeliveryType());

    return dispatch(loadAllData());
  };
}
