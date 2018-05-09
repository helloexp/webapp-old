import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import MembershipTest from '../index';

const state = {
  coupons: {
    list: [{
      code: 'TestPos003',
      description: 'これは出てはいけない文言',
      hasBarcode: true,
      id: '3016103180232',
      image: 'http: /test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
      isUsed: false,
      selected: true,
      title: 'TestPos003',
      usableStores: '新宿銀座',
      usageNotes: '注意書き注意書き注意書き注意書き注意書き',
      usedDate: 1484721634,
      valid: true,
      validFrom: 1467309600,
      validTo: 1577890799,
    },
    ],
    storeCouponList: [{
      code: 'TestPos003',
      description: 'これは出てはいけない文言',
      hasBarcode: true,
      id: '3016103180232',
      image: 'http: /test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
      isUsed: false,
      selected: true,
      title: 'TestPos003',
      usableStores: '新宿銀座',
      usageNotes: '注意書き注意書き注意書き注意書き注意書き',
      usedDate: 1484721634,
      valid: true,
      validFrom: 1467309600,
      validTo: 1577890799,
    },
    ],
    addedCoupon: {
      uq: {},
      gu: {},
    },
  },
  couponDetails: {
    code: 'TestPos003',
    description: 'これは出てはいけない文言',
    hasBarcode: true,
    id: '3016103180232',
    image: 'http: /test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
    isUsed: false,
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
const stateNoList = {
  coupons: {
    list: [],
    storeCouponList: [],
  },
  couponDetails: {
    code: 'TestPos003',
    description: 'これは出てはいけない文言',
    hasBarcode: true,
    id: '3016103180232',
    image: 'http: /test3-im.uniqlo.com/coupon/images/sp/sp_1470381854392_1764749767.jpg',
    isUsed: false,
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

function setup(props = {}) {
  return testHelpers.mountWithAll(<MembershipTest {...props} />, state);
}

describe('src/pages/Membership', () => {
  it('should render Membership component correctly', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading text', () => {
    const wrapper = setup();
    const heading = wrapper.find('Heading');

    expect(heading.first().props().headingText).to.equal(i18n.membership.membershipHeading);
  });

  it('should have Tabs', () => {
    const wrapper = setup();
    const tabs = wrapper.find('Tabs');

    expect(tabs.length).to.equal(1);
  });

  it('should have store coupons Tab', () => {
    const wrapper = setup();
    const tab = wrapper.find('Tab').first();

    expect(tab.props().text).to.equal(i18n.membership.store);
  });

  it('should have online coupons Tab', () => {
    const wrapper = setup();
    const tab = wrapper.find('Tab').last();

    expect(tab.props().text).to.equal(i18n.membership.onlineStore);
  });

  it('should not have StoreCoupons component if store list is empty', () => {
    const wrapper = testHelpers.mountWithAll(<MembershipTest />, stateNoList);
    const StoreCouponslist = wrapper.find('StoreCoupons');

    expect(StoreCouponslist.length).to.equal(0);
  });

  it('should have StoreCoupons component', () => {
    const wrapper = setup();
    const StoreCouponslist = wrapper.find('StoreCoupons');

    expect(StoreCouponslist.length).to.equal(1);
  });

  it('should have StoreCoupons content', () => {
    const wrapper = setup();
    const StoreCouponslist = wrapper.find('StoreCoupons');

    expect(StoreCouponslist.props().content).to.equal(i18n.membership.noCouponMessage);
  });

  it('should have back to membership button', () => {
    const wrapper = setup();
    const button = wrapper.find('Button');

    expect(button.last().props().label).to.equal(i18n.membership.backToMemberShip);
  });

  it('should have Coupon list', () => {
    const wrapper = setup();
    const couponListArray = wrapper.find('CouponList');

    expect(couponListArray.length).to.equal(1);
  });

  it('should not have Coupon list when list is empty', () => {
    const wrapper = testHelpers.mountWithAll(<MembershipTest />, stateNoList);
    const couponListArray = wrapper.find('CouponList');

    expect(couponListArray.length).to.equal(0);
  });

  it('should have Coupon list', () => {
    const wrapper = setup();
    const couponListArray = wrapper.find('CouponList');

    expect(couponListArray.props().items).to.deep.equal(state.coupons.list);
  });
});
