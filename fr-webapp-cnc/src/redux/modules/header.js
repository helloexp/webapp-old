import { LOCATION_CHANGE } from 'react-router-redux';
import { getCurrentBrand } from 'utils/routing';
import * as cartActions from 'redux/modules/cart';
import { APPLY_GIFT_CARD_SUCCESS, REMOVE_GIFT_CARD_SUCCESS } from './checkout/payment/giftCard/actions';
import { LOAD_CART_SUCCESS } from './cart/cart';
// TODO:
// 1. Update the end points to respective api end points
// 2. Update the logic on reducer for object assignment and Header component
const GET_PROMO = 'header/promotion/LOAD';
const PROMO_SUCCESS = 'header/promotion/LOAD_S';
const PROMO_FAIL = 'header/promotion/LOAD_F';

export const EXPAND_MINIBAG = 'header/minibag/EXPAND';

const initialState = {
  loaded: false,
  promotion: {},
  isMinibagExpanded: false,
  forceCartRefreshForMinibag: false,
};

export default function header(state = initialState, action = {}) {
  switch (action.type) {
    case GET_PROMO:
      return state;
    case PROMO_SUCCESS:
      return {
        ...state,
        loaded: true,
        promotion: action.result.promotion || {},
      };
    case PROMO_FAIL:
      return {
        ...state,
        loaded: false,
        error: action.error,
      };
    case EXPAND_MINIBAG:
      return {
        ...state,
        isMinibagExpanded: action.status,
      };

    case LOCATION_CHANGE:
      return {
        ...state,
        isMinibagExpanded: false,
      };
    // when gift card is added or removed on payment page, we set a flag to refresh cart information.
    case REMOVE_GIFT_CARD_SUCCESS:
    case APPLY_GIFT_CARD_SUCCESS:
      return {
        ...state,
        forceCartRefreshForMinibag: true,
      };
    // after cart data is refreshed, the flag can be set back to false.
    case LOAD_CART_SUCCESS:
      return {
        ...state,
        forceCartRefreshForMinibag: false,
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.header && globalState.header.loaded;
}

export function expandMinibag(status) {
  return (dispatch, getState) => {
    // check if GET cart needs to be refreshed for showing minibag info.
    if (status) {
      const state = getState();
      const currentBrand = getCurrentBrand(state);

      if (state.header.forceCartRefreshForMinibag) {
        return dispatch(cartActions.load(currentBrand))
          .then(dispatch({
            type: EXPAND_MINIBAG,
            status,
          }));
      }
    }

    return dispatch({
      type: EXPAND_MINIBAG,
      status,
    });
  };
}
