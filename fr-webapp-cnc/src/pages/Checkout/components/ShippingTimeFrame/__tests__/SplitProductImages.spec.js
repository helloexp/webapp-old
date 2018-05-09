import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import SplitProductImages from '../SplitProductImages';

const defaultProp = {
  splitNo: '1',
};

function mountItem(store = {}) {
  return testHelpers.mountWithAll(<SplitProductImages {...defaultProp} />, store);
}

describe('src/pages/Checkout/components/ShippingTimeFrame/SplitProductImages', () => {
  let wrapper;

  describe('SplitProductImages - Group Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render SplitProductImages component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render ShippingTimeFrame wrapper Panel without split number', () => {
      const panel = wrapper.find('Panel');

      expect(panel.props().title).to.equal(false);
    });

    it('should render ProductImages component correctly', () => {
      const productImages = wrapper.find('ProductImages');

      expect(productImages.length).to.equal(1);
    });
  });

  describe('SplitProductImages - Group Delivery', () => {
    beforeEach(() => {
      wrapper = mountItem({ delivery: { deliveryPreference: 'S' } });
    });

    it('should render ShippingTimeFrame wrapper Panel with split number', () => {
      const panel = wrapper.find('Panel');

      expect(panel.props().title).to.equal(`${i18n.delivery.shipment} 1`);
    });
  });
});
