import { getGiftCard, getAllGiftcards } from './giftCardMappings';
import {
  ADD_VALID_GIFTCARD,
  APPLY_GIFT_CARD_SUCCESS,
  LOAD_GIFT_CARD_FAIL,
  LOAD_GIFT_CARD_SUCCESS,
  REMOVE_GIFT_CARD_SUCCESS,
  REMOVE_GIFT_CARD,
  SET_BALANCE_PAYMENT_METHOD,
  SET_GIFT_CARD_PAYMENT_OPTION,
  SET_GIFT_EDIT_INDEX,
  SET_INPUT_VALUE,
  VERIFY_GIFT_CARD_FAIL,
  VERIFY_GIFT_CARD_SUCCESS,
  RESET_GIFTCARDS,
  TOGGLE_CONTINUE,
} from './actions';

const initialState = {
  // Array of valid giftcards
  giftCards: [],
  balancePaymentMethod: null,
  // Temporal giftcard, before validation from API
  giftCard: {},
  balanceAmount: 0,
  editIndex: null,
  showContinueButton: true,
};

function calculateBalanceAmount(giftCards = []) {
  const sum = (prev, current) => prev + parseFloat(current.payment);

  return giftCards.reduce(sum, 0);
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case VERIFY_GIFT_CARD_SUCCESS:
      return {
        ...state,
        giftCard: getGiftCard(action.result),
        editIndex: null,
      };
    case REMOVE_GIFT_CARD:
      return Object.assign({}, state, { giftCard: {}, editIndex: null });
    case SET_GIFT_CARD_PAYMENT_OPTION:
      const payment = action.balanceDue;

      return {
        ...state,
        giftCard: {
          ...state.giftCard,
          fullPayment: action.option,
          payment,
        },
      };
    case SET_BALANCE_PAYMENT_METHOD:
      return {
        ...state,
        balancePaymentMethod: action.method,
        editIndex: null,
      };
    case APPLY_GIFT_CARD_SUCCESS:
      let giftCards = [...state.giftCards, { ...state.giftCard, isApplied: true }];
      const currentCard = state.giftCard;

      if (currentCard.requestNumber) {
        giftCards = state.giftCards.map(card =>
          (card.requestNumber === currentCard.requestNumber ? { ...currentCard, isApplied: true } : card)
        );
      }

      return {
        ...state,
        giftCards,
        giftCard: {},
        balancePaymentMethod: '',
        balanceAmount: calculateBalanceAmount(giftCards),
        editIndex: null,
        error: null,
      };
    case LOAD_GIFT_CARD_SUCCESS:
      const allGiftCards = getAllGiftcards(action.result);

      return {
        ...state,
        giftCards: allGiftCards,
        balanceAmount: action.result.giftcard_amt,
        giftCard: {
          ...state.giftCard.giftCard,
          ...allGiftCards[state.giftCard.editIndex],
        },
        editIndex: null,
      };
    case LOAD_GIFT_CARD_FAIL:
      if (action.response) {
        return {
          ...state,
          giftCards: getAllGiftcards(action.response),
          balanceAmount: action.response.giftcard_amt,
          editIndex: null,
        };
      }

      return {
        ...state,
        error: action.error,
      };
    case VERIFY_GIFT_CARD_FAIL:
      return {
        ...state,
        error: {
          action: VERIFY_GIFT_CARD_FAIL,
          ...action.error,
        },
      };
    case SET_INPUT_VALUE:
      return {
        ...state,
        giftCard: {
          ...state.giftCard,
          [action.name]: action.value,
        },
        error: null,
      };
    case REMOVE_GIFT_CARD_SUCCESS:
      return {
        ...state,
        giftCards: [],
        editIndex: null,
      };
    case ADD_VALID_GIFTCARD:
      return {
        ...state,
        giftCards: [...state.giftCards, action.validCard],
      };
    case SET_GIFT_EDIT_INDEX:
      return {
        ...state,
        editIndex: action.index,
        balancePaymentMethod: null,
        giftCard: state.giftCards[action.index] || {},
      };
    case RESET_GIFTCARDS:
      return {
        ...state,
        giftCards: [],
      };
    case TOGGLE_CONTINUE:
      return {
        ...state,
        showContinueButton: action.value,
      };
    default:
      return state;
  }
}
