import { constantsGenerator } from 'utils';
import { paymentApi, deliveryApi, apiTypes } from 'config/api';
import { getCart, load } from 'redux/modules/cart';
import { setCheckoutStatus } from 'redux/modules/checkout';
import { saveAsBillingAddress, removeDeliverySelected, toggleDeliveryEdit, updateShipToName, getPrefectureWithZipcode } from 'redux/modules/checkout/delivery';
import { removeAllGiftCards, resetGiftCards } from 'redux/modules/checkout/payment/giftCard/actions';
import { editMemberAddress, loadDefaultDetails, updateDefaultAddressAndDeleteDuplicate, resetLoadAddressCheck } from 'redux/modules/account/userInfo';
import { verifyShippingDatesAndResetIfNeeded } from 'redux/modules/checkout/order/initialize';
import { redirect, replaceUrlParams, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import constants from 'config/site/default';
import { getTranslation } from 'i18n';
import { isPickupStoreAddress, isCVSAddress, isCVSDeliveryType, isShippingDeliveryType, isUserDefaultAddressComplete } from 'utils/deliveryUtils';

const { deliveryTypes: { STORE_PICKUP }, payment: { cashOnDelivery }, pages: { PAYMENT, DELIVERY } } = constants;
const generateConstants = constantsGenerator('payment');

const { LOAD_BILLING_ADDRESS, LOAD_BILLING_ADDRESS_SUCCESS, LOAD_BILLING_ADDRESS_FAIL } = generateConstants('LOAD_BILLING_ADDRESS');
const { SET_PAYMENT_METHOD, SET_PAYMENT_METHOD_SUCCESS, SET_PAYMENT_METHOD_FAIL } = generateConstants('SET_PAYMENT_METHOD');
const { PAYMENT_METHOD_SELECTABLE, PAYMENT_METHOD_SELECTABLE_SUCCESS, PAYMENT_METHOD_SELECTABLE_FAIL } = generateConstants('PAYMENT_METHOD_SELECTABLE');
const { GET_CREDIT_CARD, GET_CREDIT_CARD_SUCCESS, GET_CREDIT_CARD_FAIL } = generateConstants('GET_CREDIT_CARD');
const { GET_PAYMENT_TYPE, GET_PAYMENT_TYPE_SUCCESS, GET_PAYMENT_TYPE_FAIL } = generateConstants('GET_PAYMENT_TYPE');
const REDIRECT_TO_DELIVERY = 'payment/REDIRECT_TO_DELIVERY';

export const SET_METHOD_PAYMENT = 'uniqlo/checkout/PAYMENT/SET_METHOD_PAYMENT';
export const SET_CREDIT_CARD_FIELD = 'PAY/SET_CREDIT_CARD_FIELD';
export const RESET_CREDIT_CARD = 'PAY/RESET_CREDIT_CARD';
export const SET_BILLING_ADDRESS_RESULT = 'PAY/SET_BILLING_ADDRESS_RESULT';
export const RESET_BILLING_ADDRESS = 'PAY/RESET_BILLING_ADDRESS';
export const SET_BILLING_ADDRESS_FIELD = 'PAY/SET_BILLING_ADDRESS_FIELD';
export const TOGGLE_EDIT_ADDRESS = 'PAY/TOGGLE_EDIT_ADDRESS';
export const TOGGLE_EDIT_CONFIRM_BOX = 'PAY/TOGGLE_EDIT_CONFIRM_BOX';
export const TOGGLE_UQ_STORE_CONFIRM_BOX = 'PAY/TOGGLE_UQ_CONFIRM_BOX';
export const TOGGLE_POSTPAY_CONFIRM_BOX = 'PAY/TOGGLE_POSTPAY_CONFIRM_BOX';

export {
  LOAD_BILLING_ADDRESS_SUCCESS,
  LOAD_BILLING_ADDRESS_FAIL,
  SET_PAYMENT_METHOD_SUCCESS,
  SET_PAYMENT_METHOD_FAIL,
  PAYMENT_METHOD_SELECTABLE_SUCCESS,
  PAYMENT_METHOD_SELECTABLE_FAIL,
  GET_CREDIT_CARD_SUCCESS,
  GET_CREDIT_CARD_FAIL,
  GET_PAYMENT_TYPE_SUCCESS,
  GET_PAYMENT_TYPE_FAIL,
};

const promiseConfig = {
  host: paymentApi.apiHost,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};

const promiseConfigPUT = {
  ...promiseConfig,
  host: paymentApi.apiHostPut,
};

const errorHandler = { apiType: apiTypes.GDS, enableReaction: true, showMessage: true };

export function isBillingAddressLoaded(globalState) {
  return globalState.payment && globalState.payment.billingAddress;
}

export function isBillingAddressIncompleted(billingAddress = {}) {
  return !(
    billingAddress.lastName &&
    billingAddress.firstName &&
    billingAddress.postalCode &&
    billingAddress.prefecture &&
    (billingAddress.street || billingAddress.streetNumber) &&
    billingAddress.phoneNumber &&
    billingAddress.email
  );
}

export function setBillingSelectedAddress(address) {
  return {
    type: SET_BILLING_ADDRESS_RESULT,
    address,
  };
}

export function resetBillingAddress() {
  return {
    type: RESET_BILLING_ADDRESS,
  };
}

export function resetCreditCard() {
  return {
    type: RESET_CREDIT_CARD,
  };
}

export function setCreditCard(name, value) {
  return {
    type: SET_CREDIT_CARD_FIELD,
    name,
    value,
  };
}

/**
 * Fetch the billing address for the current cart
 */
export function fetchBillingAddress() {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = getCart(globalState, getCurrentBrand(globalState));

    return dispatch({
      types: [LOAD_BILLING_ADDRESS, LOAD_BILLING_ADDRESS_SUCCESS, LOAD_BILLING_ADDRESS_FAIL],
      promise: (client, brand) => client.get(deliveryApi.billingAddress, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        params: {
          client_id: deliveryApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'getBillingAddress' },
    });
  };
}

export function toggleEditAddress() {
  return {
    type: TOGGLE_EDIT_ADDRESS,
  };
}

export function setBillingAddress(name, value) {
  return {
    type: SET_BILLING_ADDRESS_FIELD,
    name,
    value,
  };
}

export function resetPaymentMethod() {
  return {
    type: SET_METHOD_PAYMENT,
    paymentType: '',
  };
}

/**
 * Method to save billingAddress to cart and payment reducer.
 * @public
 * @param {Object} billingAddress - billing address to be saved in state
 * @return {Promise} Return a promise
 **/
export function saveBillingAddressLocally(billingAddress) {
  return {
    type: LOAD_BILLING_ADDRESS_SUCCESS,
    noMapping: true,
    billingAddress,
  };
}

/**
 * This action requests the list of available payment selection.
 */
export function getPaymentMethodsSelectable() {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = getCart(globalState, getCurrentBrand(globalState));

    return dispatch({
      types: [PAYMENT_METHOD_SELECTABLE, PAYMENT_METHOD_SELECTABLE_SUCCESS, PAYMENT_METHOD_SELECTABLE_FAIL],
      promise: (client, brand) => client.get(paymentApi.paymentSelectable, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        params: {
          client_id: paymentApi.client_id,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'loadPaymentOptions' },
    });
  };
}

/**
 * Set the payment type only on clientside, mainly because we can't
 * set the type on API until we add the first giftcard.
 */
export function setLocalPaymentMethod(paymentType = '') {
  return {
    type: SET_METHOD_PAYMENT,
    paymentType,
  };
}

/**
 * Set the payment type on GDS. This method usually gets called
 * after user has confirmed a payment type.
 */
export function setPaymentMethod(paymentType, name) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = getCart(globalState, getCurrentBrand(globalState));
    let params = {
      client_id: paymentApi.client_id,
      cart_no: cart.cartNumber,
      token: cart.token,
      payment_type: paymentType,
    };

    if (paymentType === constants.payment.uniqloStore) {
      params = {
        ...params,
      };
    }

    return dispatch({
      types: [SET_PAYMENT_METHOD, SET_PAYMENT_METHOD_SUCCESS, SET_PAYMENT_METHOD_FAIL],
      promise: (client, brand) => client.post(paymentApi.payment, {
        ...promiseConfigPUT,
        host: replaceUrlParams(promiseConfigPUT.host, { brand }),
        params,
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'setPaymentMethod' },
      paymentType,
      name,
    });
  };
}

