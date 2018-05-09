import React from 'react';
import { expect } from 'chai';
import SplitOrder from '../index';
import OrderDetails from '../../../OrderDetails';

const state = {
  cart: {
    giftCookie: {},
    uq: {},
  },
};

const childProps = {
  deliveryMethod: {},
  storeDetail: {
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
  },
  barcodeInfo: { barcodeImage: {} },
  items: [],
  orderConfirmDetails: { order_delv: {} },
};

function mountItem() {
  return testHelpers.mountWithAll(<SplitOrder><OrderDetails {...childProps} /></SplitOrder>, state);
}

describe('src/pages/Checkout/ConfirmOrder/components/SplitOrder', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render SplitOrder component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Panel component', () => {
    const panel = wrapper.find('Panel');

    expect(panel.length).to.equal(1);
  });

  it('should not show child component when collapsed', () => {
    const orderDetails = wrapper.find('OrderDetails');

    expect(orderDetails.length).to.equal(0);
  });

  it('should show child component when expanded', () => {
    const panel = wrapper.find('Panel');

    panel.props().onToggle();
    const orderDetails = wrapper.find('OrderDetails');

    expect(orderDetails.length).to.equal(1);
  });
});
