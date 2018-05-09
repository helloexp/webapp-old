import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import config from 'config/site/default';
import Payment from '../index';

const store = {
  cart: {
    uq: {
      cartNumber: '0101-171017162107-2297',
      token: '57bf2440517df91efed74e214637e0249a9cac162edfb27af21577f81e991baf',
      items: [],
    },
    gu: {
      cartNumber: '0101-171017162107-2298',
      token: '7df91efecac162edfb27af215777457f81e991bafdbf244051e214637e0249a9',
      items: [],
    },
    giftCookie: {},
  },
  coupons: { addedCoupon: { uq: {}, gu: {} } },
  payment: {
    paymentMethods: [],
    showConfirmationBox: true,
    payAtUQStoreChangeConfirm: true,
    isConfirmPostPay: true,
  },
  delivery: {
    shippingThreshold: [{ deliveryType: '5' }],
    deliveryMethod: [{ deliveryType: '', splitNo: '1' }],
    currentShippingAddress: {},
    splitDetails: [],
    deliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [
            {
              date: '00',
              timeSlots: [
                '00',
              ],
            },
          ],
          deliveryTypes: ['5'],
          deliveryDetails: [
            {
              deliveryType: '5',
              splitDiv: 'C',
              splitNo: '1',
            },
          ],
        },
      },
    },
    deliveryPreference: 'C',
  },
  giftCard: { giftCards: [] },
};

function mountItem(state = {}) {
  return testHelpers.mountWithAll(<Payment />, { ...store, ...state }, config, i18n);
}

describe('src/pages/Checkout/Payment', () => {
  let wrapper;

  describe('Payment page - Group Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render Payment component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render Delivery Method Heading', () => {
      const deliveryHeading = wrapper.find('Heading').first();

      expect(deliveryHeading.props().headingText).to.equal(i18n.heading.deliveryMethod);
    });

    it('should render Delivery Method edit Button', () => {
      const editButton = wrapper.find('Button').first();

      expect(editButton.props().children).to.equal(i18n.common.edit);
    });

    it('should render shipping AddressPanel component', () => {
      const addressPanel = wrapper.find('AddressPanel');

      expect(addressPanel.length).to.equal(1);
    });

    it('should render ShippingTimeFrame component', () => {
      const shippingTimeFrame = wrapper.find('ShippingTimeFrame');

      expect(shippingTimeFrame.length).to.equal(1);
    });

    it('should render GiftPanel component', () => {
      const giftPanel = wrapper.find('GiftPanel');

      expect(giftPanel.length).to.equal(1);
    });

    it('should render Delivery Method Heading', () => {
      const paymentHeading = wrapper.find('Heading').at(5);

      expect(paymentHeading.props().headingText).to.equal(i18n.heading.paymentMethod);
    });

    it('should render PaymentMethods component', () => {
      const paymentMethods = wrapper.find('PaymentMethods');

      expect(paymentMethods.length).to.equal(1);
    });

    it('should render CouponPanel component', () => {
      const couponPanel = wrapper.find('CouponPanel');

      expect(couponPanel.length).to.equal(1);
    });

    it('should render edit confirm MessageBox component', () => {
      const editConfirm = wrapper.find('MessageBox');

      expect(editConfirm.length).to.equal(3);
    });
  });

  describe('Payment page - Split Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem({
        ...store,
        delivery: {
          ...store.delivery,
          deliveryPreference: 'S',
        },
      });
    });

    it('should render DeliveryPreferencePanel component', () => {
      const deliveryPreferencePanel = wrapper.find('DeliveryPreferencePanel');

      expect(deliveryPreferencePanel.length).to.equal(1);
    });

    it('should not render GiftPanel component', () => {
      const giftPanel = wrapper.find('GiftPanel');

      expect(giftPanel.length).to.equal(0);
    });

    it('should not render CouponPanel component', () => {
      const couponPanel = wrapper.find('CouponPanel');

      expect(couponPanel.length).to.equal(0);
    });
  });
});