export function getCreditCardInfo() {
  return {
    types: [GET_CREDIT_CARD, GET_CREDIT_CARD_SUCCESS, GET_CREDIT_CARD_FAIL],
    promise: (client, brand) => client.get(paymentApi.creditCardInfo, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params: {
        client_id: paymentApi.client_id,
      },
    }),
    errorHandler: { ...errorHandler, showMessage: false },
  };
}

export function payByCODOrStore(billing, paymentType, isGiftCardAvailable, billingAddressForNewUser, isNewUserStoresSelection) {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);
    const { address: { defaultPrefecture, defaultCity, defaultStreet } } = getTranslation();

    const giftPromise = () => (isGiftCardAvailable
      ? dispatch(removeAllGiftCards())
      : Promise.resolve()
    );

    const getPrefecture = () => (isNewUserStoresSelection && !(billing.prefecture && billing.prefecture.length)
      ? dispatch(getPrefectureWithZipcode(billing.postalCode))
        .then(result => Promise.resolve((result && result.addr_state) || defaultPrefecture), () => Promise.resolve())
      : Promise.resolve()
    );

    return giftPromise()
      .then(() => dispatch(setPaymentMethod(paymentType)))
      .then(() => getPrefecture())
      .then((result) => {
        if (billingAddressForNewUser || isNewUserStoresSelection) {
          const billingAddress = isNewUserStoresSelection
            ? {
              ...billing,
              prefecture: result || billing.prefecture || defaultPrefecture,
              city: billing.city || defaultCity,
              streetNumber: billing.streetNumber || billing.street || defaultStreet,
            }
          : billing;

          return dispatch(saveAsBillingAddress(billingAddress))
            .then(() => dispatch(updateShipToName()));
        }

        return Promise.resolve();
      })
      .then(() => dispatch(setCheckoutStatus(PAYMENT)))
      .then(() => redirect(getUrlWithQueryData(routes.reviewOrder, { brand })))
      .then(() => dispatch(resetGiftCards()));
  };
}

