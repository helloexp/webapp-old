import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import { membersApi } from 'config/api';
import UniqloTab from '../../UniqloTab';

const defaultProps = {
  user: { accessToken: '0bfbeb4e62e336d6ad158b2d1d536e6d50113b59' },
};

function mountItem() {
  return testHelpers.mountWithAll(<UniqloTab {...defaultProps} />);
}

describe('src/pages/Account/MembershipInfo/UniqloTab', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render UniqloTab', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render user barcode Image', () => {
    const barcode = wrapper.find('Image').first();

    expect(barcode.props().source).to.equal(
      `${membersApi.base}/barcode.png?accessToken=${defaultProps.user.accessToken}&scale=3&height=9`
    );
  });

  it('should render barcode instruction Text', () => {
    const instruction = wrapper.find('Text').first();

    expect(instruction.props().children).to.equal(i18n.membershipInfo.showBarcode);
  });

  it('should render Divider component', () => {
    const divider = wrapper.find('Divider');

    expect(divider.length).to.equal(1);
  });

  it('should have UQ Links', () => {
    const links = wrapper.find('Link');

    expect(links.at(0).props().label).to.equal(i18n.membershipInfo.coupon);
    expect(links.at(1).props().label).to.equal(i18n.membershipInfo.wishlist);
    expect(links.at(3).props().label).to.equal(i18n.membershipInfo.purchaseHistory);
    expect(links.at(4).props().label).to.equal(i18n.membershipInfo.orderHistory);
    expect(links.at(6).props().label).to.equal(i18n.membershipInfo.reviewUser);
    expect(links.at(7).props().label).to.equal(i18n.membershipInfo.giftCardInformation);
  });

  it('should render scanDeChance footer Text', () => {
    const footerText = wrapper.find('Text').last();

    expect(footerText.props().children).to.equal(i18n.membershipInfo.bannerFooterText);
  });
});
