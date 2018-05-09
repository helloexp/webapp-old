import React from 'react';
import { expect } from 'chai';
import OrderSummary from 'components/OrderSummary';
import CouponPanel from 'components/CouponPanel';
import Body from '../Body';
import Gift from '../../Gift';

const state = {
  cart: {
    uq: {
      cartNumber: '0101-170718143249-3155',
      token: '52c76d5ec985d829a1a629ecd0a154f5b58ace7c2f1c334a96800032f35b2c59',
      gift: '0',
      loaded: true,
      items: [
        {
          cartNumber: '0101-170718143249-3155',
          id: '161467',
          title: 'MEN スター・ウォーズフリースジャケット（長袖）＋E',
          image: '//im.uniqlo.com/images/jp/pc/goods/161467/item/09_161467_middles.jpg',
          sku: '161467',
        },
        {
          cartNumber: '0101-170718143249-3155',
          id: '187843',
          title: 'WOMEN コットンカシミヤワイドリブセーター（長袖）',
          image: '//im.uniqlo.com/images/jp/pc/goods/187843/item/69_187843_middles.jpg',
          sku: '187843',
        },
      ],
      inventoryDetails: {},
      isCartLoading: false,
      hasGift: false,
      orderSummary: {
        totalMerchandise: 5270,
        giftFee: 0,
        messageCardFee: 0,
        correctionFee: 0,
        coupon: 0,
        shippingCost: 0,
        giftCardPayment: 0,
        total: 5690,
        paymentsAmt: 5690,
        settlementFee: 0,
        additionalCharges: {
          consumptionTax: 421,
          serviceAmount: 1,
        },
      },
    },
    checkoutBrand: 'uq',
    giftCookie: {},
  },
  coupons: {
    addedCoupon: {
      uq: {},
      gu: {},
    },
  },
  gifting: {
    giftBags: [
      {
        id: '05',
        brand: 'uq',
        hasPacking: true,
        title: '父の日　',
        image: 'https://im.testdm2.jp/images/jp/pc/img/material/giftbag_05_s_JP.jpg',
      },
    ],
    giftBagAmounts: {
      '05': {
        amount: 150,
      },
    },
  },
};

describe('Body', () => {
  it('check if the cart Body is present', () => {
    const wrapper = testHelpers.mountWithAll(<Body brand="uq" />, state);

    expect(wrapper.length).to.equal(1);
  });

  it('check if cartContentWrapper is present', () => {
    const wrapper = testHelpers.mountWithAll(<Body brand="uq" />, state);
    const body = wrapper.find('.cartContentWrapper');

    expect(body).to.be.visible; // eslint-disable-line
  });

  it('check if OrderSummary is present', () => {
    const wrapper = testHelpers.mountWithAll(<Body brand="uq" />, state);
    const body = wrapper.find(OrderSummary);

    expect(body.props().order).to.equal(state.cart.uq.orderSummary);
  });

  it('check if OrderSummary bottomTileClassName changes on toggle', () => {
    const wrapper = testHelpers.mountWithAll(<Body brand="uq" />, state);
    const body = wrapper.find(OrderSummary);

    expect(body.props().bottomTileClassName).to.equal('summaryBottomTileBorder');
    body.props().onToggle(true);
    expect(body.props().bottomTileClassName).to.equal('orderSummaryBottomTile');
  });

  it('check if Button respond to click events', () => {
    const checkoutFromCart = sinon.spy();
    const wrapper = testHelpers.mountWithAll(
      <Body brand="uq" checkoutFromCart={checkoutFromCart} />,
      state
    );
    const body = wrapper.find('Button');

    body.at(3).simulate('click');

    expect(checkoutFromCart).to.have.been.called; // eslint-disable-line
  });

  it('check if CouponPanel is present', () => {
    const wrapper = testHelpers.mountWithAll(<Body brand="uq" />, state);
    const body = wrapper.find(CouponPanel);

    wrapper.setProps({ brand: 'uq' });

    expect(body.props().to).to.equal('checkout/coupons?from=cart&brand=uq');
  });

  it('check if Gift is present', () => {
    const wrapper = testHelpers.mountWithAll(<Body brand="uq" />, state);
    const body = wrapper.find(Gift);

    wrapper.setProps({ brand: 'uq' });

    expect(body.props().gift.image).to.equal(state.gifting.giftBags[0].image);
    expect(body.props().gift.title).to.equal(state.gifting.giftBags[0].title);
    expect(body.props().gift.amount).to.equal(
      `¥${state.gifting.giftBagAmounts[state.gifting.giftBags[0].id].amount}`
    );
  });

  it('check if Gifting is enabled on changing Gift', () => {
    const setupGifting = sinon.spy();
    const wrapper = testHelpers.mountWithAll(<Body setupGifting={setupGifting} brand="uq" />, state);
    const body = wrapper.find(Gift);

    wrapper.setProps({ brand: 'uq' });
    body.props().onChange();
    expect(setupGifting).to.have.been.called; // eslint-disable-line
  });

  it('should display text when no item in cart', () => {
    const noCartState = {
      coupons: {
        addedCoupon: {
          uq: {},
          gu: {},
        },
      },
    };
    const wrapper = testHelpers.mountWithAll(<Body brand="gu" />, noCartState);
    const body = wrapper.find('div');

    expect(body.props().children[1]).to.equal('カート内に商品がありません');
  });
});
