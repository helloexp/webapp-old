import { commonApi, giftingApi, apiTypes } from 'config/api';
import constants from 'config/site/default';
import * as cartActions from 'redux/modules/cart';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import { replaceUrlParams, getCurrentBrand, redirect, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import noop from 'utils/noop';
import { updateLoader } from 'redux/modules/app';
import { getGiftMessageEntered, isGiftBagsLoaded, isMessageCardsLoaded } from './selectors';
import {
  FETCH_GIFTBAG_AMOUNTS_FAIL,
  FETCH_GIFTBAG_AMOUNTS_SUCCESS,
  FETCH_GIFTBAG_AMOUNTS,
  FETCH_GIFTBAGS_FAIL,
  FETCH_GIFTBAGS_SUCCESS,
  FETCH_GIFTBAGS,
  FETCH_MESSAGE_CARD_AMOUNTS_FAIL,
  FETCH_MESSAGE_CARD_AMOUNTS_SUCCESS,
  FETCH_MESSAGE_CARD_AMOUNTS,
  FETCH_MESSAGE_CARDS_FAIL,
  FETCH_MESSAGE_CARDS_SUCCESS,
  FETCH_MESSAGE_CARDS,
  LOAD_GIFT_FAIL,
  LOAD_GIFT_SUCCESS,
  LOAD_GIFT,
  RESET_GIFT_BOX_VALUES,
  RESET_GIFT_VALUES,
  RESET_MESSAGE_CARD_VALUES,
  SAVE_GIFTINGS_FAIL,
  SAVE_GIFTINGS_SUCCESS,
  SAVE_GIFTINGS,
  SELECT_GIFT_BOX,
  SELECT_GIFT_CARD,
  SET_GIFTINGS_FAIL,
  SET_GIFTINGS_SUCCESS,
  SET_GIFTINGS,
  SET_MESSAGE,
} from './constants';

const { deliveryPreferences: { SPLIT_DELIVERY }, deliveryTypes: { SHIPPING }, defaultSplitNumber } = constants;

const commonPromiseConfig = {
  host: `${commonApi.base}/{brand}/${commonApi.region}`,
  credentials: 'include',
  headers: {
    'Content-Type': 'text/plain',
  },
};
const errorHandler = { showMessage: true, enableReaction: true, apiType: apiTypes.GDS };
const giftingPromiseConfig = {
  ...commonPromiseConfig,
  host: `${giftingApi.base}/{brand}/${giftingApi.region}`,
};

const giftingPromiseConfigPUT = {
  ...commonPromiseConfig,
  host: `${giftingApi.putUrl}/{brand}/${giftingApi.region}`,
};

export function isGiftBagAmountsLoaded(globalState) {
  return globalState.gifting && globalState.gifting.isGiftBagAmountsLoaded;
}

export function isMessageCardAmountsLoaded(globalState) {
  return globalState.gifting && globalState.gifting.isMessageCardAmountsLoaded;
}

export function selectGiftBox(giftBoxId) {
  return {
    type: SELECT_GIFT_BOX,
    giftBoxId,
  };
}

export function selectMessageCard(messageCardId) {
  return {
    type: SELECT_GIFT_CARD,
    messageCardId,
  };
}

export function setMessage(message) {
  return {
    type: SET_MESSAGE,
    message,
  };
}

export function cancelGift() {
  return {
    type: RESET_GIFT_VALUES,
  };
}

export function isGiftLoaded(globalState) {
  return globalState.gifting && globalState.gifting.isGiftLoaded;
}

function loadGift() {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState);
    const cart = cartActions.getCart(globalState, selectedBrand);

    const gift = {
      client_id: `${giftingApi.clientId}`,
      client_secret: `${giftingApi.clientSecret}`,
      cart_no: cart.cartNumber,
      token: cart.token,
    };

    return dispatch({
      types: [LOAD_GIFT, LOAD_GIFT_SUCCESS, LOAD_GIFT_FAIL],
      promise: client => client.get(giftingApi.giftOptions, {
        ...giftingPromiseConfig,
        host: replaceUrlParams(giftingPromiseConfig.host, { brand: selectedBrand }),
        params: gift,
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'giftBagFetch' },
    });
  };
}

