import React from 'react';
import { expect } from 'chai';
import GiftingDeliveryOptions from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<GiftingDeliveryOptions />);
}

describe('src/pages/Checkout/Delivery/GiftingDeliveryOptions', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render GiftingDeliveryOptions component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render GiftingWithTimeframe component', () => {
    const giftingWithTimeframe = wrapper.find('GiftingWithTimeframe');

    expect(giftingWithTimeframe.length).to.equal(1);
  });
});
