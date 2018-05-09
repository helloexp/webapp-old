import React from 'react';
import { expect } from 'chai';
import RadioSelector from 'components/Selector';
import Button from 'components/uniqlo-ui/Button';
import PaymentOptions from '../index';

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
    giftCard: {
      ...giftCard,
      fullPayment: '0',
    },
  },
};

const defaultProps = {
  giftCard,
  onChangeHandler: () => null,
};

function mountItem(props = {}, customStore = store) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<PaymentOptions {...renderProps} />, customStore);
}

describe('src/pages/Checkout/Payment/GiftCard/PaymentOptions', () => {
  it('should render PaymentOptions component', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.length).to.equal(1);
  });
  it('should not render the two RadioSelector', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.find(RadioSelector).length).to.equal(2);
    expect(wrapper.find(RadioSelector).first().props().label).to.be.equal('全て利用する');
    expect(wrapper.find(RadioSelector).last().props().label).to.be.equal('一部を利用する');
  });
  it('should render the AmountInput component when partial payment is selected', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.find('AmountInput').length).to.equal(1);
    expect(wrapper.find('AmountInput').props().value).to.be.equal('500');
  });
  it('should NOT render the AmountInput component when full payment is selected', () => {
    const wrapper = mountItem({ giftCard }, {
      ...store,
      giftCard: {
        ...store.giftCard,
        giftCard: {
          ...giftCard,
          fullPayment: '1',
        },
      },
    });

    expect(wrapper.find('AmountInput').length).to.equal(0);
  });
  it('should render the save button', () => {
    const wrapper = mountItem({ giftCard }, {
      ...store,
      giftCard: {
        ...store.giftCard,
        giftCard: {
          ...giftCard,
          fullPayment: '0',
        },
      },
    });

    expect(wrapper.find(Button).length).to.equal(1);
    expect(wrapper.find(Button).props().label).to.be.equal('お支払い方法を確定する');
  });
});
