import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import PayInStoreAddressTest from '../PayInStoreAddress';

const currentUQStore = {
  name: 'UQstore',
};
const currentBillingAddress = {
  apt: '',
  birthday: '19800101',
  cas: '492391bf83c97a30315c67b9fd7ccabd',
  cellPhoneNumber: '',
  city: '',
  email: 'xyz36@mail.com',
  firstName: '',
  firstNameKatakana: '',
  gender: null,
  isDefaultShippingAddress: true,
  lastName: '',
  lastNameKatakana: '',
  phoneNumber: '',
  postalCode: '1410021',
  prefecture: '',
  street: '',
  streetNumber: '',
  updateTimestamp: 1495176366,
};

function mountItem() {
  return testHelpers.mountWithAll(<PayInStoreAddressTest store={currentUQStore} currentBillingAddress={currentBillingAddress} />);
}

describe('PayInStoreAddress component', () => {
  it('should render PayInStoreAddress', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });
  it('should have div', () => {
    const wrapper = mountItem();
    const div = wrapper.find('div');

    expect(div.length).to.equal(9);
  });
  it('should have UqStoreDetails', () => {
    const wrapper = mountItem();
    const UqStoreDetails = wrapper.find('StoreDetails');

    expect(UqStoreDetails.length).to.equal(1);
  });
  it('should have Button', () => {
    const wrapper = mountItem();
    const button = wrapper.find('Button');

    expect(button.length).to.equal(3);
  });

  it('should have Button label', () => {
    const wrapper = mountItem();
    const button = wrapper.find('Button');

    expect(button.last().props().label).to.equal(i18n.payment.confirmPaymentMethod);
  });
  it('should have button disabled when billing address not present', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<PayInStoreAddressTest store={currentUQStore} onSelect={onButtonClick} />);

    wrapper.setProps({ isBillingAddressVisible: true });
    const button = wrapper.find('Button');

    button.last().simulate('touchTap');
    expect(onButtonClick.called).to.equal(false);
  });
});
