import React from 'react';
import { expect } from 'chai';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import i18n from 'i18n/strings-ja';
import GiftCardInfo from '../index';
import BalanceDueDetails from '../../BalanceDueDetails';
import PaymentOptions from '../../PaymentOptions';

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
  isEditingGiftCard: false,
  shouldShowContinueButton: false,
};

function mountItem(props = {}, customStore = store) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<GiftCardInfo {...renderProps} />, customStore);
}

describe('src/pages/Checkout/Payment/GiftCard/GiftCardInfo', () => {
  it('should render GiftCardInfo component', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.length).to.equal(1);
  });
  it('should render the remove button', () => {
    const wrapper = mountItem({ giftCard });

    expect(wrapper.find(Button).length).to.equal(1);
    expect(wrapper.find(Button).props().label).to.equal('削除');
    expect(wrapper.find(Button).props().className).to.equal('editButton small');
  });
  it('should call the onRemove function', () => {
    const onRemove = sinon.spy();
    const wrapper = mountItem({ giftCard, onRemove });

    wrapper.find(Button).simulate('click');
    expect(onRemove.withArgs(0).calledOnce).to.equal(true);
  });
  it('should render the masked giftcard number', () => {
    const wrapper = mountItem({ giftCard });
    const text = wrapper.find(Text).get(2);

    expect(text.props.children).to.equal('9999 •••• •••• 0001');
  });
  it('should render the DebitedAmountInfo component when there is a payment applied to this giftcard', () => {
    const wrapper = mountItem({ giftCard });
    const DebitedAmountInfo = wrapper.find('DebitedAmountInfo').first();

    expect(DebitedAmountInfo.length).to.equal(1);
  });
  it('should render the available balance on the giftcard', () => {
    const wrapper = mountItem({ giftCard });
    const text = wrapper.find(Text).get(4);

    expect(text.props.children[1]).to.equal('¥8,049,637');
  });
  it('should NOT render the expiration date', () => {
    const wrapper = mountItem({ giftCard });
    const text = wrapper.find(Text).get(6);

    expect(text.props.children[1]).to.not.equal('2016/12/31');
  });
  it('should render the AvailableBalanceInfo component when there is NOT a payment applied to this giftcard', () => {
    const wrapper = mountItem({
      giftCard: {
        ...giftCard,
        payment: 0,
      },
    });
    const AvailableBalanceInfo = wrapper.find('AvailableBalanceInfo').first();

    expect(AvailableBalanceInfo.length).to.equal(1);
  });
  it('should render the expiration date', () => {
    const wrapper = mountItem({
      giftCard: {
        ...giftCard,
        payment: 0,
      },
    });
    const text = wrapper.find(Text).get(6);

    expect(text.props.children[1]).to.equal('2016/12/31');
  });
  it('should render the BalanceDueDetails component', () => {
    const wrapper = mountItem({ giftCard });
    const result = wrapper.find(BalanceDueDetails);

    expect(result.length).to.equal(1);
  });
  it('should render the PaymentOptions component', () => {
    const wrapper = mountItem({ giftCard, isEditingGiftCard: true }, {
      ...store,
      giftCard: {
        ...store.giftCard,
        giftCard,
        editIndex: 0,
      },
    });
    const result = wrapper.find(PaymentOptions);

    expect(result.length).to.equal(1);
  });
  it('should render the continue button', () => {
    const wrapper = mountItem({ giftCard, shouldShowContinueButton: true });
    const continueBtn = wrapper.find(Button).last();

    expect(continueBtn.props().label).to.equal(i18n.common.continueText);
    expect(continueBtn.props().className).to.equal('medium secondary');
  });
});
