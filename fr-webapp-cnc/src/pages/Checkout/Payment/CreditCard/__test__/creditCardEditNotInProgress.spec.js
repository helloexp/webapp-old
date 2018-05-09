import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import CreditCardEditNotInProgress from '../CreditCardEditNotInProgress';

const defaultProps = {
  i18n,
};

function mountItem() {
  return testHelpers.mountWithAll(<CreditCardEditNotInProgress {...defaultProps} />);
}

describe('src/pages/Checkout/Payment/CreditCard/CreditCardEditNotInProgress', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CreditCardEditNotInProgress component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render use card Button component', () => {
    const useCardButton = wrapper.find('Button').first();

    expect(useCardButton.length).to.equal(1);
  });
});
