import React from 'react';
import { expect } from 'chai';
import Button from 'components/uniqlo-ui/Button';
import CouponList from '../index';

const defaultProps = {
  items: [
    {
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
    {
      id: '3017704535759',
      title: 'ARIAKE8_00011_UQ',
      code: 'ARIAKE8_00011_UQ',
      validFrom: 1459468800,
      validTo: 1491004800,
      valid: true,
      selected: false,
      description: 'これは出てはいけない文言',
      usableStores: 'ARIAKE8_00011_UQ',
      usageNotes: 'ARIAKE8_00011_UQ',
      isUsed: false,
      image: 'https://test3-im.uniqlo.com/coupon/images/sp/sp_1470382088579_3590028964.jpg',
      usedDate: 0,
      hasBarcode: true,
    },
  ],
};
const state = {
  coupons: {
    addedCoupon: {
      couponId: 'CMS_00001_UQ',
      title: 'CMS_00001_UQ',
    },
  },
  isCouponViewMore: true,
};

function setup(props = {}) {
  return testHelpers.mountWithAll(<CouponList {...defaultProps} {...props} />, state);
}

describe('src/pages/Membership/CouponList', () => {
  it('should render CouponList component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render the coupon tiles as per number of coupons', () => {
    const wrapper = setup();
    const couponTile = wrapper.find('CouponTile');

    expect(couponTile.length).to.equal(2);
  });

  it('should render the coupon tile button if selectable', () => {
    const wrapper = setup({ noEdit: false });
    const selectButton = wrapper.find(Button);

    expect(selectButton.length).to.equal(2);
  });

  it('should not render the coupon tile button if not selectable', () => {
    const wrapper = setup({ noEdit: true });
    const selectButton = wrapper.find(Button);

    expect(selectButton.length).to.equal(0);
  });
});
