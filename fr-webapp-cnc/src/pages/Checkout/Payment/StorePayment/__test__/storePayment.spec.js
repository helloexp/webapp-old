import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import StorePayment from '../index';

const store = {
  userInfo: {
    userDefaultDetails: {
      email: 'craig@uniqlo.store',
    },
  },
  cart: {
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
  payment: {
    paymentMethod: 'B',
  },
  paymentStore: {
    appliedStore: {
      name: 'ユニクロ 銀座店',
      municipality: '中央区',
      city: '東京都',
      number: '銀座6-9-5',
    },
  },
  giftCard: { giftCards: [] },
};

function mountItem(props = {}, currentStore = {}) {
  return testHelpers.mountWithAll(<StorePayment {...props} />, { ...store, ...currentStore });
}

describe('src/pages/Checkout/Payment/StorePayment', () => {
  let wrapper;

  describe('StorePayment box selector checked', () => {
    const onSelect = sinon.spy();

    beforeEach(() => {
      wrapper = mountItem({ resetPaymentStore: onSelect });
    });

    it('should render StorePayment component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render expanded BoxSelector component', () => {
      const boxSelector = wrapper.find('BoxSelector');

      expect(boxSelector.length).to.equal(1);
      expect(boxSelector.props().checked).to.equal(true);
    });

    it('should render pay at store instructions Image', () => {
      const payAtStoreInstructions = wrapper.find('Image');

      expect(payAtStoreInstructions.length).to.equal(1);
    });

    it('should render PayInStoreAddress component', () => {
      const payInStoreAddress = wrapper.find('PayInStoreAddress');

      expect(payInStoreAddress.length).to.equal(1);
    });

    it('should render select new store Button', () => {
      const selectStoreButton = wrapper.find('Button').last();

      expect(selectStoreButton.props().label).to.equal(i18n.payment.payUniqloBtn);
    });
  });

  describe('StorePayment box selector unchecked', () => {
    beforeEach(() => {
      wrapper = mountItem({}, { payment: { paymentMethod: '' } });
    });

    it('should render collapsed BoxSelector component', () => {
      const boxSelector = wrapper.find('BoxSelector');

      expect(boxSelector.length).to.equal(1);
      expect(boxSelector.props().checked).to.equal(false);
    });
  });
});
