import React from 'react';
import { expect } from 'chai';
import CreditCardAddressForm from '../CreditCardAddressForm';

function mountItem() {
  return testHelpers.mountWithAll(<CreditCardAddressForm />);
}

describe('src/pages/Checkout/Payment/CreditCard/CreditCardAddressForm', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CreditCardAddressForm component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render AddressForm component', () => {
    const addressForm = wrapper.find('AddressForm');

    expect(addressForm.length).to.equal(1);
  });
});
