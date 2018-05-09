import React from 'react';
import { expect } from 'chai';
import AddressBook from '../AddressBook.js';

const state = {
  auth: {},
  delivery: {
    shippingAddress: {},
    setOption: {
      shouldSetBillingAddress: true,
    },
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
    userInfoAddressList: [],
  },
  order: {
    orderSummary: {},
  },
};

function setup() {
  return testHelpers.mountWithAll(<AddressBook />, state);
}
describe('src/pages/Checkout/Delivery/Shipping/AddressPanel/AddressBook', () => {
  const wrapper = setup();

  it('should render AddressBook component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render AddressGrid component correctly', () => {
    const component = wrapper.find('AddressGrid');

    expect(component.length).to.equal(1);
  });
});
