import React from 'react';
import { expect } from 'chai';
import Shipping from '../index.js';

const state = {
  delivery: {
    isEditDeliveryOption: false,
    deliveryTypes: ['5'],
    isEditDeliveryAddress: true,
    isFromAddressBook: true,
    setOption: {
      shouldSetBillingAddress: true,
    },
    deliveryMethod: [
      {
        deliveryType: '5',
        deliveryReqDate: '',
        deliveryReqTime: '',
        splitNo: '1',
      },
    ],
    shippingThreshold: [
      {
        deliveryType: '5',
        shippingFee: '450',
        thresholdPrice: '5000',
        countryCode: '392',
        brandCode: '20',
      },
    ],
    deliveryMethodList: {
      1: {
        C: {},
      },
    },
  },
  userInfo: {
    userDefaultDetails: {
      email: 'test@uniqlo.com',
      gender: null,
      birthday: '',
      lastName: 'カナ',
      firstName: 'カナ',
      lastNameKatakana: 'カナ',
      firstNameKatakana: 'カナ',
      prefecture: '岩手県',
      city: '姓',
      street: '姓',
      apt: '',
      postalCode: '3460013',
      phoneNumber: '1234567890',
      cellPhoneNumber: '1234567890',
      isDefaultShippingAddress: true,
      updateTimestamp: 1505993097,
      cas: '1c5395e0efa3c2d7c688facb337b1e38',
      streetNumber: '姓',
    },
  },
  order: {
    orderSummary: {},
  },
};

function setup(store = {}) {
  return testHelpers.mountWithAll(<Shipping />, store);
}
describe('src/pages/Checkout/Delivery/Shipping', () => {
  let wrapper;

  describe('Shipping option is not selected', () => {
    beforeEach(() => {
      wrapper = setup({
        ...state,
        delivery: {
          ...state.delivery,
          deliveryMethod: [],
        },
      });
    });

    it('should render Shipping component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });
  });

  describe('Shipping option is selected', () => {
    beforeEach(() => {
      wrapper = setup(state);
    });

    it('should render Shipping component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render AddressBook when shouldShowAddressBook is true', () => {
      const component = wrapper.find('AddressBook');

      expect(component.length).to.equal(1);
    });

    it('should render ShippingAddressForm when shouldShowAddressForm is true', () => {
      wrapper = setup({
        ...state,
        userInfo: {
          userDefaultDetails: {},
        },
      });
      const component = wrapper.find('ShippingAddressForm');

      expect(component.length).to.equal(1);
    });
  });
});
