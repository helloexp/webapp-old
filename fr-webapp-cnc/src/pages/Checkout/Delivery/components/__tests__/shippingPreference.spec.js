import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import RadioSelector from 'components/Selector';
import ShippingPreference from '../ShippingPreference/ShippingPreference';

let wrapper;
const store = {
  gifting: {
    gift: false,
  },
  routing: {
    locationBeforeTransitions: {
      query: {
        brand: 'uq',
      },
    },
  },
  cart: {
    uq: {
      cartNumber: '0101-170718143249-3155',
      token: '52c76d5ec985d829a1a629ecd0a154f5b58ace7c2f1c334a96800032f35b2c59',
      gift: '0',
      loaded: true,
      cartLoadError: null,
      minimumFreeShipping: 5000,
      totalAmount: 5690,
      paymentAmount: 5690,
      totalItems: 3,
      items: [
        {
          internalId: '1614670004-1',
          cartNumber: '0101-170718143249-3155',
          id: '161467',
          seqNo: '1',
          l2Code: '1614670004',
          title: 'MEN スター・ウォーズフリースジャケット（長袖）＋E',
          liked: false,
          image: '//im.uniqlo.com/images/jp/pc/goods/161467/item/09_161467_middles.jpg',
          color: 'BLACK',
          colorCode: '09',
          size: 'S',
          sizeCd: '003',
          lengthCode: '000',
          count: '1',
          price: 1290,
          priceNum: 1290,
          flags: {
            discount: '1',
            online_limit: '0',
          },
          placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
          multiBuy: false,
          promoDtlFlg: '0',
          promoJoinNum: '1',
          promoApplyCnt: '0',
          promoApplyDiscountAmt: 0,
          salePriceAmount: 1290,
          alteration: '0',
          modifySize: '0',
          sku: '161467',
        },
        {
          internalId: '1870780004-2',
          cartNumber: '0101-170718143249-3155',
          id: '187078',
          seqNo: '2',
          l2Code: '1870780004',
          title: 'WOMEN スウェットフレアワンピース（7分袖）',
          liked: false,
          image: '//im.uniqlo.com/images/jp/pc/goods/187078/item/63_187078_middles.jpg',
          color: 'BLUE',
          colorCode: '63',
          size: 'M',
          sizeCd: '004',
          lengthCode: '000',
          count: '1',
          price: 990,
          priceNum: 990,
          flags: {
            discount: '1',
            online_limit: '0',
          },
          placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
          multiBuy: false,
          promoDtlFlg: '0',
          promoJoinNum: '1',
          promoApplyCnt: '0',
          promoApplyDiscountAmt: 0,
          salePriceAmount: 990,
          alteration: '0',
          modifySize: '0',
          sku: '187078',
        },
        {
          internalId: '1878430003-3',
          cartNumber: '0101-170718143249-3155',
          id: '187843',
          seqNo: '3',
          l2Code: '1878430003',
          title: 'WOMEN コットンカシミヤワイドリブセーター（長袖）',
          liked: false,
          image: '//im.uniqlo.com/images/jp/pc/goods/187843/item/69_187843_middles.jpg',
          color: 'NAVY',
          colorCode: '69',
          size: 'XL',
          sizeCd: '006',
          lengthCode: '000',
          count: '1',
          price: 2990,
          priceNum: 2990,
          flags: {
            discount: '0',
            online_limit: '0',
          },
          placeholder: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
          multiBuy: false,
          promoDtlFlg: '0',
          promoJoinNum: '1',
          promoApplyCnt: '0',
          promoApplyDiscountAmt: 0,
          salePriceAmount: 2990,
          alteration: '0',
          modifySize: '0',
          sku: '187843',
        },
      ],
      inventoryDetails: {},
      shippingFeeWorkaround: true,
      isCartLoading: false,
      hasGift: false,
      cartGift: {
        amount: 0,
        messageCard: {
          amount: 0,
        },
      },
      lastUpdatedDate: '20171011154126',
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
      shippingAddress: {
        receiverCountryCode: '392',
        firstName: 'カタカナ',
        lastName: 'カタカナ',
        firstNameKatakana: 'カタカナ',
        lastNameKatakana: 'カタカナ',
        prefecture: '宮城県',
        city: 'カタカナ',
        street: 'カタカナ',
        streetNumber: 'カタカナ',
        apt: 'カタカナ',
        postalCode: '1410021',
        phoneNumber: '5555555555555',
        cellPhoneNumber: '5555555555555',
      },
      paymentType: 'B',
      couponFlag: '0',
      firstOrderFlag: '0',
      giftCardBrandFlag: '0',
    },
    gu: {
      cartNumber: null,
      token: null,
      gift: null,
      loaded: false,
      cartLoadError: null,
      minimumFreeShipping: 5000,
      totalAmount: 0,
      paymentAmount: 0,
      totalItems: 0,
      items: [],
      inventoryDetails: {},
      shippingFeeWorkaround: true,
    },
    coupon: null,
    defaultGiftBox: {},
    laterItems: [],
    likeItems: [],
    shipments: [],
    cartModel: false,
    isCartLoading: false,
    catalogData: {},
    refreshingCart: false,
    selectedDeliveryType: 'none',
    checkoutBrand: 'uq',
    giftIdCookie: {},
    giftCookie: {},
    billingAddress: {
      receiverCountryCode: '392',
      firstName: 'ｈｅｒｅｅｅｅｅｅｅｅ？',
      lastName: 'ｕｍａａａａａａａａａａ',
      firstNameKatakana: 'カナ',
      lastNameKatakana: 'カナ',
      prefecture: '宮城県',
      city: 'カナ',
      street: 'カナ',
      streetNumber: 'カナ',
      apt: 'カナ',
      postalCode: '1235555',
      phoneNumber: '54445545455',
      cellPhoneNumber: '54545555454',
      email: 'devang@mail.com',
    },
    cartGift: {
      amount: 0,
      messageCard: {
        amount: 0,
      },
    },
    deliveryMethod: [
      {
        splitNo: '1',
        deliveryType: '5',
        deliveryReqDate: '',
        deliveryReqTime: '',
      },
    ],
    giftCardFlag: '0',
  },
  delivery: {
    splitDetails: [],
    shippingThreshold: [{ deliveryType: '5' }],
    deliveryMethod: [{ deliveryType: '17', splitNo: '1' }],
    deliveryMethodList: {
      1: {
        C: {
          deliveryRequestedDateTimes: [
            {
              date: '00',
              timeSlots: [
                '00',
              ],
            },
          ],
          deliveryTypes: ['5', '17', '12', '16'],
          deliveryDetails: [
            {
              deliveryType: '5',
              splitDiv: 'C',
              splitNo: '1',
            },
          ],
        },
      },
    },
    nextDateOptions: { 1: { C: false } },
    deliveryTypes: ['16'],
    splitCount: 1,
    deliveryStandard: { 1: {} },
    deliveryPreference: 'C',
    sameDayDeliveryCharges: [
      {
        deliveryType: '01',
        shippingFee: '300',
        countryCode: 'Default',
        brandCode: '10',
      },
      {
        deliveryType: '02',
        shippingFee: '400',
        countryCode: 'Default',
        brandCode: '20',
      },
    ],
  },
};

