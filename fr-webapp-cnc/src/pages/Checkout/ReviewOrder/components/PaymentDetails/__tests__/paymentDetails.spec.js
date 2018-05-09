import React from 'react';
import { expect } from 'chai';
import constants from 'config/site/default';
import PaymentDetails from '../index';

const { uniqloStore, cashOnDelivery, creditCard, giftCard } = constants.payment;

const store = {
  paymentStore: {
    appliedStore: null,
  },
};

function mountItem(props = {}, state = {}) {
  return testHelpers.mountWithAll(<PaymentDetails {...props} />, { ...store, ...state });
}

describe('src/pages/Checkout/ReviewOrder/components/PaymentDetails', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render PaymentDetails component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render SimpleTile component', () => {
    const renderProps = { paymentType: cashOnDelivery };
    const wrappers = testHelpers.mountWithAll(<PaymentDetails {...renderProps} />, { ...store });
    const simpleTile = wrappers.find('SimpleTile');

    expect(simpleTile.length).to.equal(1);
  });

  it('should render CreditCardTile component', () => {
    const renderProps = { paymentType: creditCard, isCreditRequired: false };
    const wrappers = testHelpers.mountWithAll(<PaymentDetails {...renderProps} />, { ...store });
    const creditCardTile = wrappers.find('CreditCardTile');

    expect(creditCardTile.length).to.equal(1);
  });

  it('should render GiftCardTile component', () => {
    const renderProps = { paymentType: giftCard, giftCardFlag: '1', giftCards: [] };
    const wrappers = testHelpers.mountWithAll(<PaymentDetails {...renderProps} />, { ...store });
    const giftCardTile = wrappers.find('GiftCardTile');

    expect(giftCardTile.length).to.equal(1);
  });

  it('should render StorePayment component', () => {
    const renderProps = {
      paymentType: uniqloStore,
      appliedStore: {
        name: 'ユニクロ 銀座店',
      },
    };
    const newStore = {
      paymentStore: {
        appliedStore: {
          id: 10101397,
          name: 'ユニクロ 銀座店',
        },
      },
    };
    const wrappers = testHelpers.mountWithAll(<PaymentDetails {...renderProps} />, { ...newStore });
    const paymentStoreComponent = wrappers.find('StorePayment');

    expect(paymentStoreComponent.length).to.equal(1);
  });
});
