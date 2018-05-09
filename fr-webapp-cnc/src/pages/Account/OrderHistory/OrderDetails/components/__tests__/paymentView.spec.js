import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import PaymentView from '../PaymentView';

const defaultProps = {
  orderItemsDetail: { payment_type: '3' },
};

const defaultState = {
  order: {
    details: {
      payment_type: '3',
    },
  },
  paymentStore: {
    paymentStoreDetail: {},
  },
};

const payAtStoreState = {
  order: {
    details: {
      payment_type: 'B',
      pay_In_Store_Barcode_info: {},
    },
  },
  paymentStore: {
    paymentStoreDetail: {
      id: '123456',
    },
  },
};

function mountItem(store = {}, props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<PaymentView {...renderProps} />, store);
}

describe('src/pages/Account/OrderHistory/components/PaymentView', () => {
  let wrapper;

  describe('PaymentView - payment type is not PayAtStore', () => {
    beforeEach(() => {
      wrapper = mountItem(defaultState);
    });

    it('should render PaymentView component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should show PaymentView heading', () => {
      const heading = wrapper.find('Heading').first();

      expect(heading.props().headingText).to.equal(i18n.orderHistory.paymentMethod);
    });

    it('should show AddressPanel', () => {
      const addressPanel = wrapper.find('AddressPanel');

      expect(addressPanel.length).to.equal(1);
    });

    it('should show receipt heading', () => {
      const heading = wrapper.find('Heading').last();

      expect(heading.props().headingText).to.equal(i18n.orderHistory.receipt);
    });

    it('should show receipt not available text when reciept is not available', () => {
      const receiptText = wrapper.find('Text').last();

      expect(receiptText.props().children).to.equal(i18n.orderHistory.doNot);
    });

    it('should show payment method text correctly', () => {
      const paymentMethodText = wrapper.find('Text').first();

      expect(paymentMethodText.props().children).to.equal(i18n.paymentMethod.cashOnDelivery);
    });
  });

  describe('PaymentView - payment type is GiftCard', () => {
    beforeEach(() => {
      wrapper = mountItem(defaultState, { orderItemsDetail: { payment_type: '0' } });
    });

    it('should show payment method text correctly', () => {
      const paymentMethodText = wrapper.find('Text').first();

      expect(paymentMethodText.props().children).to.equal(i18n.paymentMethod.giftCard);
    });
  });

  describe('PaymentView - payment type is CreditCard', () => {
    beforeEach(() => {
      wrapper = mountItem(defaultState, { orderItemsDetail: { payment_type: '1' } });
    });

    it('should show payment method text correctly', () => {
      const paymentMethodText = wrapper.find('Text').first();

      expect(paymentMethodText.props().children).to.equal(i18n.paymentMethod.creditCard);
    });
  });

  describe('PaymentView - payment type is PostPay', () => {
    beforeEach(() => {
      wrapper = mountItem(defaultState, { orderItemsDetail: { payment_type: 'D' } });
    });

    it('should show payment method text correctly', () => {
      const paymentMethodText = wrapper.find('Text').first();

      expect(paymentMethodText.props().children).to.equal(i18n.paymentMethod.postPay.join(''));
    });
  });

  describe('PaymentView - payment type is GiftCard partial pay', () => {
    beforeEach(() => {
      wrapper = mountItem(defaultState, {
        orderItemsDetail: { payment_type: '1', gift_card_flg: '1' },
      });
    });

    it('should show payment method text correctly', () => {
      const paymentMethodText1 = wrapper.find('Text').first();
      const paymentMethodText2 = wrapper.find('Text').at(1);

      expect(paymentMethodText1.props().children).to.equal(i18n.paymentMethod.creditCard);
      expect(paymentMethodText2.props().children).to.equal(i18n.paymentMethod.giftCard);
    });
  });

  describe('PaymentView - receipt is available', () => {
    beforeEach(() => {
      wrapper = mountItem(defaultState, { receipt: true });
    });

    it('should show reciept available text when receipt is available', () => {
      const recieptText = wrapper.find('Text').last();

      expect(recieptText.props().children).to.equal(i18n.orderHistory.yes);
    });
  });

  describe('PaymentView -  payment type is PayAtStore', () => {
    beforeEach(() => {
      wrapper = mountItem(payAtStoreState);
    });

    it('should show StorePayment component', () => {
      const StorePayment = wrapper.find('StorePayment');

      expect(StorePayment.length).to.equal(1);
    });
  });
});
