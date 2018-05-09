import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import ReviewOrder from '../index';

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
  paymentStore: {},
  delivery: {
    shippingThreshold: [{ deliveryType: '5' }],
    deliveryMethod: [{ deliveryType: '', splitNo: '1' }],
    currentShippingAddress: {},
    splitDetails: {},
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
  creditCard: {},
  giftCard: { giftCards: [] },
};

function mountItem(state = {}) {
  return testHelpers.mountWithAll(<ReviewOrder />, { ...store, ...state });
}

describe('src/pages/Checkout/ReviewOrder', () => {
  let wrapper;

  describe('ReviewOrder page - Group Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render ReviewOrder component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render ReviewOrder Heading', () => {
      const reviewOrderHeading = wrapper.find('Heading').first();

      expect(reviewOrderHeading.props().headingText).to.equal(i18n.reviewOrder.confirmOrder);
    });

    it('should render ReviewOrder warning Text', () => {
      const reviewOrderText = wrapper.find('Text').first();

      expect(reviewOrderText.props().children).to.equal(i18n.reviewOrder.reviewOrderText);
    });

    it('should render Delivery Method Heading', () => {
      const deliveryHeading = wrapper.find('Heading').at(1);

      expect(deliveryHeading.props().headingText).to.equal(i18n.heading.deliveryMethod);
    });

    it('should render Delivery Method edit Button', () => {
      const editButton = wrapper.find('Button').at(1);

      expect(editButton.props().children).to.equal(i18n.common.edit);
    });

    it('should render shipping DeliveryDetails component', () => {
      const deliveryDetails = wrapper.find('DeliveryDetails');

      expect(deliveryDetails.length).to.equal(1);
    });

    it('should render Payment Method Heading', () => {
      const paymentHeading = wrapper.find('Heading').at(6);

      expect(paymentHeading.props().headingText).to.equal(i18n.heading.paymentMethod);
    });

    it('should render PaymentDetails component', () => {
      const paymentDetails = wrapper.find('PaymentDetails');

      expect(paymentDetails.length).to.equal(1);
    });

    it('should render CouponPanel component', () => {
      const giftPanel = wrapper.find('CouponPanel');

      expect(giftPanel.length).to.equal(1);
    });

    it('should render OrderSummarySegment component', () => {
      const orderSummarySegment = wrapper.find('OrderSummarySegment');

      expect(orderSummarySegment.length).to.equal(1);
    });
  });
  describe('ReviewOrder page - Split Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem({
        ...store,
        delivery: {
          ...store.delivery,
          deliveryPreference: 'S',
        },
      });
    });

    it('should not render CouponPanel component', () => {
      const couponPanel = wrapper.find('CouponPanel');

      expect(couponPanel.length).to.equal(0);
    });
  });
});
