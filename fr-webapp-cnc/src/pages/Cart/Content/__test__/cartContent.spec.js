import React, { PropTypes } from 'react';
import i18n from 'i18n/strings-en';
import Content from '../index';
import Body from '../Body';

global.document = require('jsdom').jsdom('');
const { mount } = require('enzyme');

const defaultProps = {
  brand: 'uq',
  isUniqlo: true,
};

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
    gu: {
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
  routing: {
    locationBeforeTransitions: {
      pathname: '/jp/cart',
      search: '?brand=uq',
      hash: '',
      state: null,
      action: 'POP',
      key: 'f1ab3r',
      query: {
        brand: 'uq',
      },
      $searchBase: {
        search: '?brand=uq',
        searchBase: '',
      },
    },
  },
  productGender: {
    uq: {},
    gu: {},
  },
  coupons: {
    addedCoupon: {
      uq: {},
      gu: {},
    },
  },
  auth: {
    user: true,
  },
  errorHandler: {
    isErrorRedirected: false,
    customErrors: [],
    detailedErrors: [],
  },
  wishlist: {
    all: {
      uq: {
        products: [],
      },
      gu: {
        products: [],
      },
    },
    find: () => {},
  },
  app: {
    confirmNavigateAway: false,
  },
  order: {
    orders: {},
    orderSummary: {},
  },
  applePay: {
    paymentRequest: {},
  },
};

const config = {
  applePay: {
    uq: {
      terms: 'https://faq.uniqlo.com/articles/FAQ/terms',
    },
    browserFlag: {
      uq: 'browser_flg=1',
      gu: 'open_target_ios=browser',
    },
    gu: {
      terms: 'https://faq.gu-global.com/articles/FAQ/100001768/',
    },
  },
  PDP: {
    inseamTypes: {
      0: {},
    },
    alterationTypes: {
      0: {
        alterationLabel: 'label',
      },
    },
  },
  brandName: {
    uq: {},
    gu: {},
  },
};

const store = {
  getState: () => state,
  subscribe: () => {},
  dispatch: () => {},
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<Content {...renderProps} />, state);
}

function mountWithWindow(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return mount(<Content brand="uq" {...renderProps} store={store} />, {
    context: { store, config, i18n },
    childContextTypes: { store: PropTypes.object, config: PropTypes.object, i18n: PropTypes.object },
  });
}

describe('Cart Content', () => {
  it('should render ItemsCartHeader with correct params', () => {
    const wrapper = mountItem();
    const itemsCartHeaderProps = wrapper.find('BrandHeader').props();

    chai.expect(itemsCartHeaderProps.brand).to.equal('uq');
  });

  it('should render Body with correct params', () => {
    const wrapper = mountItem();
    const itemsCartHeaderProps = wrapper.find(Body).props();

    chai.expect(itemsCartHeaderProps.brand).to.equal('uq');
  });

  it('should have Body', () => {
    const wrapper = mountItem();
    const body = wrapper.find('Body');

    chai.expect(body.length).to.equal(1);
  });

  it('should have buttons', () => {
    const wrapper = mountItem();
    const button = wrapper.find('Button');

    chai.expect(button.length).to.equal(8);
  });

  it('Continue shopping button should respond to click event', () => {
    const wrapper = mountItem({ brand: 'gu' });
    const button = wrapper.find('Button').last();

    button.simulate('click');

    chai.expect(button.props().label).to.equal('お買い物を続ける');
  });

  it('should have MessageBox on onRemoveCartItem action', () => {
    const wrapper = mountWithWindow();
    const body = wrapper.find('Body');

    body.props().onRemoveCartItem('12345');
    const messageBox = wrapper.find('MessageBox');

    chai.expect(messageBox.length).to.equal(1);
  });

  it('should remove Item on onConfirmRemoveItem action', () => {
    const wrapper = mountWithWindow();
    const body = wrapper.find('Body');

    body.props().onRemoveCartItem('12345');
    const messageBox = wrapper.find('MessageBox');

    messageBox.props().onAction('yes');

    chai.expect(messageBox.length).to.equal(1);
  });
});
