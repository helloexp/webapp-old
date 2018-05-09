import { LOAD_CART_SUCCESS } from 'redux/modules/cart/cart';
import { DELETE_USER_ADDRESS_SUCCESS } from 'redux/modules/account/userInfo';
import {
  mapDeliveryMethods,
  mapDeliveryAddress,
  mapShippingThresholdAmount,
  mapDeliveryMethod,
  mapBillingToLocalAddress,
  mapSplitDetails,
} from 'redux/modules/checkout/mappings/deliveryMappings';
import constants from 'config/site/default';
import { LOAD_BILLING_ADDRESS_SUCCESS, LOAD_BILLING_ADDRESS_FAIL } from 'redux/modules/checkout/payment/actions.js';
import { isShippingDeliveryType } from 'utils/deliveryUtils';
import {
  SET_SHIPPING_ADDRESS_FIELD,
  SET_SHIPPING_ADDRESS_RESULT,
  TOGGLE_DELIVERY_EDIT,
  TOGGLE_DELIVERY_EDIT_OPTION,
  LOAD_DELIVERY_METHOD_SUCCESS,
  LOAD_DELIVERY_METHOD_FAIL,
  LOAD_DELIVERY_METHODS_SUCCESS,
  LOAD_DELIVERY_METHODS_FAIL,
  SAVE_SHIPPING_ADDRESS_SUCCESS,
  SAVE_SHIPPING_ADDRESS_FAIL,
  SAVE_SHIPPING_ADDRESS_LOCALLY,
  SAVE_AS_BILLING_ADDRESS_SUCCESS,
  SAVE_AS_BILLING_ADDRESS_FAIL,
  TOGGLE_SET_BILLING_ADDRESS,
  SET_ADDRESS_TO_EDIT,
  LOAD_SHIPPING_THRESHOLD_SUCCESS,
  LOAD_SHIPPING_THRESHOLD_FAIL,
  SET_DELIVERY_METHOD_OPTION,
  SET_DELIVERY_PREFERENCE,
  RELOAD_DELIVERY_METHODS,
  SET_DELIVERY_METHOD_SUCCESS,
  SET_DELIVERY_METHOD_FAIL,
  SHOW_ADDRESS_BOOK,
  SAVE_AND_CONTINUE,
  SET_PREVIOUS_LOCATION_COOKIE,
  REMOVE_PREVIOUS_LOCATION_COOKIE,
  GET_PREVIOUS_LOCATION_COOKIE,
  LOAD_SAME_DAY_DELIVERY_CHARGE_SUCCESS,
  LOAD_SAME_DAY_DELIVERY_CHARGE_FAIL,
  GET_FM_STORE_SUCCESS,
  GET_FM_STORE_FAIL,
  SET_FROM_PICKUP_STORE_AS,
  TOGGLE_CVS_NAV_MODAL,
  SET_BILLING_ADDRESS_AS,
  LOAD_SPLIT_DETAILS_FAIL,
  LOAD_SPLIT_DETAILS_SUCCESS,
  SET_DELIVERY_METHODS_SUCCESS,
  // SET_DELIVERY_METHODS_FAIL,
} from './actions';

/**
 * @typedef {Object} DeliveryMethod
 * @property {String} deliveryType
 * @property {String} [deliveryReqDate] - optional field
 * @property {String} [deliveryReqTime] - optional field
 */

const {
  deliveryTypes: { SHIPPING, YU_PACKET, YAMATO_MAIL, SAME_DAY },
  NULL_TIMEFRAME,
  deliveryPreferences: { SPLIT_DELIVERY },
  pages: { DELIVERY },
} = constants;

