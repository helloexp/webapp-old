import { mapAmountToGiftBag, mapAmountToMessage, mapGiftBags, mapGiftCardMessages, mapGift } from '../mappings/giftingMappings';
import {
  FETCH_GIFTBAG_AMOUNTS_SUCCESS,
  FETCH_GIFTBAGS_SUCCESS,
  FETCH_MESSAGE_CARD_AMOUNTS_SUCCESS,
  FETCH_MESSAGE_CARDS_SUCCESS,
  LOAD_GIFT_FAIL,
  LOAD_GIFT_SUCCESS,
  RESET_GIFT_BOX_VALUES,
  RESET_GIFT_VALUES,
  RESET_MESSAGE_CARD_VALUES,
  SAVE_GIFTINGS_SUCCESS,
  SELECT_GIFT_BOX,
  SELECT_GIFT_CARD,
  SET_GIFTINGS_FAIL,
  SET_GIFTINGS_SUCCESS,
  SET_MESSAGE,
} from './constants';

const initialState = {
  giftBags: [],
  giftBagAmounts: {},
  messageCards: [],
  messageAmounts: {},
  message: null,
  selectedGiftBox: null,
  selectedMessageCard: null,
  isGiftBagsLoaded: false,
  isGiftBagAmountsLoaded: false,
  isMessageCardsLoaded: false,
  isMessageCardAmountsLoaded: false,
  isGiftLoaded: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_GIFT_BOX:
      const selectedGiftBox = action.giftBoxId ? { id: action.giftBoxId } : null;

      return {
        ...state,
        selectedGiftBox,
      };
    case SELECT_GIFT_CARD:
      const selectedMessageCard = action.messageCardId ? { id: action.messageCardId } : null;

      return {
        ...state,
        message: '',
        selectedMessageCard,
      };
    case RESET_GIFT_VALUES:
      return {
        ...state,
        message: null,
        selectedGiftBox: null,
        selectedMessageCard: null,
      };
    case RESET_MESSAGE_CARD_VALUES:

      return {
        ...state,
        message: null,
        selectedMessageCard: null,
      };
    case RESET_GIFT_BOX_VALUES:
      return {
        ...state,
        selectedGiftBox: null,
        message: null,
        selectedMessageCard: null,
      };
    case SET_MESSAGE:
      const giftMessage = action.message;

      return {
        ...state,
        message: giftMessage,
      };

    case SET_GIFTINGS_SUCCESS:
    case SAVE_GIFTINGS_SUCCESS:
      return {
        ...state,
        ...action.result,
        isGiftLoaded: false,
      };
    case FETCH_GIFTBAGS_SUCCESS:
      return {
        ...state,
        isGiftBagsLoaded: true,
        giftBags: mapGiftBags(action.result, action.selectedBrand),
      };
    case FETCH_GIFTBAG_AMOUNTS_SUCCESS:
      return {
        ...state,
        isGiftBagAmountsLoaded: true,
        giftBagAmounts: mapAmountToGiftBag(action.result.codedtl_list),
      };
    case FETCH_MESSAGE_CARDS_SUCCESS:
      return {
        ...state,
        isMessageCardsLoaded: true,
        messageCards: mapGiftCardMessages(action.result, action.selectedBrand),
      };
    case FETCH_MESSAGE_CARD_AMOUNTS_SUCCESS:
      return {
        ...state,
        isMessageCardAmountsLoaded: true,
        messageAmounts: mapAmountToMessage(action.result.codedtl_list),
      };
    case LOAD_GIFT_SUCCESS:
      return {
        ...state,
        isGiftLoaded: true,
        gift: mapGift(action.result),
      };
    case LOAD_GIFT_FAIL:
      return {
        ...state,
        gift: null,
      };
    case SET_GIFTINGS_FAIL:
    default:
      return state;
  }
}
