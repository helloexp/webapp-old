import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import CreditCardTile from '../CreditCardTile.js';

const defaultProps = {
  creditCard: {
    dbKey: '0101JP17090718391268990',
  },
  paymentLink: '/jp/checkout/payment?brand=uq',
  isShowInfo: true,
};

function mountItem() {
  return testHelpers.mountWithAll(<CreditCardTile {...defaultProps} />);
}

describe('src/pages/Checkout/components/PaymentMethodTile/CreditCardTile', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CreditCardTile component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render payment Link', () => {
    const link = wrapper.find('Link').first();

    expect(link.length).to.equal(1);
    expect(link.props().label).to.equal(i18n.common.edit);
  });

  it('should render InvalidCreditCardMsg component', () => {
    const invalidMessage = wrapper.find('InvalidCreditCardMsg');

    expect(invalidMessage.length).to.equal(1);
  });

  it('should render creditcard image', () => {
    const ccImage = wrapper.find('Image').first();

    expect(ccImage.props().className).to.equal('cardImage');
  });

  it('should render saved credit card Text correctly', () => {
    const text = wrapper.find('Text').at(2);

    expect(text.props().content).to.equal(i18n.payment.savedCreditCard);
  });

  it('should render CvvInput component', () => {
    const cvv = wrapper.find('CvvInput');

    expect(cvv.length).to.equal(1);
  });

  it('should render CvvModal component', () => {
    const cvvModal = wrapper.find('CvvModal');

    expect(cvvModal.length).to.equal(1);
  });

  it('should render TSLToolTip component', () => {
    const tsl = wrapper.find('TSLToolTip');

    expect(tsl.length).to.equal(1);
  });
});
