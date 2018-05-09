import React from 'react';
import { expect } from 'chai';
import Products from '../Products';
import CartItem from '../../Item';

describe('Product', () => {
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
  };

  const Props = {
    item: [
      {
        internalId: '1639060065-4',
        cartNumber: '0101-170718143249-3155',
        id: '163906',
        seqNo: '4',
        l2Code: '1639060065',
        title: 'MEN イージーケアツータックチノ',
        liked: false,
        image: '//im.uniqlo.com/images/jp/pc/goods/163906/item/32_163906_middles.jpg',
        color: 'BEIGE',
        colorCode: '32',
        size: '76',
        sizeCd: '076',
        length: '76',
        lengthCode: '076',
        count: '1',
        price: 2093,
        priceNum: 2990,
        flags: {
          discount: '1',
          online_limit: '0',
        },
        placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        multiBuy: true,
        applyType: 'X',
        promoId: '999003',
        promoDtlFlg: '2',
        promoJoinNum: '1',
        promoApplyCnt: '3',
        promoApplyDiscountAmt: 30,
        salePriceAmount: 2093,
        promoNm: 'king promo x',
        alteration: '0',
        modifySize: '0',
        sku: '163906',
        isMultiBuy: true,
        secondItem: false,
        is999Rule: false,
        isMultipleSkuBuy: false,
        currentSkuId: '163906-32-076',
        promotionId: '999003',
        isXYPatternMessage: true,
        isXYPattern: true,
        multiBuyPrice: true,
        SKUflags: {
          discount: true,
        },
        flagItems: [
          '',
          '',
        ],
      },
    ],
    cartItemErrors: {},
    customImage: 'imageUrl',
  };

  it('check if the cart Product is present', () => {
    const wrapper = testHelpers.shallowWithStoreAndI18n(<Products />);

    expect(wrapper.length).to.equal(1);
  });

  it('check if the cartItem is present', () => {
    const wrapper = testHelpers.mountWithAll(<Products {...Props} />);

    const item = wrapper.find(CartItem);

    expect(item.length).to.equal(Props.item.length);
  });

  it('cartItem should toggleWishlist', () => {
    const toggleWishlist = sinon.spy();
    const wrapper = testHelpers.mountWithAll(<Products {...Props} toggleWishlist={toggleWishlist} />, state);

    const item = wrapper.find(CartItem);

    item.first().props().onFavoriteClick();
    expect(toggleWishlist).to.have.been.called; // eslint-disable-line
  });
});
