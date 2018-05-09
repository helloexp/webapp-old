import React from 'react';
import { expect } from 'chai';
import ShoppingBagSummary from '../index';
import CartItems from '../CartItems';

const state = {
  paymentStore: { appliedStore: {} },
};

const defaultProps = {
  cartItems: [{
    count: 5,
    title: 'Some item here',
  }],
  isUniqlo: true,
  totalItems: 5,
};

function mountShoppingBagSummary(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<ShoppingBagSummary {...renderProps} />, state);
}

describe('components/ShoppingBagSummary', () => {
  it('should render correctly', () => {
    const wrapper = mountShoppingBagSummary();

    expect(wrapper.length).to.equal(1);
  });

  it('should render the CartItems', () => {
    const wrapper = mountShoppingBagSummary();

    expect(wrapper.find(CartItems).length).to.equal(1);
  });
});
