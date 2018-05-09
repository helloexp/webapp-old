import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import ConfirmReleaseDrawerTest from '../ConfirmReleaseDrawer';

function mountItem() {
  return testHelpers.mountWithAll(<ConfirmReleaseDrawerTest />);
}

describe('ConfirmReleaseDrawer component', () => {
  it('should render ConfirmReleaseDrawer', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should have MembershipDrawer', () => {
    const wrapper = mountItem();
    const MembershipDrawer = wrapper.find('MembershipDrawer');

    expect(MembershipDrawer.length).to.equal(1);
  });

  it('should display Text component', () => {
    const wrapper = mountItem();
    const text = wrapper.find('Text');

    expect(text.length).to.equal(4);
  });

  it('should have Text', () => {
    const wrapper = mountItem();
    const text = wrapper.find('Text');

    expect(text.last().props().children).to.equal(i18n.membershipInfo.releaseAccept);
  });
});
