import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import SimpleTile from '../SimpleTile.js';

const defaultProps = {
  editable: true,
  paymentType: '3',
};

function mountItem() {
  return testHelpers.mountWithAll(<SimpleTile {...defaultProps} />);
}

describe('src/pages/Checkout/components/PaymentMethodTile/SimpleTile', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render SimpleTile component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render paymentMethodText Text correctly', () => {
    const text = wrapper.find('Text');

    expect(text.props().children).to.equal(i18n.paymentMethod.cashOnDelivery);
  });

  it('should render PaymentLink component', () => {
    const paymentLink = wrapper.find('PaymentLink');

    expect(paymentLink.length).to.equal(1);
  });
});
