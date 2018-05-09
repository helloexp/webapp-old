import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import Text from 'components/uniqlo-ui/Text';
import { membersApi } from 'config/api';
import Image from 'components/uniqlo-ui/Image';
import Button from 'components/uniqlo-ui/Button';
import { init } from 'utils/routing';
import MessageBox from 'components/MessageBox';
import ConfirmationPopup from '../components/ConfirmationPopup';
import Barcode from '../index';

const defaultProps = {
  selectedStoreCouponDetails: [
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
  isFooterVisible: true,
  accessToken: '7438e5bbcc7e816408d9a74fe6ff4ca7ee91942',
};
const barcodeQueryParams = `accessToken=${defaultProps.accessToken}&scale=4&height=9`;
const memberBarcodeApi = `${membersApi.base}/${membersApi.barcode}`;

function setup(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<Barcode {...renderProps} />, i18n);
}

describe('src/pages/BarCode', () => {
  const nativeWindowFetch = window.fetch;

  beforeEach(() => {
    window.fetch = sinon.spy(() =>
      Promise.resolve({ ok: 1, json: sinon.spy(() => {}), status: 204 })
    );
  });

  afterEach(() => {
    window.fetch = nativeWindowFetch;
  });

  it('should render BarcodeTile component correctly', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading', () => {
    const wrapper = setup();
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
  });

  it('should have Heading text', () => {
    const wrapper = setup();
    const heading = wrapper.find('Heading');

    expect(heading.props().headingText).to.equal(i18n.membership.couponUse);
  });

  it('should have Text', () => {
    const wrapper = setup({ selectedStoreCouponDetails: [], isFooterVisible: false });
    const text = wrapper.find(Text);

    expect(text.length).to.equal(5);
  });

  it('should have error Text', () => {
    const wrapper = setup();
    const text = wrapper.find(Text);

    expect(text.at(0).props().children).to.equal(i18n.membership.memberBarCodeMessage);
  });

  it('should have Image', () => {
    const wrapper = setup();
    const image = wrapper.find(Image);

    expect(image.first().props().source).to.equal(`${memberBarcodeApi}?${barcodeQueryParams}`);
  });

  it('should have Text when no cuopons available', () => {
    const wrapper = setup({ selectedStoreCouponDetails: [] });
    const text = wrapper.find(Text);

    expect(text.at(3).props().content).to.equal(i18n.membership.noStoreCoupons);
  });

  it('should have back to coupon list Button', () => {
    const wrapper = setup({ isFooterVisible: false });
    const button = wrapper.find(Button);

    expect(button.props().label).to.equal(i18n.membership.backToCouponList);
  });

  it('should have back to coupon list Button', () => {
    const spy = sinon.spy();

    init({
      region: 'jp',
      router: {
        push: spy,
      },
    });
    const wrapper = setup({ isFooterVisible: false });
    const button = wrapper.find(Button);

    button.simulate('click');
    expect(spy.called).to.equal(true);
  });

  it('should have select label on available coupons', () => {
    const wrapper = setup();
    const textElement = wrapper.find(Text);

    expect(textElement.at(7).props().content).to.equal(i18n.membership.useStoreCoupon);
  });

  it('should have MessageBox component when footer is present', () => {
    const wrapper = setup();
    const footer = wrapper.find(MessageBox);

    footer.find('button').first().simulate('click');

    expect(window.fetch).to.have.been.called; // eslint-disable-line no-unused-expressions

    footer.find('button').last().simulate('click');
    expect(footer.length).to.equal(1);
  });

  it('MessageBox component in footer should respond to click events', () => {
    const wrapper = setup();
    const footer = wrapper.find(MessageBox);

    footer.find('button').first().simulate('click');

    expect(window.fetch).to.have.been.called; // eslint-disable-line no-unused-expressions
  });

  it('MessageBox component in footer should respond to click events', () => {
    const wrapper = setup();
    const footer = wrapper.find(MessageBox);

    footer.find('button').last().simulate('click');

    expect(window.fetch).to.have.been.called; // eslint-disable-line no-unused-expressions
  });

  it('should have Confirmation Popup on Confirmation', () => {
    const wrapper = setup({ isConfirmationPopupVisible: true });
    const popUp = wrapper.find(ConfirmationPopup);

    expect(popUp.length).to.equal(1);
  });
});
