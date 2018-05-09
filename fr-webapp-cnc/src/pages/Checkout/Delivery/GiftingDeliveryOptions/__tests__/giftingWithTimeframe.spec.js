import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import GiftingWithTimeframe from '../GiftingWithTimeframe';

const store = {
  delivery: {
    shippingThreshold: [{ deliveryType: '5' }],
    deliveryMethod: [{ deliveryType: '', splitNo: '1' }],
    splitDetails: [],
    deliveryStandard: { 1: {} },
    nextDateOptions: { 1: { C: false } },
    deliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [{ date: '00', timeSlots: ['00'] }],
          deliveryTypes: ['5'],
          deliveryDetails: [{ deliveryType: '5', splitDiv: 'C', splitNo: '1' }],
        },
      },
    },
    deliveryPreference: 'C',
  },
};

const splitStore = {
  delivery: {
    ...store.delivery,
    deliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [{ date: '00', timeSlots: ['00'] }],
          deliveryTypes: ['5'],
          deliveryDetails: [{ deliveryType: '5', splitDiv: 'C', splitNo: '1' }],
        },
        S: {
          deliveryRequestedDateTimes: [{ date: '00', timeSlots: ['00'] }],
          deliveryTypes: ['5'],
          deliveryDetails: [{ deliveryType: '5', splitDiv: 'C', splitNo: '1' }],
        },
      },
      2: {
        S: {
          deliveryRequestedDateTimes: [{ date: '00', timeSlots: ['00'] }],
          deliveryTypes: ['5'],
          deliveryDetails: [{ deliveryType: '5', splitDiv: 'S', splitNo: '2' }],
        },
      },
    },
    deliveryPreference: 'S',
  },
};

const defaultProps = {
  timeFrameVisible: true,
  isApplyButtonVisible: true,
  toggleModal: sinon.spy(),
};

function mountItem(state = {}) {
  return testHelpers.mountWithAll(<GiftingWithTimeframe {...defaultProps} />, state);
}

describe('src/pages/Checkout/Delivery/GiftingDeliveryOptions/GiftingWithTimeframe', () => {
  let wrapper;

  describe('GiftingWithTimeframe - Group delivery', () => {
    beforeEach(() => {
      wrapper = mountItem(store);
    });

    it('should render GiftingWithTimeframe component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render GiftPanel component', () => {
      const giftPanel = wrapper.find('GiftPanel');

      expect(giftPanel.length).to.equal(1);
    });

    it('should not render DeliveryPreference component', () => {
      const giftPanel = wrapper.find('DeliveryPreference');

      expect(giftPanel.length).to.equal(0);
    });

    it('should trigger callback on clicking Info button', () => {
      const button = wrapper.find('Button').first();

      button.simulate('click');
      expect(defaultProps.toggleModal.calledOnce).to.equal(true);
    });

    it('should render ShippingPreferenceWrapper component', () => {
      const shippingPreferenceWrapper = wrapper.find('ShippingPreferenceWrapper');

      expect(shippingPreferenceWrapper.length).to.equal(1);
    });

    it('should render goto review order Button as disabled', () => {
      const button = wrapper.find('Button').at(1);

      expect(button.props().label).to.equal(i18n.checkout.continuePayment);
      expect(button.props().disabled).to.equal(true);
    });
  });

  describe('GiftingWithTimeframe - Split delivery', () => {
    beforeEach(() => {
      wrapper = mountItem(splitStore);
    });

    it('should not render GiftPanel component', () => {
      const giftPanel = wrapper.find('GiftPanel');

      expect(giftPanel.length).to.equal(0);
    });

    it('should render DeliveryPreference component', () => {
      const giftPanel = wrapper.find('DeliveryPreference');

      expect(giftPanel.length).to.equal(0);
    });
  });
});
