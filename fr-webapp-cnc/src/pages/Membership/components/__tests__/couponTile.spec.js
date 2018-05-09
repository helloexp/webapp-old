import React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import couponDate from 'utils/couponValidity';
import i18n from 'i18n/strings-en';
import CouponTile from '../CouponTile';

const defaultProps = {
  item: {
    id: '3017494170574',
    internalId: '3017494170574-16',
    title: 'TestPos012',
    code: 'TestPos012',
    validFrom: 1467309600,
    validTo: 1577890799,
    valid: true,
    isUsed: false,
    image: '/images/icon1.png',
    usedDate: 1501489299,
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<CouponTile {...renderProps} />);
}

describe('src/pages/Membership/components/CouponTile', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CouponTile component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should show CouponImage', () => {
    const couponImage = wrapper.find('CouponImage');

    expect(couponImage.length).to.equal(1);
  });

  it('should show Coupon title', () => {
    const couponTitle = wrapper.find('Text').first();

    expect(couponTitle.props().children).to.equal(defaultProps.item.title);
  });

  it('should show Coupon expiry date', () => {
    const couponExpiry = wrapper.find('Text').last();

    expect(couponExpiry.props().children).to.equal(couponDate(defaultProps.item.validFrom, defaultProps.item.validTo, i18n));
  });

  describe('src/pages/Membership/components/CouponTile', () => {
    const showDetails = spy();

    beforeEach(() => {
      wrapper = mountItem({ showDetails });
    });

    it('should trigger showDetails callback on clicking CouponTile', () => {
      const couponTile = wrapper.find('div').first();

      couponTile.simulate('click');
      expect(showDetails.calledOnce).to.equal(true);
    });
  });
});
