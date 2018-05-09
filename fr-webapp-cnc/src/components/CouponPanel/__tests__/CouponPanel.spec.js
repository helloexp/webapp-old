import React from 'react';
import { expect } from 'chai';
import { root } from 'utils/routing';
import CouponPanel from '../index';

describe('components/CouponPanel', () => {
  const setup = props => testHelpers.mountWithAll(<CouponPanel {...props} />);

  it('should render correctly', () => {
    const wrapper = setup({
      coupons: {
        list: [],
        myCoupons: [],
        addedCoupon: {},
      },
      params: {
        region: root.replace('/', ''),
      },
    });

    expect(wrapper.find(CouponPanel)).to.have.length(1);
  });

  it('should render the link to coupons page', () => {
    const wrapper = setup({
      coupons: {
        list: [],
        myCoupons: [],
        addedCoupon: {},
      },
      to: 'checkout/coupons',
    });

    expect(wrapper.find('Link')).to.have.length(2);
    expect(wrapper.find('Link').last().props().to).to.equal(`${root}/checkout/coupons`);
  });

  it('should render the selected coupons', () => {
    const wrapper = setup({
      coupons: {
        list: [
          { title: 'Testing item', selected: true },
          { title: 'One more item', selected: true },
        ],
        myCoupons: [],
        addedCoupon: {
          title: 'Testing item',
          couponId: 'CMS_00021_UQ',
        },
      },
      to: 'checkout/coupons',
    });

    expect(wrapper.text()).to.equal('クーポンの適用');
  });

  it('should render my coupons', () => {
    const wrapper = setup({
      coupons: {
        list: [
          { title: 'Testing item', selected: true },
        ],
        addedCoupon: {
          title: 'Testing item',
          couponId: 'CMS_00021_UQ',
        },
      },
      to: 'checkout/coupons',
    });

    expect(wrapper.text()).to.equal('クーポンの適用');
  });

  it('should not render unslected coupons', () => {
    const wrapper = setup({
      coupons: {
        list: [
          { title: 'Testing item', selected: false },
        ],
        myCoupons: [
          { title: 'One more item', selected: false },
        ],
        addedCoupon: {},
      },
      to: 'checkout/coupons',
    });

    expect(wrapper.text()).to.not.have.string('Testing item');
    expect(wrapper.text()).to.not.have.string('One more item');
  });
});
