import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import OrderSummarySegment from '../OrderSummarySegment';

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
  delivery: {
    splitDetails: { 1: {}, 2: {} },
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
        S: {
          deliveryTypes: [5],
          deliveryRequestedDateTimes: [],
        },
      },
      2: {
        S: {
          deliveryTypes: [5],
          deliveryRequestedDateTimes: [],
        },
      },
    },
    deliveryPreference: 'C',
  },
};

function mountItem(state = {}) {
  return testHelpers.mountWithAll(<OrderSummarySegment />, { ...store, ...state });
}

describe('src/pages/Checkout/OrderSummarySegment', () => {
  let wrapper;

  describe('OrderSummarySegment - Group Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render OrderSummarySegment component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render PlaceOrder component', () => {
      const placeOrder = wrapper.find('PlaceOrder');

      expect(placeOrder.length).to.equal(1);
    });

    it('should render security info Label', () => {
      const securityInfo = wrapper.find('Label');

      expect(securityInfo.props().text).to.equal(i18n.reviewOrder.securityInfo);
    });

    it('should render ProxyLink component', () => {
      const proxyLink = wrapper.find('ProxyLink');

      expect(proxyLink.length).to.equal(1);
      expect(proxyLink.props().children).to.equal(i18n.common.tslTooltip.toolTipLinkText);
    });

    it('should render one OrderSummary component', () => {
      const orderSummary = wrapper.find('OrderSummary');

      expect(orderSummary.length).to.equal(1);
    });
  });
  describe('OrderSummarySegment - Split Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem({
        ...store,
        delivery: {
          ...store.delivery,
          deliveryPreference: 'S',
          splitCount: 2,
        },
      });
    });

    it('should render two OrderSummary components for each split', () => {
      const orderSummary = wrapper.find('OrderSummary');

      expect(orderSummary.length).to.equal(2);
    });

    it('should render total price Item', () => {
      const totalAmount = wrapper.find('Item').last();

      expect(totalAmount.props().description).to.equal(i18n.orderSummary.totalAmount);
    });
  });
});
