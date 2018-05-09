/**
 *  Initializes the delivery page.
 */

import { ignoreResponseFailures } from 'utils/requestResponse';
import noop from 'utils/noop';
import { getCurrentBrand } from 'utils/routing';
import { getCurrentPickupStoreId } from 'redux/modules/account/address';
import { getStoreDetails } from 'redux/modules/checkout/delivery/store/actions';
import { isGiftBagsLoaded, isMessageCardsLoaded } from 'redux/modules/checkout/gifting/selectors';
import {
  fetchGiftBags,
  isGiftBagAmountsLoaded,
  fetchGiftBagAmounts,
  fetchMessageCards,
  isMessageCardAmountsLoaded,
  fetchMessageCardAmounts,
} from 'redux/modules/checkout/gifting/actions';
import { verifyShippingDates, isNextDayInvalid } from 'redux/modules/checkout/order/initialize';
import {
  isUserDefaultDetailsLoaded,
  loadDefaultDetails,
  isDefaultDetailsComplete,
  isAllUserInfoAddressesLoaded,
  loadAllUserInfoAddresses,
} from 'redux/modules/account/userInfo';
import { setPaymentMethod } from 'redux/modules/checkout/payment/actions';
import { isAddressComplete, getCart, load } from 'redux/modules/cart';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import { pushAPIErrorMessage } from 'redux/modules/errorHandler';
import { deliveryTypes, brandName, payment } from 'config/site/default';
import { getTranslation } from 'i18n';

export function loadRequiredData() {
  return (dispatch, getState) => {
    const state = getState();
    const promises = [];
    const isNewUser = !isDefaultDetailsComplete(state) &&
                      !isAddressComplete(state.delivery.currentShippingAddress);
    const currentUQStoreId = getCurrentPickupStoreId(state);

    const loadDeliveryOptionsStoreAndSplitDetails = () => {
      const verifyDatesAndPushErrorIfNeeded = () => {
        const timeSlotAvailable = verifyShippingDates(getState());

        if (!timeSlotAvailable) {
          return dispatch(deliveryActions.setDeliveryWithDefaultPreferenceIfNeeded(true))
            // If user has selected COD or UQ_STORE payment method, reset it so all delivery options will be shown in delivery page.
            .then(() => {
              if ([payment.uniqloStore, payment.cashOnDelivery].includes(state.payment.paymentMethod)) {
                return dispatch(setPaymentMethod(''));
              }

              return Promise.resolve();
            })
            // find out default zipcode, save the ship_to and call PIB
            .then(() => dispatch(deliveryActions.getDefaultShippingAddressAndSavePostalCodeToShipTo()))
            // load delivery_selectable freshly
            .then(() => dispatch(deliveryActions.loadDeliveryMethodOptions()))
            // set appropriate error message
            .then(() => {
              const { giftError, datePastErrorMessage } = getTranslation().delivery;

              if (isNextDayInvalid(state)) {
                return dispatch(pushAPIErrorMessage(giftError, 'setDeliveryType'));
              }

              return dispatch(pushAPIErrorMessage(datePastErrorMessage, 'setDeliveryType'));
            });
        }

        return Promise.resolve();
      };

      const loadSplitItemsDetails = () => {
        const { isSplitDeliveryAvailable } = getState().delivery;

        if (
          !deliveryActions.isSplitDetailsLoaded(state) &&
          isSplitDeliveryAvailable
        ) {
          return dispatch(deliveryActions.loadSplitDetails());
        }

        return Promise.resolve();
      };

      const uqStoreDetailLoadPromise = () => {
        const eligibleMethods = getState().delivery.deliveryTypes || [];

        if (currentUQStoreId && eligibleMethods.includes(deliveryTypes.STORE_PICKUP)) {
          return dispatch(getStoreDetails(parseInt(currentUQStoreId, 10) || 0));
        }

        return Promise.resolve();
      };

      return verifyDatesAndPushErrorIfNeeded()
        .then(() => Promise.all([
          uqStoreDetailLoadPromise(),
          loadSplitItemsDetails(),
        ]));
    };

    promises.push(loadDeliveryOptionsStoreAndSplitDetails());

    if (!deliveryActions.isDeliveryChargesLoaded(state)) {
      promises.push(dispatch(deliveryActions.loadDeliveryCharges()));
    }

    if (!deliveryActions.isSameDayDeliveryChargesLoaded(state)) {
      promises.push(dispatch(deliveryActions.loadSameDayDeliveryCharges()));
    }

    if (isNewUser && state.cart.selectedDeliveryType === 'none') {
      dispatch(deliveryActions.setLocalDeliveryMethodTypeAndSelection());
    }

    if (!isGiftBagsLoaded(state)) {
      promises.push(dispatch(fetchGiftBags()));
    }

    if (!isGiftBagAmountsLoaded(state)) {
      promises.push(dispatch(fetchGiftBagAmounts()));
    }

    if (!isMessageCardsLoaded(state)) {
      promises.push(dispatch(fetchMessageCards()));
    }

    if (!isMessageCardAmountsLoaded(state)) {
      promises.push(dispatch(fetchMessageCardAmounts()));
    }

    return ignoreResponseFailures(promises);
  };
}

export function initializeDeliveryPage({ store: { dispatch, getState } }) {
  const promises = [];
  const globalState = getState();
  const {
    routing: { locationBeforeTransitions: location },
    delivery: { methodLoadFailed: isDeliveryMethodLoadFailed },
  } = globalState;
  const uqCartNumber = getCart(globalState, brandName.uq);
  const guCartNumber = getCart(globalState, brandName.gu);
  const currentBrand = getCurrentBrand(globalState);

  if (!isUserDefaultDetailsLoaded(globalState)) {
    promises.push(dispatch(loadDefaultDetails()));
  }

  if (!isAllUserInfoAddressesLoaded(globalState)) {
    promises.push(dispatch(loadAllUserInfoAddresses()).catch(noop));
  }

  const deliveryOptionsLoadPromise = () => {
    if (!deliveryActions.isDeliveryMethodOptionsLoaded(globalState)) {
      return dispatch(deliveryActions.loadDeliveryMethodOptions());
    }

    return Promise.resolve();
  };

  // If there's a UQ cart we need to load it!
  if (uqCartNumber.cartNumber && currentBrand === brandName.uq) {
    promises.push(
      dispatch(load(brandName.uq))
      .then(deliveryOptionsLoadPromise)
      .then(() => (isDeliveryMethodLoadFailed
        ? Promise.resolve()
        : dispatch(deliveryActions.loadDeliveryMethod()).catch(noop))
      )
      .then(() => dispatch(deliveryActions.loadSelectedDeliveryType(location)))
    );
  }

  // If there's a GU cart we need to load it!
  if (guCartNumber.cartNumber && currentBrand === brandName.gu) {
    promises.push(
      dispatch(load(brandName.gu))
      .then(deliveryOptionsLoadPromise)
      .then(() => (isDeliveryMethodLoadFailed
        ? Promise.resolve()
        : dispatch(deliveryActions.loadDeliveryMethod()).catch(noop))
      )
      .then(() => dispatch(deliveryActions.loadSelectedDeliveryType(location)))
    );
  }

  return ignoreResponseFailures(promises)
    .then(() => dispatch(loadRequiredData()));
}
