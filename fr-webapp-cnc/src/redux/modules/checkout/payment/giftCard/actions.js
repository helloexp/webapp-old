import { paymentApi, cartApi, apiTypes } from 'config/api';
import getSiteConfig from 'config/site';
import {
  setPaymentMethod,
  resetPaymentMethod,
  fetchBillingAddress,
  getPaymentMethodsSelectable,
  setLocalPaymentMethod,
} from 'redux/modules/checkout/payment/actions';
import { setCheckoutStatus } from 'redux/modules/checkout';
import { saveAsBillingAddress, updateShipToName } from 'redux/modules/checkout/delivery';
import { editMemberAddress, loadDefaultDetails } from 'redux/modules/account/userInfo';
import * as cartActions from 'redux/modules/cart';
import { fetchOrderSummary } from 'redux/modules/checkout/order';
import { replaceUrlParams, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import { constantsGenerator } from 'utils';
import { pushDetailedErrorMessage, popDetailedErrorMessage } from 'redux/modules/errorHandler';
import { getTranslation } from 'i18n';

const generateConstants = constantsGenerator('payment/giftCard');
const { LOAD_GIFT_CARD, LOAD_GIFT_CARD_SUCCESS, LOAD_GIFT_CARD_FAIL } = generateConstants('LOAD_GIFT_CARD');
const { VERIFY_GIFT_CARD, VERIFY_GIFT_CARD_SUCCESS, VERIFY_GIFT_CARD_FAIL } = generateConstants('VERIFY_GIFT_CARD');
const { APPLY_GIFT_CARD, APPLY_GIFT_CARD_SUCCESS, APPLY_GIFT_CARD_FAIL } = generateConstants('APPLY_GIFT_CARD');
const { REMOVE_GIFT_CARD, REMOVE_GIFT_CARD_SUCCESS, REMOVE_GIFT_CARD_FAIL } = generateConstants('REMOVE_GIFT_CARD');
const REDIRECT_TO_REVIEW = 'payment/giftCard/BALANCE/REDIRECT';

export const SET_GIFT_CARD_PAYMENT_OPTION = 'payment/giftCard/PAYMENT/OPTION';
export const SET_INPUT_VALUE = 'payment/giftCard/SET_INPUT_VALUE';
export const SET_BALANCE_PAYMENT_METHOD = 'payment/giftCard/BALANCE/METHOD';
export const SET_GIFT_EDIT_INDEX = 'payment/giftCard/SET_EDIT_GIFT';
export const ADD_VALID_GIFTCARD = 'payment/giftCard/CLEAR_ACTIVE_GD';
export const RESET_GIFTCARDS = 'payment/giftCard/RESET_GIFTCARDS';
export const TOGGLE_CONTINUE = 'payment/giftCard/TOGGLE_CONTINUE';
export {
  APPLY_GIFT_CARD_SUCCESS,
  LOAD_GIFT_CARD_FAIL,
  LOAD_GIFT_CARD_SUCCESS,
  REMOVE_GIFT_CARD_SUCCESS,
  REMOVE_GIFT_CARD,
  VERIFY_GIFT_CARD_FAIL,
  VERIFY_GIFT_CARD_SUCCESS,
};

const promiseConfig = {
  host: paymentApi.apiHost,
  hostPut: paymentApi.apiHostPut,
  hostDelete: paymentApi.apiHostDelete,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};

const errorHandler = { apiType: apiTypes.GDS, showMessage: true, enableReaction: true };

export function setEditIndex(index) {
  return {
    type: SET_GIFT_EDIT_INDEX,
    index,
  };
}

/**
 * @private Locally moves a valid giftcard to the list of applied giftcard, this way
 * we have the same state when refreshing the page. On serverside, a valid giftcard is already
 * applied.
 */
function moveValidGiftCardToList() {
  return (dispatch, getState) => {
    const globalState = getState();
    const {
      giftCard: {
        giftCard: validCard,
        giftCards,
      },
    } = globalState;

    dispatch({
      type: ADD_VALID_GIFTCARD,
      validCard: {
        ...validCard,
        payment: 0,
        index: giftCards.length,
      },
    });

    dispatch(setEditIndex(giftCards.length));
  };
}

export function verifyGiftCard(giftCard, billing, storeInInfo) {
  return (dispatch, getState) => {
    const globalState = getState();
    const currentBrand = getCurrentBrand(globalState);
    const cart = cartActions.getCart(globalState, currentBrand);
    const { userInfo: { userDefaultDetails }, giftCard: { giftCards } } = globalState;
    const { orderSummary: { settlementFee } } = cart;
    const { payment: { settlementFeeError } } = getTranslation();
    const { payment: { creditCard: creditCardPayment, giftCard: giftCardPayment, postPay, cashOnDelivery } } = getSiteConfig();
    const isSettlementFeePresent = [postPay, cashOnDelivery].includes(cart.paymentType) && settlementFee;
    let billingPromise = Promise.resolve();

    if (storeInInfo) {
      billing.mail = billing.mail || (userDefaultDetails && userDefaultDetails.email) || '';
      billingPromise = dispatch(saveAsBillingAddress(billing))
        .then(() => dispatch(editMemberAddress(billing)))
        .then(() => dispatch(loadDefaultDetails()))
        .then(() => dispatch(updateShipToName()));
    }

    return billingPromise
      .then(() => {
        if (cart.paymentType !== creditCardPayment && parseInt(cart.orderSummary.paymentsAmt, 10) > 0) {
          return dispatch(setPaymentMethod(creditCardPayment, giftCardPayment))
            .then(() => {
              if (isSettlementFeePresent) {
                return dispatch(cartActions.load(currentBrand));
              }

              return Promise.resolve();
            });
        }

        return null;
      })
      .then(() => dispatch({
        types: [VERIFY_GIFT_CARD, VERIFY_GIFT_CARD_SUCCESS, VERIFY_GIFT_CARD_FAIL],
        promise: (client, brand = 'uq') => client.post(paymentApi.giftCard, {
          ...promiseConfig,
          host: replaceUrlParams(promiseConfig.host, { brand }),
          params: {
            client_id: cartApi.clientId,
            cart_no: cart.cartNumber,
            token: cart.token,
            card_no: giftCard.number,
            pin_no: giftCard.pin,
          },
        }),
        errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'verifyGiftCard' },
      }))
      .then(() => giftCards.length === 0 && dispatch(getPaymentMethodsSelectable()))
      .then(() => dispatch(moveValidGiftCardToList()))
      .then(() => dispatch(resetPaymentMethod()))
      .then(() => {
        if (isSettlementFeePresent) {
          return dispatch(pushDetailedErrorMessage({ settlementFeeError }, 'giftCards'));
        }

        return Promise.resolve();
      });
  };
}

