import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import ReleaseConnectionDrawerTest from '../ReleaseConnectionDrawer';

function mountItem() {
  return testHelpers.mountWithAll(<ReleaseConnectionDrawerTest />);
}

describe('ReleaseConnectionDrawer component', () => {
  it('should render ReleaseConnectionDrawer', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should have MembershipDrawer', () => {
    const wrapper = mountItem();
    const drawer = wrapper.find('MembershipDrawer');

    expect(drawer.length).to.equal(1);
  });

  it('should have Text', () => {
    const wrapper = mountItem();
    const text = wrapper.find('Text');

    expect(text.length).to.equal(3);
  });

  it('should have Text content', () => {
    const wrapper = mountItem();
    const text = wrapper.find('Text');

    expect(text.last().props().children).to.equal(i18n.membershipInfo.releaseAccept);
  });

  it('should have Image', () => {
    const wrapper = mountItem();
    const image = wrapper.find('Image');

    expect(image.length).to.equal(1);
  });
});
