import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import DeliveryMethods from '../index';

const store = {
  delivery: {
    deliveryMethod: [],
    deliveryMethodList: {
      1: {
        C: {
          deliveryTypes: {},
        },
      },
    },
    deliveryTypes: ['5', '15', '18', '13', '11'],
    shippingThreshold: [
      {
        deliveryType: '5',
        shippingFee: '450',
        thresholdPrice: '5000',
        countryCode: '392',
        brandCode: '10',
      },
    ],
  },
  userInfo: {
    userDefaultDetails: {
      email: 'email@email.com',
      gender: '01',
      birthday: '19800201',
      lastName: 'コンニ',
      firstName: 'コンニ',
      lastNameKatakana: 'コニ',
      firstNameKatakana: 'コニチ',
      prefecture: '青森県',
      city: 'コンニチ',
      street: 'コンニチ',
      apt: 'コンニチハ',
      postalCode: '1900012',
      phoneNumber: '737373737373',
      cellPhoneNumber: '838383838338',
      isDefaultShippingAddress: false,
    },
  },
};

function mountItem(state = {}) {
  return testHelpers.mountWithAll(<DeliveryMethods />, { ...store, ...state });
}

describe('src/pages/Checkout/Delivery/DeliveryMethods', () => {
  let wrapper;

  describe('Delivery option enabled', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render DeliveryMethods component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render Shipping component', () => {
      const shipping = wrapper.find('Shipping');

      expect(shipping.length).to.equal(1);
    });

    it('should render PickupStore component', () => {
      const pickupStore = wrapper.find('PickupStore');

      expect(pickupStore.length).to.equal(1);
    });

    it('should render ConvenienceStore component', () => {
      const convenienceStore = wrapper.find('ConvenienceStore');

      expect(convenienceStore.length).to.equal(1);
    });
  });

  describe('Delivery option not enabled', () => {
    beforeEach(() => {
      wrapper = mountItem({
        delivery: {
          ...store.delivery,
          isEditDeliveryAddress: false,
          isEditDeliveryOption: false,
          currentShippingAddress: {
            lastNameKatakana: 'コニ',
            firstNameKatakana: 'コニチ',
          },
          deliveryMethod: [
            {
              deliveryType: '5',
              deliveryReqDate: '',
              deliveryReqTime: '',
              splitNo: '1',
            },
          ],
        },
      });
    });

    it('should render DeliveryMethods component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render AddressPanel component', () => {
      const addressPanel = wrapper.find('AddressPanel');

      expect(addressPanel.length).to.equal(1);
    });

    it('should render title of AddressPanel correctly', () => {
      const addressPanel = wrapper.find('AddressPanel');

      expect(addressPanel.props().title).to.equal(i18n.checkout.shipping);
    });
  });
});
