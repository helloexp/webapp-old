import {
  PREPARE_CARD_FAIL,
  REMOVE_CARD_SUCCESS,
  SELECT_CARD,
  SET_CREDIT_CARD_FIELD,
  SET_CREDIT_CARD_SAVED_STATE,
  SET_SAVE_CARD_STATUS,
  UPDATE_LOCAL_CREDIT_CARD,
} from './actions';

/**
 * This reducer handles the temporal credit card. The data here is not saved
 * anywhere and will be send to bluegate when placing order.
 */
const initialState = {
  isSaveThisCard: true,
  expMonth: '',
  expYear: '',
  /**
   * We use this property to set the credit card we are going to use for the payment,
   * when `true` the local credit card will be used.
   * @prop {Boolean} selected - Whether the temporal card is selected or not
   */
  selected: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CREDIT_CARD_FIELD:
      // Since we need to set CVV for the two credit cards that we have on state
      // we need to make sure not to update the wrong card.
      if (!action.card.dbKey) {
        const field = {};
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const name = action.name === 'cvv' ? 'cardCvv' : action.name;

        field[name] = action.value;

        // if new year selection invalidates current month selection
        // for example selecting June in December and switching year to current
        // reset month
        if (name === 'expYear' && parseInt(action.value, 10) === currentYear
        && currentMonth > parseInt(state.expMonth, 10)) {
          field.expMonth = undefined;
        }

        return {
          ...state,
          ...field,
        };
      }

      return state;
    case SET_CREDIT_CARD_SAVED_STATE:
      return {
        ...state,
        savedCard: action.value,
      };
    case PREPARE_CARD_FAIL:
      return {
        ...state,
        error: action.error,
      };
    case SET_SAVE_CARD_STATUS:
      return {
        ...state,
        isSaveThisCard: action.isSaveThisCard,
      };
    case UPDATE_LOCAL_CREDIT_CARD: {
      const newCard = action.creditCard || { };

      return {
        ...state,
        ...newCard,
      };
    }
    case REMOVE_CARD_SUCCESS:
      // When removing register card, we need to keep the temporal
      // card to allow the user to use it.
      if (!action.card.dbKey) {
        return {
          ...initialState,
        };
      }

      return state;
    case SELECT_CARD:
      return {
        ...state,
        selected: action.card.ccLastFourDigits !== undefined && action.card.ccLastFourDigits === state.ccLastFourDigits,
      };
    default:
      return state;
  }
}
