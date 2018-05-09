import expect from 'expect';
import deliveryReducer from '../delivery';
import {
  TOGGLE_DELIVERY_EDIT,
  SET_SHIPPING_ADDRESS_FIELD,
  SET_SHIPPING_ADDRESS_RESULT,
  LOAD_DELIVERY_METHOD,
} from '../delivery/actions';

describe('redux/modules/delivery', () => {
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
    previousLocation: 'delivery',
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

  const address = {
    lastName: 'Villa',
    firstName: 'Crysfel',
    salutation: 'Mr',
    postalCode: '100-8994',
    prefecture: 'Chiyoda',
    city: 'Tokyo',
    street: '2-7-2 Marunouchi',
    email: 'crysfel@moduscreate.com',
    phoneNumber: '555-123-9876',
  };

  it('should return the initial state', () => {
    expect(
      deliveryReducer(undefined, {})
    ).toEqual(initialState);
  });

  it('Should Toggle edit delivery method page', () => {
    expect(
      deliveryReducer({}, {
        type: TOGGLE_DELIVERY_EDIT,
        shouldEditDeliveryTypeApplied: true,
      })
    ).toEqual({ deliveryTypeApplied: ' ', isEditDeliveryAddress: true });
  });

  it('Should set shipping address field', () => {
    expect(
      deliveryReducer({ shippingAddress: {} }, {
        type: SET_SHIPPING_ADDRESS_FIELD,
        name: 'firstName',
        value: 'Alyce',
      })
    ).toEqual({ shippingAddress: { firstName: 'Alyce' } });
  });

  it('Should set shipping address result', () => {
    expect(
      deliveryReducer(undefined, {
        type: SET_SHIPPING_ADDRESS_RESULT,
        address,
      })
    ).toEqual({
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
      shippingAddress: {
        city: 'Tokyo',
        email: 'crysfel@moduscreate.com',
        firstName: 'Crysfel',
        lastName: 'Villa',
        phoneNumber: '555-123-9876',
        postalCode: '100-8994',
        prefecture: 'Chiyoda',
        salutation: 'Mr',
        street: '2-7-2 Marunouchi',
      },
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
      previousLocation: 'delivery',
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
    });
  });

  it('Should load delivery method field', () => {
    expect(
      deliveryReducer({ deliveryMethod: { deliveryMethod: 'Shipping' } }, {
        type: LOAD_DELIVERY_METHOD,
      })
    ).toEqual({ deliveryMethod: { deliveryMethod: 'Shipping' } });
  });
});
