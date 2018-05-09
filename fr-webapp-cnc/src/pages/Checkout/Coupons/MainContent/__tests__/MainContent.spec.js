import React from 'react';
import { expect } from 'chai';
import Japanese from 'i18n/strings-ja';
import MainContent from '../index';

const coupon1 = {
  id: '3010089914980',
  title: 'CMS_00021_UQ',
  code: 'CMS_00021_UQ',
  validFrom: 1459447200,
  validTo: 1491058799,
  valid: true,
  selected: false,
  description: '',
  usableStores: 'Target stores. This coupon can be used at Store and EC.',
  usageNotes: 'Notice message.',
  isUsed: false,
  image: 'https://test3-im.uniqlo.com/coupon/images/https://test3-im.uniqlo.com/coupon/images/sp/sp_1481607653889_3108453678.jpg',
  usedDate: 0,
  hasBarcode: true,
};

const coupon2 = {
  ...coupon1,
  id: '3010089914981',
};

const coupon3 = {
  ...coupon1,
  id: '3010089914982',
};

const store = {
  coupons: {
    addedCoupon: {},
    list: [
      coupon1,
      coupon2,
      coupon3,
    ],
  },
};

const defaultProps = {
  onShowDetails: () => true,
};

function mountItem(props = {}, localStore = {}) {
  const renderProps = { ...defaultProps, ...props };
  const finalStore = { ...store, ...localStore };

  return testHelpers.mountWithAll(<MainContent {...renderProps} />, finalStore);
}

describe('src/pages/Checkout/Coupons/MainContent', () => {
  it('should render MainContent component', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should render the available coupons header', () => {
    const wrapper = mountItem();

    expect(wrapper.find('Heading').first().props().headingText).to.equal(Japanese.coupons.available);
  });

  it('should render an information tooltip on the header', () => {
    const wrapper = mountItem();

    expect(wrapper.find('InfoToolTip').first().props().children[0].props.html).to.equal(Japanese.coupons.couponInformation);
    expect(wrapper.find('InfoToolTip').first().props().children[1].props.children).to.equal(Japanese.coupons.couponInformationLink);
  });

  it('should render instructions to select available coupons on the list', () => {
    const wrapper = mountItem();

    expect(wrapper.find('Text').get(0).props.children).to.equal(Japanese.coupons.textCouponAvailable);
  });

  it('should render no available coupons when there are not coupons provided', () => {
    const wrapper = mountItem({}, {
      coupons: {
        ...store.coupons,
        list: [],
      },
    });

    expect(wrapper.find('Text').get(0).props.children).to.equal(Japanese.coupons.textCouponNotAvailable);
  });

  it('should render a list of coupons', () => {
    const wrapper = mountItem();
    const items = wrapper.find('CouponList').props().items;

    expect(items.length).to.equal(3);
    expect(items).to.equal(store.coupons.list);
  });

  it('should render coupon form heading', () => {
    const wrapper = mountItem();
    const couponFormHeading = wrapper.find('Heading').last();

    expect(couponFormHeading.props().headingText).to.equal(Japanese.coupons.yourCode);
  });

  it('should render a form to add new coupons', () => {
    const wrapper = mountItem();

    expect(wrapper.find('CouponForm').length).to.equal(1);
  });

  it('should render a pop up message when coupon is invalid', () => {
    const wrapper = mountItem({}, {
      coupons: {
        ...store.coupons,
        myCouponValid: false,
      },
      errorHandler: {
        customErrors: {
          coupon: 'couponError',
        },
      },
    });

    expect(wrapper.find('MessageBox').first().props().title).to.equal('couponError');
  });
});
