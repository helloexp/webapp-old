import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import CashDelivery from '../index';

const store = {
  giftCard: { giftCards: [], giftCard: {} },
};

function mountItem() {
  return testHelpers.mountWithAll(<CashDelivery />, store);
}

describe('src/pages/Checkout/Payment/CashDelivery', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CashDelivery component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render BoxSelector component', () => {
    const boxSelector = wrapper.find('BoxSelector');

    expect(boxSelector.length).to.equal(1);
    expect(boxSelector.props().label).to.equal(i18n.payCash.cashDelivery);
  });
});
