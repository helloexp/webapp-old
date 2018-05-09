import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import GiftCard from '../index';

const store = {
  cart: {
    uq: {
      orderSummary: {},
    },
    billingAddress: {
      receiverCountryCode: '392',
      firstName: 'カタカナ',
      lastName: 'カタカナ',
      firstNameKatakana: 'カタカナ',
      lastNameKatakana: 'カタカナ',
      prefecture: '富山県',
      city: 'カタカナ',
      street: 'カタカナ',
      streetNumber: 'カタカナ',
      apt: 'カタカナ',
      postalCode: '1076231',
      phoneNumber: '9999999999999',
      cellPhoneNumber: '',
      email: 'craig@uniqlo.co.jp',
    },
  },
  giftCard: { giftCards: [], giftCard: {} },
  payment: {
    paymentMethod: '0',
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<GiftCard />, store);
}

describe('src/pages/Checkout/Payment/GiftCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render GiftCard component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render GiftCard BoxSelector component', () => {
    const boxSelector = wrapper.find('BoxSelector').first();

    expect(boxSelector.props().label).to.equal(i18n.payment.payGiftcard);
  });

  it('should render GiftCardContainer component', () => {
    const giftCardContainer = wrapper.find('GiftCardContainer');

    expect(giftCardContainer.length).to.equal(1);
  });
});
