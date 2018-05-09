import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import DeliveryDetails from '../index';

const defaultProps = {
  shippingAddress: {
    apt: '東京ミッドタウン３１Ｆ',
    cellPhoneNumber: '09000000000',
    city: '港区赤坂',
    firstName: '太郎',
    firstNameKatakana: 'タロウ',
    lastName: '山口',
    lastNameKatakana: 'ヤマグチ',
    phoneNumber: '00000000000',
    postalCode: '1076231',
    prefecture: '東京都',
    receiverCountryCode: '392',
    street: '９丁目７－１',
    streetNumber: '９丁目７－１',
  },
  deliveryMethod: {
    deliveryReqDate: '',
    deliveryReqTime: '',
    deliveryType: '5',
    splitNo: '1',
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<DeliveryDetails {...renderProps} />);
}

describe('src/pages/Checkout/ReviewOrder/components/DeliveryDetails', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render DeliveryDetails component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render ShippingTimeFrame component', () => {
    const shippingTimeFrame = wrapper.find('ShippingTimeFrame');

    expect(shippingTimeFrame.length).to.equal(1);
  });

  it('should render AddressPanel if shipping address is present', () => {
    const addressPanel = wrapper.find('AddressPanel');

    expect(addressPanel.length).to.equal(1);
  });

  it('should render title of AddressPanel correctly', () => {
    const addressPanel = wrapper.find('AddressPanel');

    expect(addressPanel.props().title).to.equal(i18n.checkout.shipping);
  });

  it('should render DeliveryPreferencePanel if split delivery is applied', () => {
    const renderProps = { isSplitDeliveryApplied: true };
    const wrappers = testHelpers.mountWithAll(<DeliveryDetails {...renderProps} />);

    expect(wrappers.find('DeliveryPreferencePanel').length).to.equal(1);
  });

  it('should render GiftPanel if split delivery is not applied', () => {
    const renderProps = { isSplitDeliveryApplied: false };
    const wrappers = testHelpers.mountWithAll(<DeliveryDetails {...renderProps} />);

    expect(wrappers.find('GiftPanel').length).to.equal(1);
  });
});
