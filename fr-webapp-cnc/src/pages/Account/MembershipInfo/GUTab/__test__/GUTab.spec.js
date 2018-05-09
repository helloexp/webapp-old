import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import GUTab from '../../GUTab';

function mountItem() {
  return testHelpers.mountWithAll(<GUTab />);
}

describe('src/pages/Account/MembershipInfo/GUTab', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render GUTab', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Links in GUTab', () => {
    const links = wrapper.find('Link');

    expect(links.at(0).props().label).to.equal(i18n.membershipInfo.likeList);
    expect(links.at(1).props().label).to.equal(i18n.membershipInfo.purchaseHistory);
    expect(links.at(2).props().label).to.equal(i18n.membershipInfo.orderHistory);
    expect(links.at(4).props().label).to.equal(i18n.membershipInfo.reviewUser);
    expect(links.at(5).props().label).to.equal(i18n.membershipInfo.guAppUsers);
  });
});
