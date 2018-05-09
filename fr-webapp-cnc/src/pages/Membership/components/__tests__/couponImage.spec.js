import React from 'react';
import { expect } from 'chai';
import Image from 'components/uniqlo-ui/Image';
import CouponImageTest from '../CouponImage';

const source = '../images/default_image.png';
const defaultProps = {
  isCouponUsed: false,
  source,
};
const coupon = {
  code: {},
};

function setup(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<CouponImageTest {...renderProps} />, coupon);
}

describe('src/pages/Membership/components/CouponImage', () => {
  it('should render CouponImage component correctly', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render one image when coupon is not used', () => {
    const wrapper = setup();
    const image = wrapper.find(Image);

    expect(image.length).to.equal(1);
  });

  it('should render image with default source', () => {
    const wrapper = setup();
    const image = wrapper.find(Image);

    expect(image.props().source).to.equal(source);
  });

  it('should render two images when coupon is used', () => {
    const wrapper = setup({ isCouponUsed: true });
    const image = wrapper.find(Image);

    expect(image.length).to.equal(2);
  });
});