export function setInputValue(name, value) {
  return {
    type: SET_INPUT_VALUE,
    name,
    value,
  };
}

export function setBalancePaymentMethod(method) {
  return dispatch => dispatch({
    type: SET_BALANCE_PAYMENT_METHOD,
    method,
  });
}

export function setFullPayment(option) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = cartActions.getCart(globalState, getCurrentBrand(globalState));
    const { giftCard: { giftCards, giftCard: { requestNumber, balance } } } = globalState;
    const amountPaidInGiftCard = giftCards.reduce((prev, current) =>
      (current && requestNumber !== current.requestNumber ? prev + parseInt(current.payment, 10) : prev), 0);
    let balanceDue = cart.totalAmount - amountPaidInGiftCard;

    // If giftcard amount is less than balance due, the amount that can be paid with giftcard will be giftcard balance.
    balanceDue = balanceDue > balance ? balance : balanceDue;

    return dispatch({
      type: SET_GIFT_CARD_PAYMENT_OPTION,
      option,
      balanceDue,
    });
  };
}

export function loadGiftCards(skipErrorCodes = []) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cart = cartActions.getCart(globalState, getCurrentBrand(globalState));

    return dispatch({
      types: [LOAD_GIFT_CARD, LOAD_GIFT_CARD_SUCCESS, LOAD_GIFT_CARD_FAIL],
      promise: (client, brand = 'uq') => client.get(paymentApi.giftCard, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.host, { brand }),
        params: {
          client_id: cartApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
        },
      }),
      errorHandler: { ...errorHandler, skipErrorCodes, customErrorKey: 'loadGiftCards' },
    });
  };
}

export function redirectToReview(isOldCard) {
  return (dispatch, getState) => {
    const globalState = getState();
    const brand = getCurrentBrand(globalState);
    const cart = cartActions.getCart(globalState, brand);
    const { giftCard } = globalState;
    const config = getSiteConfig();

    const totalApplied = giftCard.giftCards.reduce((prev, current) => {
      if (current.fullPayment === config.payment.fullPayment) {
        return parseFloat(current.balance) + prev;
      }

      return parseFloat(current.payment) + prev;
    }, 0);

    if (totalApplied >= cart.totalAmount) {
      let setPayment = Promise.resolve();

      if (isOldCard === null) {
        setPayment = dispatch(setPaymentMethod(config.payment.giftCard));
      }

      return setPayment.then(() => {
        dispatch(setCheckoutStatus(config.pages.PAYMENT));

        return dispatch({
          type: REDIRECT_TO_REVIEW,
          redirect: {
            location: getUrlWithQueryData(routes.reviewOrder, { brand }),
          },
        });
      });
    }

    return dispatch(loadGiftCards());
  };
}

