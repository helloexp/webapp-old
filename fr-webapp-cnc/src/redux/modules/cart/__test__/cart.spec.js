import expect from 'expect';
import cartReducer from 'redux/modules/cart/reducer';
import {
  LOAD_CART_SUCCESS,
  ITEM_COUNT_SUCCESS,
} from 'redux/modules/cart/cart';

import {
  REMOVE_ITEM_SUCCESS,
} from 'redux/modules/cart/products';

const initialState = {
  uq: {
    cartNumber: null,
    token: null,

    gift: null,
    loaded: false,
    cartLoadError: null,
    minimumFreeShipping: 5000,
    totalAmount: 0,
    totalItems: 0,
    items: [],
  },
  gu: {
    cartNumber: null,
    token: null,

    gift: null,
    loaded: false,
    cartLoadError: null,
    minimumFreeShipping: 5000,
    totalAmount: 0,
    totalItems: 0,
    items: [],
  },

  defaultGiftBox: {},
  laterItems: [],
  likeItems: [],
  cartModel: false,
  isCartLoading: false,
};

describe('redux/modules/cart', () => {
  const cartResponse = {
    shop_cd: '01',
    site_cd: '01',
    cart_no: '0101-160628191225-5379',
    goods_sales: 5306,
    shipping_fee: 0,
    total_amt_in_tax: 5730,
    tax: 424,
    disc_amt: 0,
    message_card_amt: 0,
    message_card_tax_rate: 8,
    modify_amt: 0,
    customize_amt: 0,
    adjustmemt_amt: 0,
    before_stock_flg: '0',
    device_cd: '01',
    gift_flg: '0',
    cart_dtl_list: [
      {
        cart_no: '0101-160628191225-5379',
        cart_seq_no: '1',
        l2_goods_cd: '0724080001',
        goods_cnt: '1',
        sale_pr: 1229,
        dtl_total_sales_amt: 1229,
        l1_goods_cd: '072408',
        alteration_flg: '0',
        alteration_fee_charged_flg: '0',
        modify_size: '0',
        modify_amt: 0,
        goods_nm: 'ＵＵカノコカーディガン（長袖）＋',
        color_cd: '69',
        color_nm: 'NAVY',
        size_cd: '005',
        size_nm: 'L',
        length_cd: '000',
        specific_goods_error_flg: '0',
        discount_flg: '1',
        term_limit_sales_flg: '0',
      },
    ],
  };

  const item1 = {
    color: '04 Gray',
    count: 1,
    id: 1,
    image: '/images/ProductTileImageLarge.jpg',
    liked: true,
    placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: '$2,000',
    priceNum: 2000,
    size: 'Medium',
    sku: '153535-09-999-000',
    title: 'Women hooded stretch down coat',
  };

  const item2 = Object.assign({}, item1, { id: 2, title: 'Item 2', count: 2 });
  const item3 = Object.assign({}, item1, { id: 4, title: 'Item 3' });

  it('should load the items', () => {
    expect(
      cartReducer(undefined, {
        type: LOAD_CART_SUCCESS,
        result: cartResponse,
        brand: 'uq',
      })
    ).toMatch({
      cartModel: false,
      defaultGiftBox: {},
      uq: {
        cartLoadError: null,
        loaded: true,
        isCartLoading: false,
        items: [
          {
            alteration: '0',
            cartNumber: '0101-160628191225-5379',
            color: 'NAVY',
            colorCode: '69',
            count: '1',
            flags: {
              discount: '1',
            },
            id: '072408',
            image: '//im.uniqlo.com/images/jp/pc/goods/072408/item/69_072408_middles.jpg',
            l2Code: '0724080001',
            liked: false,
            modifySize: '0',
            multiBuy: false,
            placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
            price: 1229,
            priceNum: 1229,
            seqNo: '1',
            size: 'L',
            sizeCd: '005',
            sku: '072408',
            title: 'ＵＵカノコカーディガン（長袖）＋',
          },
        ],
        orderSummary: {
          additionalCharges: {
            consumptionTax: 424,
          },
          correctionFee: 0,
          shippingCost: 0,
          total: 5730,
          totalMerchandise: 5306,
        },
        minimumFreeShipping: 5000,
        gift: '0',
      },
      shipments: [],
      laterItems: [],
      likeItems: [],
    });
  });

  it('should set server incremental items', () => {
    expect(
      cartReducer(undefined, {
        type: ITEM_COUNT_SUCCESS,
        result: {
          totalAmount: 1000,
          items: [item1, item2, item3],
        },
      })
    ).toMatch(initialState);
  });

  it('should remove the item from the cart', () => {
    expect(
      cartReducer({
        uq: {
          items: [item1, item2, item3],
          totalItems: 3,
        },
      }, {
        type: REMOVE_ITEM_SUCCESS,
        brand: 'uq',
        result: {
          status: 'success',
        },
      })
    ).toMatch({
      uq: {
        totalItems: 2,
      },
    });
  });
});
