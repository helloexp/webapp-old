/**
 *  In this file we are loading all required data to display the review order page.
 */

import { getTranslation } from 'i18n';
import { getCartCouponInformation } from 'redux/modules/membership/coupons';
import { loadGiftCards, toggleContinueButton } from 'redux/modules/checkout/payment/giftCard/actions';
import { getCreditCardInfo, setPaymentMethod, saveBillingAddressLocally } from 'redux/modules/checkout/payment/actions';
import { getPaymentStoreDetails, restoreSelectedStore } from 'redux/modules/checkout/payment/store';
import { fakeBlueGateError, pushAPIErrorMessage, errorRedirect } from 'redux/modules/errorHandler';
import * as cartActions from 'redux/modules/cart';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import * as userInfoActions from 'redux/modules/account/userInfo';
import { initGifting } from 'redux/modules/checkout/gifting/actions';
import { setCheckoutStatus, removeCheckoutStatus } from 'redux/modules/checkout';
import { getTomorrow } from 'utils/formatDate';

import { getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import noop from 'utils/noop';
import { ignoreResponseFailures } from 'utils/requestResponse';
import { isCreditCardSaved } from 'utils/CardValidator/bluegate';
import getSiteConfig from 'config/site';
import { required, isValidCreditCard } from 'utils/validation';
import { routes, routePatterns } from 'utils/urlPatterns';
import {
  isPickupStoreAddress,
  isStorePickupDeliveryType,
} from 'utils/deliveryUtils';

const REDIRECT_TO = 'uniqlo/order/REDIRECT';
const {
  payment: paymentConfig,
  gds: { positive },
  deliveryTypes: { SHIPPING, STORE_PICKUP },
  deliveryPreferences: { SPLIT_DELIVERY },
  defaultSplitNumber,
  NULL_TIMEFRAME,
  pages: { PAYMENT, DELIVERY },
} = getSiteConfig();

/**
 * @private
 * Loads cart if the giftCard is selected as payment type.
 * It's required for getting latest update_date from GET /cart API,
 * Since GDS updates it on Giftcard loading
 */
function loadCartIfGiftCardsExist() {
  return (dispatch, getState) => {
    const state = getState();
    const { cart: { giftCardFlag } } = state;
    const currentBrand = getCurrentBrand(state);

    if (giftCardFlag === positive) {
      return dispatch(cartActions.load(currentBrand));
    }

    return Promise.resolve();
  };
}

// @private
function loadPaymentSelectionAndGiftcards() {
  return (dispatch, getState) => {
    const state = getState();
    const paymentType = state.payment.paymentMethod;

    if (state.cart.giftCardFlag === positive || paymentType === paymentConfig.giftCard) {
      return dispatch(loadGiftCards());
    }

    return Promise.resolve();
  };
}

// @private
// Redirects to delivery page in case delivery method or ship_to is not set.
// Redirects to payment page in case payment type or bill_to is not set.
function handleRedirects() {
  return (dispatch, getState) => {
    const state = getState();
    const brand = getCurrentBrand(state);
    const {
      cart: {
        billingAddress,
        [brand]: {
          shippingAddress,
          paymentType,
        },
      },
      creditCard,
      payment,
      delivery: {
        deliveryMethod,
        deliveryPreference,
      },
      paymentStore: {
        appliedStore,
      },
    } = state;

    const deliveryType = deliveryMethod.length
      && deliveryMethod.find(item => item.splitNo === defaultSplitNumber).deliveryType;

    const shipToExist = shippingAddress
      && shippingAddress.firstName
      && shippingAddress.lastName
      && shippingAddress.prefecture;

    const billToExist = billingAddress
      && billingAddress.firstName
      && billingAddress.lastName
      && billingAddress.prefecture;

    const pickupStoreExist = isPickupStoreAddress(shippingAddress) && isStorePickupDeliveryType(deliveryType);

    // credit card exists if we have a credit card saved OR there is a credit card in memory
    const creditCardExists = isCreditCardSaved(payment.creditInfo) || creditCard.ccLastFourDigits;
    const isSavedCCSelected = (isCreditCardSaved(payment.creditInfo) && payment.creditInfo.selected)
      || (isValidCreditCard(creditCard) && creditCard.selected && creditCard.isSaveThisCard);
    const ccNotApplicable = deliveryPreference === SPLIT_DELIVERY && !isSavedCCSelected;

    if (required(deliveryType) || (required(shipToExist) && required(pickupStoreExist))) {
      dispatch(removeCheckoutStatus());

      dispatch({
        type: REDIRECT_TO,
        redirect: {
          location: getUrlWithQueryData(routes.delivery, { brand }),
        },
      });

      return Promise.reject();
    // go to payment page if:
    // - needs payment type OR
    // - billing addrees is needed OR
    // - payment type is credit card and there is no credit card
    // - payment type is credit card, SplitDelivery is applied and selected card is not registered
    } else if (required(paymentType)
        || required(billToExist)
        || (paymentType === paymentConfig.creditCard
          && (!creditCardExists || ccNotApplicable))
        || (paymentType === paymentConfig.uniqloStore && !appliedStore)
      ) {
      dispatch(setCheckoutStatus(DELIVERY));

      dispatch({
        type: REDIRECT_TO,
        redirect: {
          location: getUrlWithQueryData(routes.payment, { brand }),
        },
      });

      return Promise.reject();
    }

    dispatch(setCheckoutStatus(PAYMENT));

    return Promise.resolve();
  };
}

// @private
// Loads the saved credit card information if payment it's credit card
function loadCreditCardIfNeeded() {
  return (dispatch, getState) => {
    const state = getState();
    const brand = getCurrentBrand(state);
    const {
      cart: {
        [brand]: {
          paymentType,
        },
      },
    } = state;

    if (paymentType === paymentConfig.creditCard) {
      return dispatch(getCreditCardInfo())
        .catch(noop);
    }

    return Promise.resolve();
  };
}

/**
 * @private
 * If the pay at uniqlostore option is selected as payment, then the details of that store need to be loaded, for placing the order.
 */
export function loadUqStoreDetailsIfNeeded() {
  return (dispatch, getState) => {
    const state = getState();
    const brand = getCurrentBrand(state);

    const {
      routing: { locationBeforeTransitions: { pathname } },
      cart: { [brand]: { paymentType } },
    } = state;

    if (paymentType === paymentConfig.uniqloStore || pathname.match(routePatterns.payment)) {
      return dispatch(restoreSelectedStore())
        .then(() => {
          const { paymentStore: { appliedStore } } = state;

          if (appliedStore) {
            return dispatch(getPaymentStoreDetails(appliedStore.id));
          }

          return Promise.resolve();
        });
    }

    return Promise.resolve();
  };
}

// @private
// Loads all required data for review page if it's not already loaded
function loadDataForReviewPage() {
  return (dispatch, getState) => {
    const state = getState();
    const promises = [];
    const brand = getCurrentBrand(state);

    promises.push(dispatch(getCartCouponInformation()));

    const loadDefaultAddressesIfNeeded = () => {
      if (!userInfoActions.isUserDefaultDetailsLoaded(state)) {
        return dispatch(userInfoActions.loadDefaultDetails());
      }

      return Promise.resolve();
    };

    promises.push(loadDefaultAddressesIfNeeded()
      .then(() => {
        const { address: { defaultCity, defaultStreet } } = getTranslation();
        const {
          userInfo: { userDefaultDetails },
          payment: { billingAddress },
          cart: { [brand]: { paymentType } },
          delivery: { deliveryMethod },
        } = getState();
        const isBillAddrWithDummyValues = billingAddress && (
          billingAddress.city === defaultCity ||
          billingAddress.street === defaultStreet ||
          billingAddress.streetNumber === defaultStreet
        );
        const isDelvAndPayBothAtStore = (
          paymentType === paymentConfig.uniqloStore &&
          deliveryMethod[0] && deliveryMethod[0].deliveryType === STORE_PICKUP
        );

        if (isBillAddrWithDummyValues && !isDelvAndPayBothAtStore) {
          return dispatch(deliveryActions.saveAsBillingAddress(userDefaultDetails))
            .then(() => dispatch(saveBillingAddressLocally(userDefaultDetails)))
            .then(() => {
              dispatch({
                type: REDIRECT_TO,
                redirect: {
                  location: getUrlWithQueryData(routes.payment, { brand }),
                },
              });

              return Promise.reject();
            });
        }

        return dispatch(deliveryActions.updateShipToName());
      })
    );

    promises.push(dispatch(loadPaymentSelectionAndGiftcards()));

    dispatch(cartActions.getReceiptStatus(brand));

    return ignoreResponseFailures(promises);
  };
}

/*
* Validates delivery date selected by the user against current delivery_selectable.
* Case 1:
* If the cart was being prepared over a large time span, the initial shippping preference might be outdated.
* Case 2:
* If the user had selected next_day_delivery but then changed his shipping address,
*/
export function verifyShippingDates(state) {
  const { delivery: { deliveryMethod, deliveryMethodList, deliveryPreference } } = state;
  let timeSlotAvailable = true;

  for (let split = 1; split <= deliveryMethod.length; split++) {
    const availableDelivery = deliveryMethodList[split] && deliveryMethodList[split][deliveryPreference];
    const currentDelivery = deliveryMethod
      && deliveryMethod.find(shipment => shipment.splitNo === String(split));

    // this validation is for "shipping" type orders only
    if (currentDelivery && currentDelivery.deliveryType === SHIPPING && availableDelivery) {
      const { deliveryRequestedDateTimes = [] } = availableDelivery;
      const { deliveryReqDate, deliveryReqTime } = currentDelivery;

      // validation is for requested date and time. So proceed only if at least one of them was provided.
      if (deliveryReqDate || deliveryReqTime) {
        // some normalisation before we begin.
        const reqestedDate = deliveryReqDate || NULL_TIMEFRAME;
        const requestedTime = deliveryReqTime;
        const emptyDateSlot = { timeSlots: [] };
        // first check if the date selected by user is available in latest delivery_selectable call.
        const dateSlotAvailable = deliveryRequestedDateTimes.find(dateSlot => dateSlot.date === reqestedDate) || emptyDateSlot;

        // then check if the time specified by user is available in the timeslots array of matched date slot.
        timeSlotAvailable = dateSlotAvailable.timeSlots.find(timeSlot => timeSlot === requestedTime);

        if (!timeSlotAvailable) {
          break;
        }
      }
    }
  }

  return timeSlotAvailable;
}

export function isNextDayInvalid(state) {
  const deliveryMethod = state.delivery.deliveryMethod[0];
  const tomorrow = getTomorrow();
  const isGiftApplied = state.cart.cartGift && state.cart.cartGift.id;

  return deliveryMethod.deliveryReqDate === tomorrow && isGiftApplied;
}

/**
 * we Need to check availability of the shipping_date_prefernce and reset if needed.
 * If date is not valid reset delivery and save shipping address with defailt address zipcode.
 */
export function verifyShippingDatesAndResetIfNeeded() {
  return (dispatch, getState) => {
    const state = getState();
    const brand = getCurrentBrand(state);
    const timeSlotAvailable = verifyShippingDates(state);

    // if time slot was not found, then the delivery information of this cart is outdated. Send the user back to delivery page.
    if (!timeSlotAvailable) {
      // call userinfo and addresses needed to select default zipcode of user.
      // setDeliveryWithDefaultPreferenceIfNeeded() resets delivery type to null
      // and delivery preference to default to default value
      ignoreResponseFailures([
        dispatch(userInfoActions.loadAllAddressesIfNeeded()),
        dispatch(deliveryActions.setDeliveryWithDefaultPreferenceIfNeeded(true)),
      ])
      // If user has selected COD or UQ_STORE payment method, reset it so all delivery options will be shown in delivery page.
      .then(() => {
        if ([paymentConfig.uniqloStore, paymentConfig.cashOnDelivery].includes(state.payment.paymentMethod)) {
          return dispatch(setPaymentMethod(''));
        }

        return Promise.resolve();
      })
      // find out default zipcode, save the ship_to and call PIB
      .then(() => dispatch(deliveryActions.getDefaultShippingAddressAndSavePostalCodeToShipTo()))
      // load delivery_selectable freshly
      .then(() => dispatch(deliveryActions.loadDeliveryMethodOptions()))
      // go to delivery page after setting appropriate error message
      .then(() => {
        const { giftError, datePastErrorMessage } = getTranslation().delivery;

        if (isNextDayInvalid(state)) {
          return dispatch(pushAPIErrorMessage(giftError, 'saveGiftMessage'));
        }

        return dispatch(pushAPIErrorMessage(datePastErrorMessage, 'setDeliveryType'));
      })
      .then(() => dispatch(errorRedirect(getUrlWithQueryData(routes.delivery, { brand }))));

      return Promise.reject();
    }

    return Promise.resolve();
  };
}

const simultaneousLoad = (dispatch, getState) => {
  initGifting(dispatch, getState);
  dispatch(restoreSelectedStore());
};

export function initializeOrderReviewPage(dispatchRef, getState) {
  const state = getState();
  const currentBrand = getCurrentBrand(state);
  const resultCode = state.routing.locationBeforeTransitions.query.resultCode;

  simultaneousLoad(dispatchRef, getState);

  return dispatch => dispatch(cartActions.load(currentBrand))
    .then(() => dispatch(deliveryActions.loadDeliveryMethod()).catch(noop))
    .then((result = {}) => (!deliveryActions.isSplitDetailsLoaded(state) && result.split_div === SPLIT_DELIVERY
      ? dispatch(deliveryActions.loadSplitDetails()).catch(noop)
      : Promise.resolve()))
    .then(() => Promise.all([
      dispatch(deliveryActions.setSelectedDeliveryType()),
      dispatch(loadCreditCardIfNeeded()),
      dispatch(loadUqStoreDetailsIfNeeded()),
    ]))
    .then(() => (!deliveryActions.isDeliveryMethodOptionsLoaded(state)
      ? dispatch(deliveryActions.loadDeliveryMethodOptions())
      : Promise.resolve()))
    .then(() => dispatch(handleRedirects()))
    .then(() => dispatch(loadDataForReviewPage()))
    .then(() => dispatch(verifyShippingDatesAndResetIfNeeded()))
    .then(() => dispatch(loadCartIfGiftCardsExist()))
    .then(() => {
      // dispatching with true value to reset state of giftcard continue button after page load
      dispatch(toggleContinueButton(true));

      if (resultCode) {
        return dispatchRef(fakeBlueGateError(resultCode));
      }

      return Promise.resolve();
    });
}
