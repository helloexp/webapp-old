import { paymentApi, cartApi, apiTypes } from 'config/api';
import noop from 'utils/noop';
import getSiteConfig from 'config/site';
import { setCheckoutStatus } from 'redux/modules/checkout';
import { setPaymentMethod, getCreditCardInfo, isBillingAddressIncompleted } from 'redux/modules/checkout/payment/actions';
import { saveAsBillingAddress, updateShipToName } from 'redux/modules/checkout/delivery';
import { editMemberAddress, loadDefaultDetails } from 'redux/modules/account/userInfo';
import { redirect, replaceUrlParams, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { constantsGenerator } from 'utils';
import { getBlueGateMapping } from './creditInfoMappings';

const generateConstants = constantsGenerator('payment/creditCard');
const { PREPARE_CARD, PREPARE_CARD_SUCCESS, PREPARE_CARD_FAIL } = generateConstants('PREPARE_CARD');
const { REMOVE_CARD, REMOVE_CARD_SUCCESS, REMOVE_CARD_FAIL } = generateConstants('REMOVE_CARD');
const SUBMIT_TO_BLUEGATE = 'PAYMENT/SUBMIT_TO_BLUEGATE';

export const SELECT_CARD = 'PAYMENT/SELECT_CARD';
export const SET_CREDIT_CARD_FIELD = 'PAYMENT/SET_CREDIT_CARD_FIELD';
export const SET_CREDIT_CARD_SAVED_STATE = 'PAYMENT/SET_CREDIT_CARD_SAVED_STATE';
export const SET_SAVE_CARD_STATUS = 'PAYMENT/SET_SAVE_CARD_STATUS';
export const UPDATE_LOCAL_CREDIT_CARD = 'PAYMENT/UPDATE_LOCAL_CREDIT_CARD';
export {
  PREPARE_CARD_FAIL,
  REMOVE_CARD_SUCCESS,
};

const promiseConfig = {
  host: paymentApi.apiHost,
  hostDelete: paymentApi.apiHostDelete,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};

const errorHandler = { apiType: apiTypes.GDS, enableReaction: true, showMessage: true };

export function updateLocalCreditCard(creditCard) {
  return {
    type: UPDATE_LOCAL_CREDIT_CARD,
    creditCard,
  };
}

/**
 * This action will update the given field for the given credit card.
 * @param {String} name - The field's name to update
 * @param {String} value - The field's value to set
 * @param {Object} card - The card to update, if not provided the local card will be updated
 */
export function setCreditCard(name, value, card = {}) {
  return {
    type: SET_CREDIT_CARD_FIELD,
    name,
    value,
    card,
  };
}

export function sendToBlueGate(card, result) {
  let expirationDate;

  if (card.expYear && card.expMonth) {
    const year = card.expYear.substr(2);
    const month = parseInt(card.expMonth, 10) < 10 ? `0${card.expMonth}` : card.expMonth;

    expirationDate = `${month}${year}`;
  } else if (card.expiry) {
    expirationDate = card.expiry;
  }

  return {
    type: SUBMIT_TO_BLUEGATE,
    bluegate: {
      tourokuKbn: result.tourokuKbn,
      merchantId: result.merchantID,
      dbKey1: result.dbKey1,
      amount: result.amount,
      backUrl: result.backUrl,
      orderNum: result.orderNum,
      cardKbn: result.cardKbn,
      pan: card.ccLastFourDigits,
      expiryDate: expirationDate,
      securityCode: card.cardCvv,
      resultUrl: result.resultUrl,
      optionalAreaName1: result.optionalAreaName1,
      optionalAreaValue1: card.name,
      optionalAreaName2: result.optionalAreaName2,
      optionalAreaValue2: result.optionalAreaValue2,
      optionalAreaName3: result.optionalAreaName3,
      optionalAreaValue3: result.optionalAreaValue3,
      shopID: result.shopID,
      msgDigest: result.msgDigest,
    },
  };
}

export function prepareCreditCard() {
  return {
    types: [PREPARE_CARD, PREPARE_CARD_SUCCESS, PREPARE_CARD_FAIL],
    promise: (client, brand) => client.get(paymentApi.prepareCreditCard, {
      ...promiseConfig,
      host: replaceUrlParams(promiseConfig.host, { brand }),
      params: {
        client_id: cartApi.clientId,
      },
    }),
    errorHandler: { ...errorHandler, customErrorKey: 'prepareCreditCard' },
  };
}

export function deleteCreditCard(card) {
  return (dispatch) => {
    // Delete the card on pressing X icon.
    // return promise when setting up the payment method.
    if (!card.dbKey) {
      return dispatch({ type: REMOVE_CARD_SUCCESS, card });
    }

    return dispatch({
      types: [REMOVE_CARD, REMOVE_CARD_SUCCESS, REMOVE_CARD_FAIL],
      promise: (client, brand) => client.get(paymentApi.deleteCreditCard, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.hostDelete, { brand }),
        params: {
          client_id: cartApi.clientId,
          db_key: card.dbKey,
        },
      }),
      card,
      errorHandler: { enableReaction: true, apiType: apiTypes.GDS },
    })
    .then(() => dispatch(getCreditCardInfo()).catch(noop));
  };
}

export function setSaveCardStatus() {
  return (dispatch, getState) => {
    const { creditCard } = getState();

    return dispatch({
      type: SET_SAVE_CARD_STATUS,
      isSaveThisCard: !creditCard.isSaveThisCard,
    });
  };
}

// Prepare the credit card to save it on bluegate
// then post a form to bluegate.
export function saveNewCardOnBluegate(card) {
  return dispatch => dispatch(prepareCreditCard())
    .then(result => dispatch(sendToBlueGate(card, getBlueGateMapping(result))));
}

export function registerCard(card, isSkipBilling, addressChanged = false) {
  const config = getSiteConfig();
  const tempPromise = Promise.resolve();

  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);
    const { cart: { billingAddress }, userInfo, payment } = globalState;
    const billing = { ...userInfo.userDefaultDetails, ...payment.billingAddress };

    return dispatch(setPaymentMethod(config.payment.creditCard))
      .then(() => {
        if (isBillingAddressIncompleted(billingAddress) || addressChanged) {
          return dispatch(saveAsBillingAddress(billing))
            .then(() => dispatch(editMemberAddress(billing)))
            .then(() => dispatch(loadDefaultDetails()))
            .then(() => dispatch(updateShipToName()));
        }

        return tempPromise;
      })
      .then(() => {
        dispatch(setCheckoutStatus(config.pages.PAYMENT));
        redirect(getUrlWithQueryData(routes.reviewOrder, { brand }));

        return tempPromise;
      });
  };
}

export function resetCard() {
  return { type: REMOVE_CARD_SUCCESS, card: {} };
}

/**
 * We need to show two cards if the user decides to use a different card
 * from the one that has already saved on bluegate. Therefore we need to set
 * the `selected` field on the redux store card to mark the selected card.
 * @param {Object} card - The credit card to select
 */
export function selectCard(card) {
  return {
    type: SELECT_CARD,
    card,
  };
}
