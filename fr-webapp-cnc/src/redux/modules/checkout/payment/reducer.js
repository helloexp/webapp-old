import { getCreditMapping } from 'redux/modules/checkout/payment/creditCard/creditInfoMappings';
import { mapBillingToLocalAddress } from 'redux/modules/checkout/mappings/deliveryMappings';
import { LOAD_CART_SUCCESS } from 'redux/modules/cart/cart';
import getSiteConfig from 'config/site';

import { SELECT_CARD, SET_CREDIT_CARD_FIELD as SET_CREDIT_CARD_FIELD_PAYMENT } from './creditCard/actions';
import {
  GET_CREDIT_CARD_FAIL,
  GET_CREDIT_CARD_SUCCESS,
  GET_PAYMENT_TYPE_FAIL,
  GET_PAYMENT_TYPE_SUCCESS,
  LOAD_BILLING_ADDRESS_FAIL,
  LOAD_BILLING_ADDRESS_SUCCESS,
  PAYMENT_METHOD_SELECTABLE_FAIL,
  PAYMENT_METHOD_SELECTABLE_SUCCESS,
  RESET_BILLING_ADDRESS,
  RESET_CREDIT_CARD,
  SET_BILLING_ADDRESS_FIELD,
  SET_BILLING_ADDRESS_RESULT,
  SET_CREDIT_CARD_FIELD,
  SET_METHOD_PAYMENT,
  SET_PAYMENT_METHOD_FAIL,
  SET_PAYMENT_METHOD_SUCCESS,
  TOGGLE_EDIT_ADDRESS,
  TOGGLE_EDIT_CONFIRM_BOX,
  TOGGLE_UQ_STORE_CONFIRM_BOX,
  TOGGLE_POSTPAY_CONFIRM_BOX,
} from './actions';

const initialState = {
  paymentMethod: '',
  uniqloStore: {},
  billingAddress: {},
  /**
   * @prop {Object} creditInfo
   * Contains the registered credit card information from Bluegate
   */
  creditInfo: {
    /**
     * We use this property to set the credit card we are going to use for the payment,
     * when `true` the saved credit card on bluegate will be used.
     * @prop {Boolean} selected - Whether the register card is selected or not
     */
    selected: false,
  },
  /**
   * @prop {Object} creditCardInfo
   * Contains the new credit credit card information, this is only used in account
   * when registering a new credit card.
   * (This looks to me like a duplicated code, why not use `state.creditCard` instead?)
   */
  creditCardInfo: {},
  isEditAddress: false,
  showConfirmationBox: false,
  payAtUQStoreChangeConfirm: false,
  isEditCVSAddress: false,
  paymentMethods: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PAYMENT_METHOD_SUCCESS:
      const { payment: { giftCard, creditCard } } = getSiteConfig();
      const type = (action.name === giftCard && state.paymentMethod === giftCard && action.paymentType === creditCard)
        ? giftCard
        : action.paymentType;

      return {
        ...state,
        paymentMethod: type,
      };
    case SET_METHOD_PAYMENT:
      const value = state.paymentMethod !== action.paymentType
        ? action.paymentType
        : state.paymentMethod;

      return {
        ...state,
        paymentMethod: value,
      };
    case SET_PAYMENT_METHOD_FAIL:
      return {
        ...state,
        paymentMethod: null,
      };
    case SET_BILLING_ADDRESS_RESULT:

      return {
        ...state,
        billingAddress: {
          ...state.billingAddress,
          ...action.address,
        },
      };
    case LOAD_CART_SUCCESS:
      if (!action.isCurrentBrand) {
        // If the last loaded cart's brand differ from checkout brand or
        // brand in URL search query, we return newly calculated state.cart[brand]
        // and will NOT update the common properties under state.cart.
        return state;
      }

      return {
        ...state,
        paymentMethod: action.result.payment_type,
        billingAddress: action.result && mapBillingToLocalAddress(action.result) || {},
      };
    case LOAD_BILLING_ADDRESS_SUCCESS:
      const convertedBillingAddress = action.noMapping ? action.billingAddress : mapBillingToLocalAddress(action.result);

      return {
        ...state,
        billingAddress: convertedBillingAddress.postalCode ? convertedBillingAddress : state.billingAddress,
      };

    case TOGGLE_EDIT_ADDRESS:
      return Object.assign({}, state, { isEditAddress: !state.isEditAddress });
    case SET_BILLING_ADDRESS_FIELD:
      const billingAddressField = {};

      billingAddressField[action.name] = action.value;
      const address = Object.assign({}, state.billingAddress, billingAddressField);

      return Object.assign({}, state, { billingAddress: address });
    case SET_CREDIT_CARD_FIELD:
      const field = {};

      field[action.name] = action.value;
      const creditInfo = Object.assign({}, state.creditCardInfo, field);

      return Object.assign({}, state, { creditCardInfo: creditInfo });
    case LOAD_BILLING_ADDRESS_FAIL:
      return {
        ...state,
        error: action.error,
      };
    case GET_CREDIT_CARD_SUCCESS:
      return {
        ...state,
        creditInfo: {
          ...getCreditMapping(action.result),
          selected: state.creditInfo.selected,
        },
      };
    case GET_CREDIT_CARD_FAIL:
      return {
        ...state,
        creditInfo: {},
      };
    case GET_PAYMENT_TYPE_SUCCESS:
      return {
        ...state,
        paymentMethod: action.result.payment_type,
      };
    case GET_PAYMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.error,
      };
    case PAYMENT_METHOD_SELECTABLE_SUCCESS:
      return {
        ...state,
        paymentMethods: action.result.payment_type_list,
      };
    case PAYMENT_METHOD_SELECTABLE_FAIL:
      return {
        ...state,
        paymentMethods: null,
        error: action.error,
      };
    case RESET_CREDIT_CARD:
      return {
        ...state,
        creditCardInfo: {},
      };
    case SELECT_CARD:
      return {
        ...state,
        creditInfo: {
          ...state.creditInfo,
          selected: action.card.dbKey !== undefined && action.card.dbKey === state.creditInfo.dbKey,
        },
      };
    case RESET_BILLING_ADDRESS:
      return {
        ...state,
        billingAddress: {},
      };
    case TOGGLE_EDIT_CONFIRM_BOX:
      return {
        ...state,
        showConfirmationBox: action.result === 'show',
        isEditCVSAddress: action.isEditCVSAddress,
      };
    case SET_CREDIT_CARD_FIELD_PAYMENT:
      if (action.card.dbKey) {
        return {
          ...state,
          creditInfo: {
            ...state.creditInfo,
            [action.name]: action.value,
          },
        };
      }

      return state;
    case TOGGLE_UQ_STORE_CONFIRM_BOX:
      return {
        ...state,
        payAtUQStoreChangeConfirm: action.show,
      };
    case TOGGLE_POSTPAY_CONFIRM_BOX:
      return {
        ...state,
        isConfirmPostPay: action.show,
      };
    default:
      return state;
  }
}