export function confirmCODPayment() {
  return (dispatch, getState) => {
    const globalState = getState();
    const { delivery: { currentShippingAddress }, giftCard, userInfo: { userDefaultDetails: defaultAddress } } = globalState;
    const hasDefaultAddress = isUserDefaultAddressComplete(defaultAddress);
    const billingAddress = hasDefaultAddress ? defaultAddress : currentShippingAddress;
    const isGiftCardAvailable = giftCard.giftCards && giftCard.giftCards.length;

    const updateDefault = () => (!hasDefaultAddress
      ? dispatch(updateDefaultAddressAndDeleteDuplicate(currentShippingAddress))
      : Promise.resolve()
    );

    return updateDefault()
      .then(() => dispatch(payByCODOrStore(billingAddress, cashOnDelivery, isGiftCardAvailable, !hasDefaultAddress)))
      .then(() => dispatch(resetLoadAddressCheck()));
  };
}

export function getPaymentType() {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = getCart(globalState, getCurrentBrand(globalState));

    return dispatch({
      types: [GET_PAYMENT_TYPE, GET_PAYMENT_TYPE_SUCCESS, GET_PAYMENT_TYPE_FAIL],
      promise: (client, brand) => client.get(paymentApi.payment, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        params: {
          client_id: paymentApi.client_id,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'getPaymentType' },
    });
  };
}

export function editPaymentSegment(shouldRedirect = true, shouldResetType = true) {
  return (dispatch, getState) => {
    const globalState = getState();
    const { giftCard } = globalState;
    const brand = getCurrentBrand(globalState);

    let deletetePromise = Promise.resolve();

    if (giftCard.giftCards.length) {
      deletetePromise = Promise.resolve(dispatch(removeAllGiftCards(true))
      .catch(() => true));
    }

    return deletetePromise
      .then(() => (shouldResetType && dispatch(setPaymentMethod(''))))
      .then(() => (shouldRedirect && dispatch(setCheckoutStatus(DELIVERY))))
      .then(() => (shouldRedirect && redirect(getUrlWithQueryData(routes.payment, { brand }))))
      .then(() => dispatch(resetGiftCards()));
  };
}

export function setPaymentMethodAndLoad(type) {
  return dispatch => dispatch(setPaymentMethod(type))
  .then(() => dispatch(load()));
}

export function toggleConfirmationBox(show, isEditCVSAddress = false) {
  return {
    type: TOGGLE_EDIT_CONFIRM_BOX,
    result: show,
    isEditCVSAddress,
  };
}

export function togglePayAtUQStoreConfirmation(show = true) {
  return {
    type: TOGGLE_UQ_STORE_CONFIRM_BOX,
    show: !!show,
  };
}

export function togglePostPayConfirmation(show = true) {
  return {
    type: TOGGLE_POSTPAY_CONFIRM_BOX,
    show: !!show,
  };
}

