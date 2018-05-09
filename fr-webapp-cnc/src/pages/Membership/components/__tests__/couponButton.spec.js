import React from 'react';
import { expect } from 'chai';
import Button from 'components/uniqlo-ui/Button';
import Japanese from 'i18n/strings-ja';
import CouponButtonTest from '../CouponButton';

const defaultProps = {
  isCouponUsed: false,
  item: {
    id: '3016103180232',
    title: 'TestPos003',
    code: 'TestPos003',
    validFrom: 1467309600,
    validTo: 1577890799,
    valid: true,
    selected: true,
    description: 'これは出てはいけない文言',
    usableStores: '新宿銀座',
    usageNotes: '注意書き注意書き注意書き注意書き注意書き',
    isUsed: false,
    image: 'https://test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
    usedDate: 1484721634,
    hasBarcode: true,
  },
};

const state = {
  coupons: {
    addedCoupon: {
      couponId: 'CMS_00001_UQ',
      title: 'CMS_00001_UQ',
    },
  },
};

const coupon = {
  id: '3016103180232',
  title: 'TestPos003',
  code: 'TestPos003',
  validFrom: 1467309600,
  validTo: 1577890799,
  valid: true,
  selected: true,
  description: 'これは出てはいけない文言',
  usableStores: '新宿銀座',
  usageNotes: '注意書き注意書き注意書き注意書き注意書き',
  isUsed: false,
  image: 'https://test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
  usedDate: 1484721634,
  hasBarcode: true,
};

function setup(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<CouponButtonTest {...renderProps} />, state);
}

describe('src/pages/Membership/components/CouponButton', () => {
  it('should render the deselect button if coupon is selected', () => {
    const wrapper = setup({ item: coupon });
    const deselectButton = wrapper.find(Button);
    const deselectButtonProps = deselectButton.props();

    expect(deselectButtonProps.label).to.equal(Japanese.common.deselect);
  });

  it('should render the select button if coupon is not selected', () => {
    const wrapper = setup({ item: { ...coupon, selected: false } });
    const selectButton = wrapper.find(Button).last();
    const selectButtonProps = selectButton.props();

    expect(selectButtonProps.label).to.equal(Japanese.common.select);
  });

  it('should call a calback when a coupon is deselected', () => {
    const onButtonClick = sinon.spy();
    const wrapper = setup({ item: coupon, onRemovePress: onButtonClick });
    const deselectButton = wrapper.find(Button).first();

    deselectButton.simulate('click');
    expect(onButtonClick.calledOnce).to.equal(true);
  });

  it('should call a calback when a coupon is selected', () => {
    const onButtonClick = sinon.spy();
    const wrapper = setup({ item: { ...coupon, selected: false }, onAddPress: onButtonClick });
    const selectButton = wrapper.find(Button).last();

    selectButton.simulate('click');
    expect(onButtonClick.calledOnce).to.equal(true);
  });
});
