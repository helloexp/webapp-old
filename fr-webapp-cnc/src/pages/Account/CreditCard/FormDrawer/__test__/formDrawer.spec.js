import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import FormDrawerTest from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<FormDrawerTest billingAddress={{ postalCode: 1001001 }} />);
}

describe('FormDrawer component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render FormDrawer', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Drawer title', () => {
    const Drawer = wrapper.find('Drawer');

    expect(Drawer.first().props().title).to.equal(i18n.creditCard.changeCCInfo);
  });

  it('should have CreditCardForm', () => {
    const CreditCardForm = wrapper.find('CreditCardForm');

    expect(CreditCardForm.length).to.equal(1);
  });

  it('should set user default details', () => {
    const header = testHelpers.mountWithAll(<FormDrawerTest billingAddress={{}} userDefaultDetails={{ postalCode: 1001001 }} />);
    const CreditCardForm = header.find('CreditCardForm');

    expect(CreditCardForm.length).to.equal(1);
  });
});
