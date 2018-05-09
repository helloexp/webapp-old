import React from 'react';
import { expect } from 'chai';
import StoreCoupons from '../index';

const store = {
  coupons: {
    storeCouponList: [
      {
        id: '3016103180232',
        title: 'TestPos003',
        code: 'TestPos003',
        validFrom: 1467309600,
        validTo: 1577890799,
        valid: true,
        selected: false,
        description: 'これは出てはいけない文言',
        usableStores: '新宿銀座',
        usageNotes: '注意書き注意書き注意書き注意書き注意書き',
        isUsed: false,
        image: 'https://test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
        usedDate: 1484721634,
        hasBarcode: true,
      },
    ],
    addedCoupon: {
      uq: {},
      gu: {},
    },
  },
  isCouponsSelected: true,
};

function setup(props = {}) {
  return testHelpers.mountWithAll(<StoreCoupons {...props} />, store);
}

describe('src/pages/Membership/StoreCoupons', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  it('should render StoreCoupons component', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render CouponList', () => {
    const couponList = wrapper.find('CouponList');

    expect(couponList.length).to.equal(1);
  });

  it('should not render MessageBox when coupon is not selected', () => {
    const messageBox = wrapper.find('MessageBox');

    expect(messageBox.length).to.equal(0);
  });
});