export function saveGift() {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState);
    const cart = cartActions.getCart(globalState, selectedBrand);
    const { gifting: { selectedGiftBox, selectedMessageCard } } = globalState;
    const gift = {
      client_id: `${giftingApi.clientId}`,
      client_secret: `${giftingApi.clientSecret}`,
      cart_no: cart.cartNumber,
      token: cart.token,
    };

    if (selectedGiftBox) {
      gift.gift_bag_id = selectedGiftBox.id;
    }

    if (selectedMessageCard) {
      const message = getGiftMessageEntered(globalState);

      gift.message_card_id = selectedMessageCard.id;

      if (message) {
        gift.message = encodeURIComponent(message);
      }
    }

    return dispatch({
      types: [SAVE_GIFTINGS, SAVE_GIFTINGS_SUCCESS, SAVE_GIFTINGS_FAIL],
      promise: client => client.post(giftingApi.giftOptions, {
        ...giftingPromiseConfigPUT,
        host: replaceUrlParams(giftingPromiseConfigPUT.host, { brand: selectedBrand }),
        params: gift,
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'saveGiftMessage' },
    })
    .then(() => dispatch(cartActions.bookProvisionalInventory(selectedBrand)))
    .then(() => dispatch(loadGift()).catch(noop))
    .then(() => dispatch(deliveryActions.reloadDeliveryMethodOptions()));
  };
}

export function setGiftAndLoad() {
  return (dispatch, getState) => {
    const globalState = getState();
    const { delivery: { deliveryPreference }, gifting: { selectedGiftBox, selectedMessageCard } } = globalState;
    const selectedBrand = getCurrentBrand(globalState);
    const cart = cartActions.getCart(globalState, selectedBrand);
    const { cartGift: { id: cartGiftId, message, messageCard: { id: messageCardId } } } = cart;

    const resetDeliveryIfNeeded = () => {
      const defaultShippingAddress = deliveryActions.getDefaultShippingAddress(globalState);

      dispatch(deliveryActions.setAddressToEdit(defaultShippingAddress));

      return (deliveryPreference === SPLIT_DELIVERY
        ? dispatch(deliveryActions.setDeliveryMethods([{ deliveryType: SHIPPING, splitNo: defaultSplitNumber }]))
          // fromCVS = false, fromStore = false, isEditShipTo = false, doPIBCall = false
          .then(() => dispatch(deliveryActions.saveShippingAddress(false, false, false, false)))
        : Promise.resolve()
      );
    };

    const selectedGiftBoxId = selectedGiftBox && (Array.isArray(selectedGiftBox.id) ? selectedGiftBox.id[0] : selectedGiftBox.id);
    const appliedGiftMessage = getGiftMessageEntered(globalState);
    const currentGiftMessage = getGiftMessageEntered({ gifting: { message } });
    const isGiftBoxUpdated = cartGiftId ? cartGiftId !== selectedGiftBoxId : !!selectedGiftBox;
    const isMessageCardUpdated = messageCardId ? messageCardId !== (selectedMessageCard && selectedMessageCard.id[0]) : !!selectedMessageCard;
    const isGiftMessageUpdated = appliedGiftMessage ? appliedGiftMessage !== currentGiftMessage : !!currentGiftMessage;

    // Make API calls only if there is any update in gift selection
    if (isGiftBoxUpdated || isMessageCardUpdated || isGiftMessageUpdated) {
      return resetDeliveryIfNeeded().then(() => dispatch(saveGift()));
    }

    return Promise.resolve();
  };
}

export function setGifting(giftId, brand, noPib) {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = getCurrentBrand(globalState, brand);
    const cart = cartActions.getCart(globalState, selectedBrand);

    const gift = {
      client_id: giftingApi.clientId,
      client_secret: giftingApi.clientSecret,
      cart_no: cart.cartNumber,
      token: cart.token,
    };

    if (giftId) {
      gift.gift_bag_id = giftId;
    }

    return dispatch({
      types: [SET_GIFTINGS, SET_GIFTINGS_SUCCESS, SET_GIFTINGS_FAIL],
      promise: client => client.post(giftingApi.giftOptions, {
        ...giftingPromiseConfigPUT,
        host: replaceUrlParams(giftingPromiseConfigPUT.host, { brand: selectedBrand }),
        params: gift,
      }),
      errorHandler: { ...errorHandler, customErrorKey: 'saveGiftMessage' },
    })
    .then(() => (noPib ? Promise.resolve() : dispatch(cartActions.bookProvisionalInventory(selectedBrand))));
  };
}

