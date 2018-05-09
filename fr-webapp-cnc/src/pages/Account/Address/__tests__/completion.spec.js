import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import i18n from 'i18n/strings-en';
import Completion from '../Completion';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<Completion {...props} />);
}

describe('src/pages/Account/Address/Completion', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render Completion component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should contain delete completion Heading ', () => {
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
    expect(heading.props().headingText).to.equal(i18n.account.completionHeaderDelete);
  });

  it('should contain edit completion Heading ', () => {
    wrapper = mountItem({ isHeaderLabel: true });
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
    expect(heading.props().headingText).to.equal(i18n.account.completionHeaderEdit);
  });

  it('should show to uniqlo top button ', () => {
    wrapper = mountItem({ isNewAddress: true });
    const toUniqloTopButton = wrapper.find('Button').last();

    expect(toUniqloTopButton.length).to.equal(1);
    expect(toUniqloTopButton.props().label).to.equal(i18n.account.uniqloTop);
  });

  it('should trigger toUniqloTop callback on clicking toUniqloTopButton', () => {
    const toUniqloTop = spy();

    wrapper = mountItem({ isNewAddress: true, toUniqloTop });
    const toUniqloTopButton = wrapper.find('Button').last();

    toUniqloTopButton.simulate('click');
    expect(toUniqloTop.calledOnce).to.equal(true);
  });

  it('should show to back to address button ', () => {
    const backToAddressButton = wrapper.find('Button').last();

    expect(backToAddressButton.length).to.equal(1);
    expect(backToAddressButton.props().label).to.equal(i18n.account.backToAddress);
  });

  it('should trigger toUniqloTop callback on clicking toUniqloTopButton', () => {
    const backToAddressList = spy();

    wrapper = mountItem({ backToAddressList });
    const backToAddressButton = wrapper.find('Button').last();

    backToAddressButton.simulate('click');
    expect(backToAddressList.calledOnce).to.equal(true);
  });
});
