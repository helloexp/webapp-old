import React from 'react';
import { expect } from 'chai';
import { getFormattedDateWithTime } from 'utils/formatDate';
import { couponBarcodeApi } from 'redux/modules/membership/coupons';
import i18n from 'i18n/strings-en';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Button from 'components/uniqlo-ui/Button';
import BarcodeTileTest from '../index';

const defaultProps = {
  coupon: {
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
  index: 0,
  isUseCoupon: true,
};
const formattedDateWithTime = getFormattedDateWithTime(defaultProps.coupon.validTo, i18n);

function setup(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<BarcodeTileTest {...renderProps} />, i18n);
}

describe('src/pages/BarCode/components/BarcodeTile', () => {
  it('should render BarcodeTile component correctly', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render coupon number', () => {
    const wrapper = setup();
    const headingNumber = wrapper.find(Text);

    expect(headingNumber.at(0).props().children).to.equal('01.');
  });

  it('should render coupon title', () => {
    const wrapper = setup();
    const heading = wrapper.find(Text);

    expect(heading.at(1).props().children).to.equal(defaultProps.coupon.title);
  });

  it('should render coupon with farmatted date and time', () => {
    const wrapper = setup();
    const formattedDateAndTime = wrapper.find(Text);

    expect(formattedDateAndTime.at(2).props().children).to.equal(formattedDateWithTime);
  });

  it('should render BarcodeButton with correct props when coupon is choosed', () => {
    const wrapper = setup();
    const barcodeView = wrapper.find('BarcodeView');
    const button = barcodeView.find(Button);

    expect(button.props().label).to.equal(i18n.membership.useCoupon);
  });

  it('should have callback on clicking BarcodeButton', () => {
    const onButtonClick = sinon.spy();
    const wrapper = setup({ selectACoupon: onButtonClick });
    const barcodeView = wrapper.find('BarcodeView');
    const button = barcodeView.find(Button);

    button.simulate('click');
    expect(onButtonClick.called).to.equal(true);
  });

  it('should render BarcodeImage when coupon is not choosed', () => {
    const wrapper = setup({ isUseCoupon: false });
    const image = wrapper.find(Image);

    expect(image.props().source).to.equal(`${couponBarcodeApi}${defaultProps.coupon.id}`);
  });
});
