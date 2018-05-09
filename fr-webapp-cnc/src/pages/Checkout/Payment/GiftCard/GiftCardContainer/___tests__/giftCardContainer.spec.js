import React from 'react';
import { expect } from 'chai';
import GiftCardContainer from '../index';

const store = {
  cart: {
    uq: {
      cartNumber: '0101-171024151439-3045',
      token: 'bc53dca0a28fcba904ede44a54eaadce13bff11eedfba2ac2d76334c048248e4',
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
  giftCard: {
    giftCards: [],
    balancePaymentMethod: null,
    giftCard: {
      index: 0,
      requestNumber: '20171024160738346636',
      number: '9999-xxxx-xxxx-0001',
      balance: 9945389,
      payment: 0,
      expires: '20201231000000',
    },
    balanceAmount: 0,
    editIndex: null,
    showContinueButton: true,
  },
  userInfo: {},
};

const defaultProps = {
  giftCard: {
    index: 0,
    requestNumber: '20171024160738346636',
    number: '9999-xxxx-xxxx-0001',
    balance: 9945389,
    payment: 0,
    expires: '20201231000000',
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<GiftCardContainer {...renderProps} />, store);
}

describe('src/pages/Checkout/Payment/GiftCard/GiftCardContainer', () => {
  let wrapper;

  describe('GiftCardContainer with valid giftCard', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render GiftCardContainer component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render GiftCardInfo component', () => {
      const boxSelector = wrapper.find('GiftCardInfo');

      expect(boxSelector.length).to.equal(1);
    });
  });

  describe('GiftCardContainer with out valid giftCard - show gift card form', () => {
    beforeEach(() => {
      wrapper = mountItem({ giftCard: null });
    });

    it('should render GiftCardForm component', () => {
      const giftCardForm = wrapper.find('GiftCardForm');

      expect(giftCardForm.length).to.equal(1);
    });
  });

  describe('GiftCardContainer with valid gift card editting case - show gift card info', () => {
    beforeEach(() => {
      wrapper = mountItem({ giftCard: {
        requestNumber: '20171024160738346636',
      } });
    });

    it('should render GiftCardInfo component', () => {
      const giftCardInfo = wrapper.find('GiftCardInfo');

      expect(giftCardInfo.length).to.equal(1);
    });
  });
});
