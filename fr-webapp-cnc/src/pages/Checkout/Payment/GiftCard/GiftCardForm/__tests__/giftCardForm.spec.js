import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import GiftCardForm from '../index';

const defaultProps = {
  error: true,
};

const store = {
  cart: {
    uq: {
      cartNumber: '0101-171017162107-2297',
      token: '57bf2440517df91efed74e214637e0249a9cac162edfb27af21577f81e991baf',
      lastUpdatedDate: '20171019180837',
    },
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
  giftCard: { giftCards: [], giftCard: {} },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<GiftCardForm {...renderProps} />, store);
}

describe('src/pages/Checkout/Payment/GiftCardForm', () => {
  let wrapper;
  const onButtonClick = sinon.spy();

  beforeEach(() => {
    wrapper = mountItem({ verifyGiftCard: onButtonClick });
  });

  it('should render GiftCardForm component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render payment required message Text', () => {
    const requiredText = wrapper.find('Text').first();

    expect(requiredText.props().children).to.equal(i18n.payment.required);
  });

  it('should render giftcard number Input field', () => {
    const cardNumberField = wrapper.find('Input').first();

    expect(cardNumberField.props().label).to.equal(i18n.payWithGiftCard.giftCardNumber);
  });

  it('should render giftcard pin Input field', () => {
    const cardNumberPin = wrapper.find('Input').first();

    expect(cardNumberPin.props().label).to.equal(i18n.payWithGiftCard.giftCardNumber);
  });

  it('should not render billing AddressForm component', () => {
    const addressForm = wrapper.find('AddressForm').first();

    expect(addressForm.length).to.equal(0);
  });

  it('should not render ValidationMessage component', () => {
    const addressForm = wrapper.find('ValidationMessage');

    expect(addressForm.length).to.equal(1);
  });

  it('should render apply Button', () => {
    const applyButton = wrapper.find('Button');

    expect(applyButton.length).to.equal(1);
    expect(applyButton.props().label).to.equal(i18n.payWithGiftCard.verifyGiftCard);
  });
  it('should have button disabled when billing address not present', () => {
    const applyButton = wrapper.find('Button');

    applyButton.simulate('click');
    expect(onButtonClick.called).to.equal(false);
  });
});
