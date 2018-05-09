import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import config from 'config/site/default';
import { routes } from 'utils/urlPatterns';
import PostPay from '../index';

const store = {
  giftCard: { giftCards: [], giftCard: {} },
  payment: {
    paymentMethod: 'D',
    billingAddress: {
      receiverCountryCode: '392',
      firstName: 'カタカナ',
      lastName: 'カタカナ',
      firstNameKatakana: 'カタカナ',
      lastNameKatakana: 'カタカナ',
      prefecture: '富山県',
      city: 'カタカナ',
      street: 'カタカナ',
      streetNumber: 'カタカナ',
      apt: 'カタカナ',
      postalCode: '1076231',
      phoneNumber: '9999999999999',
      cellPhoneNumber: '',
      email: 'craig@uniqlo.co.jp',
    },
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<PostPay />, store, config, i18n);
}

describe('src/pages/Checkout/Payment/PostPay', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render PostPay component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render postPay BoxSelector component', () => {
    const boxSelector = wrapper.find('BoxSelector').first();

    expect(boxSelector.props().label).to.equal(i18n.paymentMethod.postPay.join(''));
  });

  it('should render about postPay Link component', () => {
    const postPayLink = wrapper.find('Link').first();

    expect(postPayLink.props().to).to.equal(config.aboutPostPay);
  });

  it('should render postPay description Text', () => {
    const postPayDescription = wrapper.find('Text').at(2);

    expect(postPayDescription.props().children).to.equal(i18n.postPay.aboutPostPay);
  });

  it('should render memberInfo Link component', () => {
    const meberInfoLink = wrapper.find('Link').last();

    expect(meberInfoLink.props().to).to.equal(routes.memberInfo);
    expect(meberInfoLink.props().children[0].props.children[2]).to.equal(i18n.membershipInfo.editMemberInfo);
  });

  it('should render age confirmation BoxSelector component', () => {
    const boxSelector = wrapper.find('BoxSelector').last();

    expect(boxSelector.props().label).to.equal(i18n.postPay.ageConfirmText);
  });

  it('should render BillingAddressForm component', () => {
    const addressForm = wrapper.find('BillingAddressForm');

    expect(addressForm.length).to.equal(1);
  });

  it('should render ValidationMessage component', () => {
    const validationMessage = wrapper.find('ValidationMessage');

    expect(validationMessage.length).to.equal(1);
  });

  it('should render Apply postPay Button', () => {
    const applyButton = wrapper.find('Button');

    expect(applyButton.length).to.equal(1);
    expect(applyButton.props().label).to.equal(i18n.payment.confirmPaymentMethod);
  });
});