function setup(props = {}, state = {}) {
  return testHelpers.mountWithAll(<ShippingPreference {...props} />, { ...store, ...state });
}

describe('src/pages/Checkout/Delivery/components/ShippingPreference', () => {
  beforeEach(() => {
    wrapper = setup();
  });

  it('should render RadioSelector with sameDayAvailable flag set to true', () => {
    const newState = { delivery: { ...store.delivery, deliveryMethod: [{ deliveryType: '17' }] } };
    const componentProps = wrapper.find(RadioSelector).at(0).props();

    wrapper = setup({}, newState);

    expect(componentProps.label).to.equal(i18n.checkout.sameDay);
    expect(componentProps.value).to.equal('17');
  });

  it('should render RadioSelector with isStandardDeliveryAvailable flag set to true', () => {
    const componentProps = wrapper.find(RadioSelector).at(3).props();

    expect(componentProps.label).to.equal(i18n.checkout.standardTime);
    expect(componentProps.value).to.equal('standard');
  });

  it('should render RadioSelector with isCustomTimeFrameSelected flag set to true and isNextDaySelected flag set to false', () => {
    const componentProps = wrapper.find(RadioSelector).at(2).props();

    expect(componentProps.label).to.equal(i18n.checkout.byDate);
    expect(componentProps.value).to.equal('bydate');
  });

  it('should render RadioSelector with isYuPacketAvailable flag set to true', () => {
    const componentProps = wrapper.find(RadioSelector).at(4).props();

    expect(componentProps.label).to.equal(i18n.checkout.byYupacket);
    expect(componentProps.value).to.equal('12');
  });

  it('should render RadioSelector with isNekoposPacketAvailable flag set to true', () => {
    const newState = {
      routing: {
        locationBeforeTransitions: {
          query: {
            brand: 'gu',
          },
        },
      },
    };

    wrapper = setup({}, newState);

    const componentProps = wrapper.find(RadioSelector).at(4).props();

    expect(componentProps.label).to.equal(i18n.checkout.nekopos);
    expect(componentProps.value).to.equal('16');
  });
});
