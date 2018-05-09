import React from 'react';
import { expect } from 'chai';
import { getFormattedDate } from 'utils/formatDate';
import i18n from 'i18n/strings-en';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import CouponDetails from '../index';

const defaultProps = {
  coupon: {
    code: 'TestPos003',
    isUsed: true,
    hasBarcode: true,
    id: '3016103180232',
    image: 'http: /test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
    selected: true,
    title: 'TestPos003',
    usableStores: '新宿銀座',
    usageNotes: '注意書き注意書き注意書き注意書き注意書き',
    usedDate: 1484721634,
    valid: true,
    validFrom: 1467309600,
    validTo: 1577890799,
  },
};
const date = `${i18n.coupons.usedDate}: ${getFormattedDate(defaultProps.coupon.usedDate)}`;
const usableStores = `${i18n.coupons.usableStores}: ${defaultProps.coupon.usableStores}`;
const usageNote = `${i18n.coupons.usageNotes}: ${defaultProps.coupon.usageNotes}`;

function setup(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<CouponDetails {...renderProps} />, i18n);
}

describe('src/pages/Membership/CouponDetails', () => {
  it('should render CouponDetails component correctly', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render coupon image', () => {
    const wrapper = setup();
    const couponImage = wrapper.find(Image);

    expect(couponImage.at(1).props().source).to.equal(defaultProps.coupon.image);
  });
  it('should render usedMessage if coupon is used', () => {
    const wrapper = setup();
    const usedMessage = wrapper.find(Text);

    expect(usedMessage.at(0).props().content).to.equal(i18n.coupons.usedMessage);
  });

  it('should render coupon title', () => {
    const wrapper = setup();
    const heading = wrapper.find(Text);

    expect(heading.at(1).props().children).to.equal(defaultProps.coupon.title);
  });

  it('should render three text when coupon is used', () => {
    const wrapper = setup();
    const image = wrapper.find(Text);

    expect(image.length).to.equal(3);
  });

  it('should render four text when coupon is not used', () => {
    const wrapper = setup({ coupon: { ...defaultProps.coupon, isUsed: false } });
    const text = wrapper.find(Text);

    expect(text.length).to.equal(4);
  });

  it('should render coupon with formatted date and time if coupon used', () => {
    const wrapper = setup();
    const usedDate = wrapper.find(Text);

    expect(usedDate.at(2).props().content).to.equal(date);
  });

  it('should render coupon with usableStores if coupon not used', () => {
    const wrapper = setup({ coupon: { ...defaultProps.coupon, isUsed: false } });
    const usableStore = wrapper.find(Text);

    expect(usableStore.at(2).props().content).to.equal(usableStores);
  });

  it('should render coupon with usageNotes if coupon not used', () => {
    const wrapper = setup({ coupon: { ...defaultProps.coupon, isUsed: false } });

    const usageNotes = wrapper.find(Text);

    expect(usageNotes.at(3).props().content).to.equal(usageNote);
  });
});
