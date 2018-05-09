import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import PaymentConfirmation from '../PaymentConfirmation';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<PaymentConfirmation {...props} />);
}

describe('src/pages/Checkout/ConfirmOrder/PaymentConfirmation', () => {
  let wrapper;

  it('should render PaymentConfirmation component correctly', () => {
    wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });
  it('should render Heading component', () => {
    wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
    expect(heading.props().headingText).to.equal(i18n.orderConfirmation.paymentMethod);
  });

  describe('PaymentConfirmation - GiftCard payment', () => {
    it('should render payment method Text component', () => {
      wrapper = mountItem({ orderConfirmDetails: { payment_type: '0' } });
      const text = wrapper.find('Text');

      expect(text.length).to.equal(1);
      expect(text.props().children).to.equal(i18n.orderConfirmation.giftCard);
    });
  });

  describe('PaymentConfirmation - CreditCard payment', () => {
    it('should render payment method Text component', () => {
      wrapper = mountItem({ orderConfirmDetails: { payment_type: '1' } });
      const text = wrapper.find('Text');

      expect(text.length).to.equal(1);
      expect(text.props().children).to.equal(i18n.orderConfirmation.creditCard);
    });
  });

  describe('PaymentConfirmation - GiftCard and CreditCard payment', () => {
    it('should render payment method Text component', () => {
      wrapper = mountItem({ orderConfirmDetails: { payment_type: '1', gift_card_flg: '1' } });
      const text = wrapper.find('Text');

      expect(text.length).to.equal(1);
      expect(text.props().children).to.equal(i18n.orderConfirmation.giftCredit);
    });
  });

  describe('PaymentConfirmation - COD payment', () => {
    it('should render payment method Text component', () => {
      wrapper = mountItem({ orderConfirmDetails: { payment_type: '3' } });
      const text = wrapper.find('Text');

      expect(text.length).to.equal(1);
      expect(text.props().children).to.equal(i18n.orderConfirmation.cashOnDelivery);
    });
  });

  describe('PaymentConfirmation - PostPay payment', () => {
    it('should render payment method Text component', () => {
      wrapper = mountItem({ orderConfirmDetails: { payment_type: 'D' } });
      const text = wrapper.find('Text');

      expect(text.length).to.equal(1);
      expect(text.props().children).to.equal(i18n.paymentMethod.postPay.join(''));
    });
  });
});
