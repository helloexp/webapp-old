import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import MemberInfoViewTest from '../MemberInfoView';

function mountItem() {
  return testHelpers.mountWithAll(<MemberInfoViewTest />, { auth: { user: { accessToken: 'accessToken', gdsSession: 'gdsSession' } } });
}

describe('MemberInfoView component', () => {
  it('should render MemberInfoView', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading', () => {
    const wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading).to.have.length.of.at.least(1);
  });

  it('should have If', () => {
    const wrapper = mountItem();
    const If = wrapper.find('If');

    expect(If.length).to.equal(19);
  });

  it('should have Heading Text', () => {
    const wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading.first().props().headingText).to.equal(i18n.account.membershipAddress);
  });

  it('should have Tabs', () => {
    const wrapper = mountItem();
    const tabs = wrapper.find('Tabs');

    expect(tabs.length).to.equal(1);
  });
});
