import React from 'react';
import { expect } from 'chai';
import { formatPrice, maskCardNumber } from 'utils/format';
import i18n from 'i18n/strings-en';
import GiftCardTile from '../GiftCardTile.js';

const defaultProps = {
  giftCards: [{
    index: 0,
    requestNumber: '20171016154521344960',
    number: '9999-xxxx-xxxx-0001',
    balance: 9984539,
    payment: 31370,
    fullPayment: '1',
    expires: '20201231000000',
  }],
  paymentLink: '/jp/checkout/payment?brand=uq',
};

function mountItem() {
  return testHelpers.mountWithAll(<GiftCardTile {...defaultProps} />);
}

describe('src/pages/Checkout/components/PaymentMethodTile/GiftCardTile', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render GiftCardTile component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render GiftCard component', () => {
    const giftCard = wrapper.find('GiftCard');

    expect(giftCard.length).to.equal(1);
  });

  it('should render GiftCard heading Text', () => {
    const heading = wrapper.find('Text').first();

    expect(heading.props().children).to.equal(i18n.paymentMethod.giftCard);
  });

  it('should render Link to payment page', () => {
    const paymentLink = wrapper.find('Link').first();

    expect(paymentLink.props().label).to.equal(i18n.common.edit);
    expect(paymentLink.props().to).to.equal('/jp/checkout/payment?brand=uq');
  });

  it('should render Uniqlo logo Image', () => {
    const logo = wrapper.find('Image');

    expect(logo.length).to.equal(1);
    expect(logo.props().className).to.equal('cardImage');
  });

  it('should render TSLToolTip component', () => {
    const tooltip = wrapper.find('TSLToolTip');

    expect(tooltip.length).to.equal(1);
  });

  it('should render masked card number', () => {
    const cardNumber = wrapper.find('Text').at(1);

    expect(cardNumber.props().children[0]).to.equal(maskCardNumber('9999-xxxx-xxxx-0001'));
  });

  it('should render price Text', () => {
    const cardNumber = wrapper.find('Text').last();

    expect(cardNumber.props().children.join('')).to.equal(
      `${i18n.paymentMethod.amountDeducted}: ${formatPrice(31370)}`
    );
  });
});