const initialState = {
  methodOptionsLoaded: false,
  addressLoaded: false,
  methodLoaded: false,
  methodLoadFailed: false,
  chargesLoaded: false,
  sameDayDeliveryChargesLoaded: false,
  shippingAddressLoaded: false,
  isEditDeliveryAddress: false,
  isEditDeliveryOption: false,
  deliveryArrivesAt: {},
  shippingAddress: {},
  cvsAddress: {},
  addressList: [],
  shippingThreshold: [],
  deliveryMethod: [],
  deliveryTypeApplied: ' ',
  setOption: {
    shouldSetBillingAddress: true,
  },
  currentShippingAddress: {},
  isFromAddressBook: false,
  previousLocation: DELIVERY,
  storeDetail: {},
  fmStoreDetails: null,
  isFromPickupStore: false,
  showCvsNavigationModal: false,
  deliveryMethodList: { 1: { C: {} } },
  updatedDeliveryMethodList: {},
  nextDateOptions: { 1: { C: {} } },
  deliveryTypes: [],
  isSplitDeliveryAvailable: false,
  isShippingGroupDeliveryAvailable: false,
  splitDetails: {},
  splitCount: 1,
  deliveryStandard: { 1: {} },
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_DELIVERY_EDIT:
      const delvTypeApplied = action.shouldEditDeliveryTypeApplied
        ? (state.deliveryMethod && state.deliveryMethod.deliveryType || ' ')
        : state.deliveryTypeApplied;

      return {
        ...state,
        isEditDeliveryAddress: true,
        deliveryTypeApplied: delvTypeApplied,
      };
    case TOGGLE_DELIVERY_EDIT_OPTION:
      return {
        ...state,
        isEditDeliveryOption: true,
        deliveryMethod: [],
        deliveryTypeApplied: ' ',
        deliveryStandard: { 1: {} },
      };
    case SET_DELIVERY_METHOD_SUCCESS: {
      const { deliveryType, shouldResetDeliveryApplied } = action;
      const deliveryMethod = shouldResetDeliveryApplied ? state.deliveryMethod : [{ deliveryType }];
      const deliveryStandard = shouldResetDeliveryApplied ? state.deliveryStandard : { 1: {} };
      const deliveryTypeApplied = shouldResetDeliveryApplied ? ' ' : (deliveryType || ' ');

      return {
        ...state,
        deliveryMethod,
        deliveryTypeApplied,
        deliveryStandard,
      };
    }
    case SET_DELIVERY_METHOD_FAIL:
      return {
        ...state,
        deliveryMethod: [],
        deliveryStandard: { 1: {} },
      };
    case LOAD_DELIVERY_METHOD_SUCCESS:
      let deliveryMethod = mapDeliveryMethod(action.result);

      const delvApplied = (deliveryMethod.length > 1) ? SHIPPING : deliveryMethod[0].deliveryType;

      deliveryMethod = action.isFromDeliveryPage ? deliveryMethod.filter(item => item.splitNo <= state.splitCount) : deliveryMethod;

      return {
        ...state,
        methodLoaded: true,
        methodLoadFailed: false,
        deliveryMethod,
        deliveryTypeApplied: delvApplied,
        deliveryPreference: action.result.split_div,
      };
    case LOAD_DELIVERY_METHOD_FAIL:
      return {
        ...state,
        methodLoadFailed: true,
      };
    case SET_SHIPPING_ADDRESS_FIELD:
      const field = {};

      field[action.name] = action.value;

      const address = Object.assign({}, state.shippingAddress, field);

      return {
        ...state,
        shippingAddress: address,
      };
    case SET_SHIPPING_ADDRESS_RESULT:
      const actionResult = action.address;
      const result = Object.assign({}, state.shippingAddress, actionResult);

      return {
        ...state,
        shippingAddress: result,
      };
    case SET_PREVIOUS_LOCATION_COOKIE:
    case GET_PREVIOUS_LOCATION_COOKIE:
      return {
        ...state,
        previousLocation: action.cookie.value,
      };
    case REMOVE_PREVIOUS_LOCATION_COOKIE:
      return {
        ...state,
        previousLocation: DELIVERY,
      };
    case LOAD_DELIVERY_METHODS_SUCCESS:
      const mappedResult = mapDeliveryMethods(action.result);
      const deliveryPreference = state.deliveryPreference || mappedResult.defaultDeliveryPreference;

      return {
        ...state,
        ...mappedResult,
        deliveryPreference,
        methodOptionsLoaded: true,
      };
    // get calls to cart_id provides some data that is otherwise coming from delivery and ship_to APIs.
    // set them here accordingly to prevent doing additional API calls.
    case LOAD_CART_SUCCESS:
      if (!action.isCurrentBrand) {
        // If the last loaded cart's brand differ from checkout brand or
        // brand in URL search query, we return newly calculated state.cart[brand]
        // and will NOT update the common properties under state.cart.
        return state;
      }

      // If loaded cart's brand is same as brand in URL search query (or checkout brand) we can update
      // state.delivery with delivery parameters from GET cart. So let's fall-through delivery reducer
      const deliveyAddressResult = mapDeliveryAddress(action.result);
      const billingAddressResult = mapBillingToLocalAddress(action.result);
      const updatedShippingAddress = {};
      const isBillingAddress = !!billingAddressResult.postalCode;

      if (deliveyAddressResult.receiverCountryCode) {
        updatedShippingAddress.shippingAddressLoaded = true;
        updatedShippingAddress.currentShippingAddress = deliveyAddressResult;
      }

      return {
        ...state,
        ...updatedShippingAddress,
        deliveryTypeApplied: action.result.delv_type || ' ',
        isBillingAddress,
      };
    case LOAD_SHIPPING_THRESHOLD_SUCCESS:
      const shippingThresholdResult = mapShippingThresholdAmount(action.result);

      return {
        ...state,
        chargesLoaded: true,
        shippingThreshold: shippingThresholdResult,
      };
    case SAVE_SHIPPING_ADDRESS_LOCALLY:
      return {
        ...state,
        isEditDeliveryAddress: false,
        isEditDeliveryOption: false,
        currentShippingAddress: action.data,
      };
    case SAVE_SHIPPING_ADDRESS_SUCCESS:
      return {
        ...state,
        isEditDeliveryAddress: false,
        isEditDeliveryOption: false,
      };
    case SAVE_AS_BILLING_ADDRESS_SUCCESS:
      return {
        ...state,
        billingAddress: action.result,
        setOption: {
          shouldSetBillingAddress: false,
        },
      };
    case SET_BILLING_ADDRESS_AS:
      return {
        ...state,
        setOption: {
          shouldSetBillingAddress: action.shouldSetBilling,
        },
      };
    case LOAD_BILLING_ADDRESS_SUCCESS:
      return {
        ...state,
        isBillingAddress: true,
      };
    case LOAD_BILLING_ADDRESS_FAIL:
      return {
        ...state,
        isBillingAddress: false,
      };
    case TOGGLE_SET_BILLING_ADDRESS:
      return {
        ...state,
        setOption: {
          shouldSetBillingAddress: !state.setOption.shouldSetBillingAddress,
        },
      };
    case SET_ADDRESS_TO_EDIT:
      return {
        ...state,
        shippingAddress: action.address,
      };
    case SET_DELIVERY_METHOD_OPTION:
      let delMethod = [];
      let delStandard = { 1: {} };

      if (action.isEditShippingPreference) {
        delMethod = [...state.deliveryMethod];
        delStandard = { ...state.deliveryStandard };
        let index = delMethod.findIndex(item => item.splitNo === action.splitNo);

        index = index === -1 ? delMethod.length : index;
        delMethod[index] = {
          deliveryType: action.result,
          deliveryReqDate: action.date,
          deliveryReqTime: action.time,
          splitNo: action.splitNo,
        };

        if (state.deliveryPreference === SPLIT_DELIVERY) {
          if (action.result === YU_PACKET || action.result === YAMATO_MAIL) {
            delStandard = { 1: {} };

            for (let i = 0; i < delMethod.length; i++) {
              const delItem = delMethod[i];
              const hasMixedPreferences = delItem && (delItem.deliveryType === SAME_DAY ||
                (delItem.deliveryType === SHIPPING && (
                  (delItem.deliveryReqDate && delItem.deliveryReqDate !== NULL_TIMEFRAME) ||
                  (delItem.deliveryReqTime && delItem.deliveryReqTime !== NULL_TIMEFRAME)
                ))
              );

              if (hasMixedPreferences) {
                delMethod[i] = {
                  deliveryType: SHIPPING,
                  deliveryReqDate: '',
                  deliveryReqTime: '',
                  splitNo: delItem.splitNo,
                };
              }
            }
          } else if (isShippingDeliveryType(action.result)) {
            for (let i = 0; i < delMethod.length; i++) {
              const delItem = delMethod[i];
              const hasMixedPreferences = delItem && (delItem.deliveryType === YU_PACKET || delItem.deliveryType === YAMATO_MAIL);

              if (hasMixedPreferences) {
                delMethod[i] = {
                  deliveryType: SHIPPING,
                  deliveryReqDate: '',
                  deliveryReqTime: '',
                  splitNo: delItem.splitNo,
                };
              }
            }

            delStandard[action.splitNo] = {
              ...delStandard[action.splitNo],
              [state.deliveryPreference]: action.isDeliveryStandard,
            };
          }
        } else if (isShippingDeliveryType(action.result)) {
          delStandard[action.splitNo] = {
            ...delStandard[action.splitNo],
            [state.deliveryPreference]: action.isDeliveryStandard,
          };
        }
      } else {
        delMethod = [{
          deliveryType: action.result,
          deliveryReqDate: action.date,
          deliveryReqTime: action.time,
          splitNo: action.splitNo,
        }];
      }

      return {
        ...state,
        isEditDeliveryAddress: !action.isEditShippingPreference,
        isEditDeliveryOption: false,
        deliveryMethod: delMethod,
        deliveryStandard: delStandard,
      };
    case SET_DELIVERY_PREFERENCE:
      return {
        ...state,
        deliveryMethod: action.deliveryMethod || state.deliveryMethod,
        deliveryStandard: { 1: {} },
        deliveryPreference: action.value,
      };
    case RELOAD_DELIVERY_METHODS:
      return {
        ...state,
        methodOptionsLoaded: false,
      };
    case SHOW_ADDRESS_BOOK:
      return {
        ...state,
        isFromAddressBook: true,
      };
    case SAVE_AND_CONTINUE:
      const deliveryStandard = { ...state.deliveryStandard };
      const delivMethod = state.deliveryMethod || [];

      if (action.preserveSelection) {
        for (let i = 0; i < delivMethod.length; i++) {
          const currentDelvMethod = delivMethod[i];

          deliveryStandard[currentDelvMethod.splitNo] = {
            ...deliveryStandard[currentDelvMethod.splitNo],
            [state.deliveryPreference]:
              currentDelvMethod.deliveryType === SHIPPING && !(currentDelvMethod.deliveryReqDate || currentDelvMethod.deliveryReqTime),
          };
        }
      }

      return {
        ...state,
        isEditDeliveryAddress: false,
        isEditDeliveryOption: false,
        isFromAddressBook: false,
        deliveryStandard,
      };
    case LOAD_SAME_DAY_DELIVERY_CHARGE_SUCCESS:
      const sameDayDeliveryCharges = mapShippingThresholdAmount(action.result);

      return {
        ...state,
        sameDayDeliveryChargesLoaded: true,
        sameDayDeliveryCharges,
      };
    case GET_FM_STORE_SUCCESS:
      const fmStoreDetails = action.result;

      return {
        ...state,
        fmStoreDetails,
      };
    case DELETE_USER_ADDRESS_SUCCESS:
      return {
        ...state,
        shippingAddress: {},
      };
    case SET_FROM_PICKUP_STORE_AS:
      return {
        ...state,
        isFromPickupStore: action.isFromPickupStore,
      };
    case TOGGLE_CVS_NAV_MODAL:
      return {
        ...state,
        showCvsNavigationModal: !state.showCvsNavigationModal,
      };
    case LOAD_SPLIT_DETAILS_SUCCESS:
      return {
        ...state,
        splitDetailsLoaded: true,
        splitDetails: mapSplitDetails(action.result),
      };
    case LOAD_SPLIT_DETAILS_FAIL:
      return {
        ...state,
        splitDetailsLoaded: false,
      };
    case SET_DELIVERY_METHODS_SUCCESS:
      return {
        ...state,
        deliveryMethod: action.updateState ? action.shipments : [action.shipments[0]],
        deliveryPreference: action.splitDiv,
      };
    case GET_FM_STORE_FAIL:
    case LOAD_SAME_DAY_DELIVERY_CHARGE_FAIL:
    case LOAD_DELIVERY_METHODS_FAIL:
    case LOAD_SHIPPING_THRESHOLD_FAIL:
    case SAVE_SHIPPING_ADDRESS_FAIL:
    case SAVE_AS_BILLING_ADDRESS_FAIL:
    default:
      return state;
  }
}
