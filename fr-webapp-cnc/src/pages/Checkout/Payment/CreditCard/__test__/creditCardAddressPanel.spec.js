import React from 'react';
import { expect } from 'chai';
import CreditCardAddressPanel from '../CreditCardAddressPanel';

function mountItem() {
  return testHelpers.mountWithAll(<CreditCardAddressPanel />);
}

describe('src/pages/Checkout/Payment/CreditCard/CreditCardAddressPanel', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CreditCardAddressPanel component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render AddressPanel component', () => {
    const addressPanel = wrapper.find('AddressPanel');

    expect(addressPanel.length).to.equal(1);
  });
});
