import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import MembershipDrawerTest from '../MembershipDrawer';

function mountItem() {
  return testHelpers.mountWithAll(<MembershipDrawerTest />);
}

describe('MembershipDrawer component', () => {
  it('should render MembershipDrawer', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Drawer', () => {
    const wrapper = mountItem();
    const drawer = wrapper.find('Drawer');

    expect(drawer.length).to.equal(1);
  });

  it('should have acceptLabel', () => {
    const wrapper = mountItem();
    const drawer = wrapper.find('Drawer');

    expect(drawer.props().acceptLabel).to.equal(i18n.membershipInfo.releaseAccept);
  });

  it('should have cancelLabel', () => {
    const wrapper = mountItem();
    const drawer = wrapper.find('Drawer');

    expect(drawer.props().cancelLabel).to.equal(i18n.membershipInfo.releaseCancel);
  });
});
