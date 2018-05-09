import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import i18n from 'i18n/strings-en';
import AddConfirmation from '../AddConfirmation';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<AddConfirmation {...props} />);
}

describe('src/pages/Account/Address/AddConfirmation', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render AddConfirmation component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should contain delete completion Heading ', () => {
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
    expect(heading.props().headingText).to.equal(i18n.account.addConfirmHeader);
  });

  it('should show AddressPanel component ', () => {
    const addressPanel = wrapper.find('AddressPanel');

    expect(addressPanel.length).to.equal(1);
  });

  it('should show completion button ', () => {
    const completionButton = wrapper.find('Button').first();

    expect(completionButton.length).to.equal(1);
    expect(completionButton.props().label).to.equal(i18n.common.ok);
  });

  it('should trigger toUniqloTop callback on clicking toUniqloTopButton', () => {
    const onCompletion = spy();

    wrapper = mountItem({ onCompletion });
    const completionButton = wrapper.find('Button').first();

    completionButton.simulate('click');
    expect(onCompletion.calledOnce).to.equal(true);
  });

  it('should show back to address entry button ', () => {
    const backToAddressEntryButton = wrapper.find('Button').last();

    expect(backToAddressEntryButton.length).to.equal(1);
    expect(backToAddressEntryButton.props().label).to.equal(i18n.account.backToInfo);
  });

  it('should trigger onBackToMemberInfo callback on clicking backToAddressEntryButton', () => {
    const onBackToMemberInfo = spy();

    wrapper = mountItem({ onBackToMemberInfo });
    const backToAddressEntryButton = wrapper.find('Button').last();

    backToAddressEntryButton.simulate('click');
    expect(onBackToMemberInfo.calledOnce).to.equal(true);
  });
});