export function toggleContinueButton(value) {
  return {
    type: TOGGLE_CONTINUE,
    value,
  };
}

export function applyGiftCard(currentCard) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cartBrand = getCurrentBrand(globalState);
    const { payment: paymentConfig } = getSiteConfig();
    const cart = cartActions.getCart(globalState, cartBrand);
    const { payment, giftCard: { balanceAmount } } = globalState;
    const config = getSiteConfig();

    if (!payment.billingAddress || !payment.billingAddress.firstName) {
      dispatch(fetchBillingAddress());
    }

    // dispatching with false value to hide giftcard continue button
    dispatch(toggleContinueButton(false));

    return dispatch({
      types: [APPLY_GIFT_CARD, APPLY_GIFT_CARD_SUCCESS, APPLY_GIFT_CARD_FAIL],
      promise: (client, brand = 'uq') => client.post(paymentApi.giftCard, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.hostPut, { brand }),
        params: {
          client_id: cartApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
          request_no: currentCard.requestNumber,
          all_use_flg: currentCard.fullPayment || paymentConfig.fullPayment,
          payment_amt: currentCard.payment,
        },
      }),
      errorHandler: { ...errorHandler, enableReaction: true, customErrorKey: 'applyGiftCard' },
    })
    .then(() => {
      const state = getState();
      const currentBrand = getCurrentBrand(state);

      // cart needs to be refreshed after changing a gift card on GDS side
      return dispatch(cartActions.load(currentBrand));
    })
    .then(() => {
      dispatch(setLocalPaymentMethod());

      return dispatch(getPaymentMethodsSelectable())
        .then(() => {
          const { cart: { [cartBrand]: { orderSummary: { paymentsAmt: initialAmount } } }, payment: { paymentMethods } } = getState();
          const paymentsAmt = initialAmount - parseInt(currentCard.payment, 10) - balanceAmount;
          const giftCardFullPayment = paymentMethods.length === 1 && paymentMethods[0] === getSiteConfig().giftCardPayment;

          if ((initialAmount || giftCardFullPayment) && paymentsAmt <= 0) {
            return dispatch(setPaymentMethod(getSiteConfig().giftCardPayment))
              .then(() => {
                dispatch(setCheckoutStatus(config.pages.PAYMENT, cartBrand));

                return dispatch({
                  type: REDIRECT_TO_REVIEW,
                  redirect: {
                    location: getUrlWithQueryData(routes.reviewOrder, { brand: cartBrand }),
                  },
                });
              });
          }

          dispatch(toggleContinueButton(true));

          return Promise.resolve();
        })
        .then(() => dispatch(popDetailedErrorMessage('giftCards', 'settlementFeeError')));
        // dispatching with true value to show giftcard continue button if any of the API call fails
    }, () => dispatch(dispatch(toggleContinueButton(true))));
  };
}

export function updateFailedGiftCards(failedGiftCards = {}) {
  return {
    type: LOAD_GIFT_CARD_FAIL,
    response: failedGiftCards.response,
    isXHr: false,
  };
}

export function reloadGirtCards() {
  return (dispatch, getState) => {
    const globalState = getState();
    const cartBrand = getCurrentBrand(globalState);

    return dispatch(cartActions.load(cartBrand))
      .then(() => dispatch(getPaymentMethodsSelectable()))
      .then(() => dispatch(loadGiftCards()).catch((error) => {
        dispatch(updateFailedGiftCards(error));
      }))
      .then(() => dispatch(fetchOrderSummary()));
  };
}

export function removeGiftCard(requestNumber, index) {
  return (dispatch, getState) => {
    const globalState = getState();
    const cartBrand = getCurrentBrand(globalState);
    const cart = cartActions.getCart(globalState, cartBrand);

    return dispatch({
      types: [REMOVE_GIFT_CARD, REMOVE_GIFT_CARD_SUCCESS, REMOVE_GIFT_CARD_FAIL],
      promise: (client, brand = 'uq') => client.get(paymentApi.giftCard, {
        ...promiseConfig,
        host: replaceUrlParams(promiseConfig.hostDelete, { brand }),
        params: {
          client_id: cartApi.clientId,
          cart_no: cart.cartNumber,
          token: cart.token,
          request_no: requestNumber,
        },
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'removeGiftCard' },
      index,
    });
  };
}

export function removeAllGiftCards(skipCard) {
  return (dispatch, getState) => {
    const { giftCard } = getState();

    return giftCard.giftCards.reduce((promise, gift, index) => promise
    .then(() => dispatch(removeGiftCard(gift.requestNumber, index))), Promise.resolve())
      .then(() => {
        if (!skipCard) {
          return dispatch(loadGiftCards());
        }

        return Promise.resolve();
      });
  };
}

export function resetGiftCards() {
  return {
    type: RESET_GIFTCARDS,
  };
}
