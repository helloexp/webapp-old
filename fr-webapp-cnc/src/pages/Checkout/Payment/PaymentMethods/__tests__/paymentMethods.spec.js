import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import config from 'config/site/default';
import PaymentMethods from '../index';

const store = {
  cart: {
    uq: { orderSummary: {} },
    billingAddress: {},
    orderSummary: {},
  },
  creditCard: {},
  giftCard: { giftCards: [], giftCard: {} },
  paymentStore: { appliedStore: {} },
  payment: { paymentMethods: ['B', '1', 'D', '3'] },
  delivery: {
    currentShippingAddress: {},
    deliveryMethod: [{ splitNo: '1', deliveryType: '5' }, { splitNo: '2', deliveryType: '5' }],
    deliveryPreference: 'C',
  },
  userInfo: {
    userDefaultDetails: { email: 'craig@uniqlo.co.jp', postalCode: '1076231' },
  },
};

function mountItem(state = {}) {
  return testHelpers.mountWithAll(<PaymentMethods />, { ...store, ...state }, config, i18n);
}

describe('src/pages/Checkout/Payment/PaymentMethods', () => {
  let wrapper;

  describe('PaymentMethods section - Group Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render PaymentMethods component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render PostPay component', () => {
      const postPay = wrapper.find('PostPay');

      expect(postPay.length).to.equal(1);
    });

    it('should render StorePayment component', () => {
      const uqStore = wrapper.find('StorePayment');

      expect(uqStore.length).to.equal(1);
    });

    it('should render CashDelivery component', () => {
      const cashOnDelivery = wrapper.find('CashDelivery');

      expect(cashOnDelivery.length).to.equal(1);
    });

    it('should render CreditCard component', () => {
      const creditCard = wrapper.find('CreditCard');

      expect(creditCard.length).to.equal(1);
    });

    it('should render GiftCard component', () => {
      const giftCard = wrapper.find('GiftCard');

      expect(giftCard.length).to.equal(1);
    });
  });

  describe('PaymentMethods section - Split Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem({
        payment: { paymentMethods: ['1'] },
        delivery: {
          ...store.delivery,
          deliveryPreference: 'S',
        },
      });
    });

    it('should render CreditCard component', () => {
      const creditCard = wrapper.find('CreditCard');

      expect(creditCard.length).to.equal(1);
    });

    it('should not render PostPay component', () => {
      const postPay = wrapper.find('PostPay');

      expect(postPay.length).to.equal(0);
    });

    it('should not render StorePayment component', () => {
      const uqStore = wrapper.find('StorePayment');

      expect(uqStore.length).to.equal(0);
    });

    it('should not render CashDelivery component', () => {
      const cashOnDelivery = wrapper.find('CashDelivery');

      expect(cashOnDelivery.length).to.equal(0);
    });

    it('should not render GiftCard component', () => {
      const giftCard = wrapper.find('GiftCard');

      expect(giftCard.length).to.equal(0);
    });
  });
});
