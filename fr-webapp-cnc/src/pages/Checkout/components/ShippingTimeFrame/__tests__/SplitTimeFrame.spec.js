import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import TimeFrame from 'components/TimeFrame';
import SplitTimeFrame from '../SplitTimeFrame';

const store = {
  delivery: {
    deliveryMethod: [{ splitNo: '1', deliveryType: '5' }, { splitNo: '2', deliveryType: '5' }],
    deliveryMethodList: {},
    splitDetails: { 1: { split_no: 1, cartItemsSeqNo: ['1'] }, 2: { split_no: 2, cartItemsSeqNo: ['2'] } },
  },
};

const defaultProp = {
  splitNo: '1',
};

function mountItem() {
  return testHelpers.mountWithAll(<SplitTimeFrame {...defaultProp} />, store);
}

describe('src/pages/Checkout/components/ShippingTimeFrame/SplitTimeFrame', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render SplitTimeFrame component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render SplitProductImages wrapper Panel', () => {
    const panel = wrapper.find('Panel').first();

    expect(panel.props().title).to.equal(`${i18n.delivery.shipment} 1`);
  });

  it('should render TimeFrame component correctly', () => {
    const timeFrame = wrapper.find(TimeFrame);

    expect(timeFrame.length).to.equal(1);
  });
});
