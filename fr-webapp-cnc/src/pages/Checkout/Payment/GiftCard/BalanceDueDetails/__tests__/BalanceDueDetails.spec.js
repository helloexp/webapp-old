import React from 'react';
import { expect } from 'chai';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import BalanceDueDetails from '../index';
import Instructions from '../Instructions';

const giftCard = {
  index: 0,
  requestNumber: '20161206051549024615',
  number: '9999-xxxx-xxxx-0001',
  balance: 8049637,
  payment: 500,
  expires: '20161231000000',
};

const giftCard2 = {
  ...giftCard,
  requestNumber: '20161206051549024616',
  index: 1,
  payment: 100,
};

const store = {
  routing: {
    locationBeforeTransitions: {
      query: {
        brand: 'uq',
      },
    },
  },
  cart: {
    uq: {
      totalAmount: 1000,
    },
  },
  giftCard: {
    giftCards: [
      giftCard,
      giftCard2,
    ],
    giftCard,
  },
};

const defaultProps = {
  giftCard,
  onChangeHandler: () => null,
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<BalanceDueDetails {...renderProps} />, store);
}

describe('src/pages/Checkout/Payment/GiftCard/BalanceDueDetails', () => {
  it('should render BalanceDueDetails component', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.length).to.equal(1);
  });
  it('should not render the Instructions component on the first card', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.find(Instructions).length).to.equal(0);
  });
  it('should render the Instructions component, with the amount due and balance amount only on the last card', () => {
    const wrapper = mountItem({ giftCard: giftCard2 });

    expect(wrapper.find(Instructions).length).to.equal(1);
    expect(wrapper.find(Instructions).props()).to.eql({ balanceDue: 400, balanceAmount: 100, index: 1 });
  });
  it('should render the edit button', () => {
    const wrapper = mountItem({ giftCard: giftCard2 });

    expect(wrapper.find(Button).length).to.equal(1);
    expect(wrapper.find(Button).props()).to.have.property('className').with.equal('editButton small');
  });
  it('should not render the edit button', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.find(Button).length).to.equal(0);
  });
  it('should render the balance amount used on this giftcard', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.find(Text).length).to.equal(2);
    expect(wrapper.find(Text).last().props().children).to.equal('¥500');
  });
});
