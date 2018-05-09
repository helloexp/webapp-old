import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import RegistrationConfirmTest from '../index';

const creditInfo = {
  cardHolder: 'dsa',
  cardType: 'VISA/MASTER',
  custNo: '7013926523952',
  dbKey: '0101JP17070620495668303',
  expiry: '1024',
  maskedCardNo: '459150******0000',
  selected: false,
};

function mountItem() {
  return testHelpers.mountWithAll(<RegistrationConfirmTest billingAddress={{ street: 'vcv' }} creditCardInfo={creditInfo} />);
}

describe('RegistrationConfirm component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render RegistrationConfirm', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have CreditCardPanel', () => {
    const CreditCardPanel = wrapper.find('CreditCardPanel');

    expect(CreditCardPanel.length).to.equal(1);
  });

  it('should have Button', () => {
    const button = wrapper.find('Button');

    expect(button.length).to.equal(2);
  });

  it('should have Button label', () => {
    const button = wrapper.find('Button');

    expect(button.first().props().label).to.equal(i18n.creditCard.proceedToRegistration);
    expect(button.at(1).props().label).to.equal(i18n.creditCard.backToRegistration);
  });

  it('should render addressPanel when DefaultAddressField is empty', () => {
    const header = testHelpers.mountWithAll(
      <RegistrationConfirmTest
        billingAddress={{ street: 'vcv' }} requiredDefaultAddressField={''} creditCardInfo={creditInfo}
      />);
    const AddressPanel = header.find('AddressPanel');

    expect(AddressPanel.length).to.equal(1);
  });
  it('should not render addressPanel when DefaultAddressField is not empty', () => {
    const header = testHelpers.mountWithAll(
      <RegistrationConfirmTest
        billingAddress={{ street: 'vcv' }} requiredDefaultAddressField={'address'} creditCardInfo={creditInfo}
      />);
    const AddressPanel = header.find('AddressPanel');

    expect(AddressPanel.length).to.equal(0);
  });
});
