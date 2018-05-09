import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import TimeFrame from 'components/TimeFrame';
import ShippingTimeFrame from '../index';

const store = {
  delivery: {
    deliveryMethod: [{ splitNo: '1', deliveryType: '5' }, { splitNo: '2', deliveryType: '5' }],
    deliveryTypeApplied: '5',
    deliveryMethodList: {
      1: {
        C: { deliveryDetails: [{ deliveryType: '5', splitDiv: 'C', splitNo: '1' }] },
        S: { deliveryDetails: [{ deliveryType: '5', splitDiv: 'S', splitNo: '1' }] },
      },
      2: { S: { deliveryTypes: ['5'], deliveryDetails: [{ deliveryType: '5', splitDiv: 'S', splitNo: '2' }] } },
    },
    deliveryTypes: ['5', '15', '18', '13', '11'],
    isSplitDeliveryAvailable: true,
    isShippingGroupDeliveryAvailable: true,
    splitDetails: { 1: { split_no: 1, cartItemsSeqNo: ['1'] }, 2: { split_no: 2, cartItemsSeqNo: ['2'] } },
    splitCount: 2,
    splitDetailsLoaded: true,
  },
};

function mountItem(state = {}) {
  const globalState = { ...store, ...state };

  return testHelpers.mountWithAll(<ShippingTimeFrame />, globalState);
}

describe('src/pages/Checkout/components/ShippingTimeFrame', () => {
  let wrapper;

  describe('ShippingTimeFrame - Group Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render ShippingTimeFrame component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render ShippingTimeFrame wrapper Panel', () => {
      const panel = wrapper.find('Panel').first();

      expect(panel.props().title).to.equal(i18n.orderConfirmation.shippingMethod);
    });

    it('should render TimeFrame component correctly', () => {
      const timeFrame = wrapper.find(TimeFrame);

      expect(timeFrame.length).to.equal(1);
    });

    it('should render ProductImagess component correctly', () => {
      const timeFrame = wrapper.find('ProductImages');

      expect(timeFrame.length).to.equal(1);
    });
  });
  describe('ShippingTimeFrame - Split Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem({ delivery: { ...store.delivery, deliveryPreference: 'S' } });
    });

    it('should render TimeFrame component correctly', () => {
      const timeFrame = wrapper.find(TimeFrame);

      expect(timeFrame.length).to.equal(2);
    });

    it('should render ProductImages component correctly', () => {
      const timeFrame = wrapper.find('ProductImages');

      expect(timeFrame.length).to.equal(2);
    });
  });
});