export function checkDeliveryDetails(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const { delivery: { deliveryMethodList, deliveryMethod, deliveryPreference } } = globalState;
    const { shippingAddress: currentShippingAddress } = globalState.cart[brand];
    let isValidShipping;
    let isValidDelivery;
    let isValidDeliveryMethod;

    const goToDelivery = () => {
      dispatch({
        type: REDIRECT_TO_DELIVERY,
        redirect: {
          location: getUrlWithQueryData(routes.delivery, { brand }),
        },
      });

      return Promise.reject();
    };

    for (let split = 1; split <= deliveryMethod.length; split++) {
      const currentDeliveryType = deliveryMethod
        && deliveryMethod.find(shipment => shipment.splitNo === String(split)).deliveryType;
      const availableDeliveryTypes = deliveryMethodList[split]
        && deliveryMethodList[split][deliveryPreference]
        && deliveryMethodList[split][deliveryPreference].deliveryTypes;

      isValidDelivery = currentDeliveryType
        && availableDeliveryTypes
        && availableDeliveryTypes.includes(currentDeliveryType);

      isValidShipping = isShippingDeliveryType(currentDeliveryType)
        && currentShippingAddress
        && currentShippingAddress.firstName
        && currentShippingAddress.lastName
        && currentShippingAddress.prefecture;

      const isValidUqStore = currentDeliveryType === STORE_PICKUP
        && isPickupStoreAddress(currentShippingAddress);
      const isValidCvs = isCVSDeliveryType(currentDeliveryType)
        && isCVSAddress(currentShippingAddress);

      isValidDeliveryMethod = isValidShipping || isValidUqStore || isValidCvs;

      if (!isValidDelivery || !isValidDeliveryMethod) {
        break;
      }
    }

    if (!isValidDelivery) {
      return dispatch(removeDeliverySelected()).then(goToDelivery);
    }

    if (!isValidDeliveryMethod) {
      dispatch(toggleDeliveryEdit());

      return goToDelivery();
    }

    // verify delivery selected date, time or next_day_delivery
    if (isValidShipping) {
      return dispatch(verifyShippingDatesAndResetIfNeeded());
    }

    return Promise.resolve();
  };
}

export function confirmPostPaymentMethod(billingAddress = {}, shouldSaveBillTo = false) {
  return (dispatch, getState) => {
    const globalState = getState();
    const { payment: { postPay } } = constants;
    const { userInfo: { userDefaultDetails } } = globalState;
    const brand = getCurrentBrand(globalState);

    const email = billingAddress.mail || (userDefaultDetails && userDefaultDetails.email) || '';
    const addressPromise = shouldSaveBillTo
      ? dispatch(saveAsBillingAddress({ ...billingAddress, mail: email }))
        .then(() => dispatch(editMemberAddress(billingAddress)))
        .then(() => dispatch(loadDefaultDetails()))
        .then(() => dispatch(updateShipToName()))
      : Promise.resolve();

    return addressPromise
      .then(() => dispatch(setPaymentMethod(postPay)))
      .then(() => dispatch(setCheckoutStatus(PAYMENT)))
      .then(() => redirect(getUrlWithQueryData(routes.reviewOrder, { brand })))
      .then(() => dispatch(resetGiftCards()));
  };
}

/**
 * Reset dummy values in billing Address in postPay, creditcard, giftcard.
 * @public
 * @param  {boolean} isSelected - User has selected this option
 * @param  {Object} currentBillingAddress
 * @param  {boolean} wasSelected - Previous selection of user was the same
 * @return {Promise}
 */
export function resetDummyValuesInBillingAddress(isSelected, currentBillingAddress, wasSelected) {
  return (dispatch) => {
    const { address: { defaultCity, defaultStreet } } = getTranslation();

    if (isSelected && !wasSelected && (currentBillingAddress
      && (currentBillingAddress.city === defaultCity || [currentBillingAddress.street, currentBillingAddress.streetNumber].includes(defaultStreet)))) {
      let { city, street, streetNumber } = currentBillingAddress;

      city = city === defaultCity ? '' : city;
      street = street === defaultStreet ? '' : street;
      streetNumber = streetNumber === defaultStreet ? '' : streetNumber;

      return dispatch(saveBillingAddressLocally({
        ...currentBillingAddress,
        city,
        street,
        streetNumber,
      }));
    }

    return Promise.resolve();
  };
}
