import React from 'react';
import { spy } from 'sinon';
import i18n from 'i18n/strings-ja';
import { expect } from 'chai';
import NoAddressList from '../NoAddressList';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<NoAddressList {...props} />);
}

describe('src/pages/Account/Address/NoAddressList', () => {
  it('should render NoAddressList component correctly', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should contain Heading ', () => {
    const wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
  });

  it('should show TSLToolTip ', () => {
    const wrapper = mountItem({ isAddressFormView: true });
    const toolTip = wrapper.find('TSLToolTip');

    expect(toolTip.length).to.equal(1);
  });

  it('should show back to membership button', () => {
    const wrapper = mountItem({ isNewRegConfirmationVisible: false, isAddressFormView: false });
    const backToMemberButton = wrapper.find('Button').last();

    expect(backToMemberButton.props().label).to.equal(i18n.membership.backToMemberShip);
  });

  it('should trigger backToInfo callback on clicking backToMemberButton', () => {
    const backToInfo = spy();
    const wrapper = mountItem({ isNewRegConfirmationVisible: false, isAddressFormView: false, backToInfo });
    const backToMemberButton = wrapper.find('Button').last();

    backToMemberButton.simulate('click');
    expect(backToInfo.calledOnce).to.equal(true);
  });

  it('should show confirmation', () => {
    const wrapper = mountItem({ isNewRegConfirmationVisible: true, address: {} });
    const confirmationComponent = wrapper.find('Confirmation');

    expect(confirmationComponent.length).to.equal(1);
  });

  it('should show address form', () => {
    const wrapper = mountItem({ isNewRegConfirmationVisible: false, isAddressFormView: true });
    const addressForm = wrapper.find('AddressForm');

    expect(addressForm.length).to.equal(1);
  });

  it('should show save as billing address checkbox', () => {
    const wrapper = mountItem({ isNewRegConfirmationVisible: false, isAddressFormView: true, defaultAddress: null });
    const addressForm = wrapper.find('CheckBox');

    expect(addressForm.length).to.equal(1);
  });

  it('should show add new address button', () => {
    const wrapper = mountItem({ isNewRegConfirmationVisible: false, isAddressFormView: false });
    const addNewAddressButton = wrapper.find('Button').first();

    expect(addNewAddressButton.props().label).to.equal(i18n.account.registerNewAddress);
  });

  it('should trigger onAddNewAddress callback on clicking addNewAddressButton', () => {
    const onAddNewAddress = spy();
    const wrapper = mountItem({ isNewRegConfirmationVisible: false, isAddressFormView: false, onAddNewAddress });
    const addNewAddressButton = wrapper.find('Button').first();

    addNewAddressButton.simulate('click');
    expect(onAddNewAddress.calledOnce).to.equal(true);
  });
});