export function updateGifting(giftingId, brand, noPib, noCartLoad) {
  return dispatch => dispatch(setGifting(giftingId, brand, noPib))
  .then(() => {
    if (!giftingId) {
      dispatch(cancelGift());
    }

    return noCartLoad ? Promise.resolve() : dispatch(cartActions.load(brand));
  })
  .catch(() => dispatch(updateLoader()));
}

function getCodeInfo(code) {
  return (client, brand) => client.get(commonApi.getCodeInfo, {
    ...commonPromiseConfig,
    host: replaceUrlParams(commonPromiseConfig.host, { brand }),
    params: {
      client_id: `${commonApi.clientId}`,
      client_secret: `${commonApi.clientSecret}`,
      cd_id: code,
    },
    errorHandler: { ...errorHandler, showMessage: false },
  });
}

export function fetchGiftBags(brand) {
  return (dispatch, getState) => {
    const globalState = getState();
    const selectedBrand = brand || getCurrentBrand(globalState);
    const loaded = isGiftBagsLoaded(globalState);

    return loaded ? Promise.resolve() : dispatch({
      types: [FETCH_GIFTBAGS, FETCH_GIFTBAGS_SUCCESS, FETCH_GIFTBAGS_FAIL],
      promise: getCodeInfo(205),
      errorHandler,
      selectedBrand,
    });
  };
}

export function fetchGiftBagAmounts() {
  return (dispatch, getState) => {
    const loaded = !!Object.keys(getState().gifting.giftBagAmounts).length;

    return loaded ? Promise.resolve() : dispatch({
      types: [FETCH_GIFTBAG_AMOUNTS, FETCH_GIFTBAG_AMOUNTS_SUCCESS, FETCH_GIFTBAG_AMOUNTS_FAIL],
      promise: getCodeInfo(206),
      errorHandler,
    });
  };
}

export function fetchMessageCards(brand) {
  return (dispatch, getState) => {
    const selectedBrand = brand || getCurrentBrand(getState());

    return dispatch({
      types: [FETCH_MESSAGE_CARDS, FETCH_MESSAGE_CARDS_SUCCESS, FETCH_MESSAGE_CARDS_FAIL],
      promise: getCodeInfo(207),
      errorHandler,
      selectedBrand,
    });
  };
}

export function fetchMessageCardAmounts() {
  return {
    types: [FETCH_MESSAGE_CARD_AMOUNTS, FETCH_MESSAGE_CARD_AMOUNTS_SUCCESS, FETCH_MESSAGE_CARD_AMOUNTS_FAIL],
    promise: getCodeInfo(208),
    errorHandler,
  };
}

export function onMessageCancel() {
  return {
    type: RESET_MESSAGE_CARD_VALUES,
  };
}

export function onCardCancel() {
  return {
    type: RESET_GIFT_BOX_VALUES,
  };
}

export function initGifting(dispatch, getState) {
  const promises = [];
  const state = getState();
  const currentBrand = getCurrentBrand(state);

  if (!cartActions.isLoaded(state, currentBrand)) {
    const promise = dispatch(cartActions.load(currentBrand))
      .then((cart) => {
        if (cart.gift_bag_id) {
          dispatch(selectGiftBox(cart.gift_bag_id));

          if (cart.message_card_id) {
            dispatch(selectMessageCard([cart.message_card_id]));
          }
        }
      });

    promises.push(promise);
  }

  promises.push(dispatch(deliveryActions.loadDeliveryMethod()).catch(noop));

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

  return Promise.all(promises);
}

/**
 * Some delivery types and gifting option ("資材同梱" - Material Included)
 * cannot be chosen together, in that case we have to show a pop up warning
 * to the user in gifting page and redirect to delivery page.
 *
 * @export
 * @param {String} giftBagId
 * @param {String} brand
 * @returns {Promise}
 */
export function handleDeliveryGiftingConflict(giftBagId, brand) {
  return dispatch => dispatch(deliveryActions.setDeliveryWithDefaultPreferenceIfNeeded(true))
    .then(() => dispatch(cartActions.getAndSetShipTo()))
    .then(() => dispatch(saveGift()))
    .then(() => redirect(getUrlWithQueryData(routes.delivery, { brand })));
}
