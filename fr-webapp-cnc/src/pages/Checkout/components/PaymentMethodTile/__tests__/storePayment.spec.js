import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import StorePayment from '../StorePayment.js';

const defaultProps = {
  store: {},
  paymentLink: '/jp/checkout/payment?brand=uq',
};

function mountItem() {
  return testHelpers.mountWithAll(<StorePayment {...defaultProps} />);
}

describe('src/pages/Checkout/components/PaymentMethodTile/StorePayment', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render StorePayment component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render store details correctly', () => {
    const error = wrapper.find('Text');

    expect(error.length).to.equal(3);
  });

  it('should render Link to payment page', () => {
    const error = wrapper.find('Link').first();

    expect(error.props().label).to.equal(i18n.common.edit);
    expect(error.props().to).to.equal('/jp/checkout/payment?brand=uq');
  });
});
