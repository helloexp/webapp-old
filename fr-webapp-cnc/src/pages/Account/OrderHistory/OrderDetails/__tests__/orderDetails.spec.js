import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import OrderDetails from '../index.js';

const state = {
  cart: {
    giftCookie: {},
    uq: {},
  },
  paymentStore: {
    paymentStoreDetail: {
      name: 'ユニクロ 銀座店',
      Monday: {
        open: '11:00',
        close: '21:00',
      },
      Tuesday: {
        open: '11:00',
        close: '21:00',
      },
      Wednesday: {
        open: '11:00',
        close: '21:00',
      },
      Thursday: {
        open: '11:00',
        close: '21:00',
      },
      Friday: {
        open: '11:00',
        close: '21:00',
      },
      Saturday: {
        open: '11:00',
        close: '21:00',
      },
      Sunday: {
        open: '11:00',
        close: '21:00',
      },
    },
  },
  order: {
    orderSummary: {},
    details: {
      ord_no: '011801102045-33928',
      multi_delivery_flg: '0',
      orderer_eml_id: 'user@uniqlo.store',
      payment_type: 'B',
      gift_flg: '1',
      order_detail_list: [
        {
          ord_no: '011801102045-33928',
          ord_dtl_no: '1',
          l1_goods_cd: '169118',
          l2_goods_cd: '1691180056',
        },
      ],
      order_delv: {
        ord_no: '011801102045-33928',
        delv_type: '11',
        receiver_tel_no: '106975',
      },
      pay_In_Store_Barcode_info: {
        check_in_store_cd: '102383',
        barcode_no: '5111429339352',
        ord_time_limit: '20180111152431',
      },
    },
  },
};

function mountItem(store = {}) {
  return testHelpers.mountWithAll(<OrderDetails />, { ...state, ...store });
}

describe('src/pages/Account/OrderHistory/OrderDetails', () => {
  let wrapper;

  describe('OrderDetails', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render OrderDetails component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render order history list Heading component', () => {
      const orderDetailsHeading = wrapper.find('Heading').first();

      expect(orderDetailsHeading.props().headingText).to.equal(i18n.orderHistory.orderHistoryDetails);
    });

    it('should render PayAtStoreBarcode component', () => {
      const barcode = wrapper.find('PayAtStoreBarcode');

      expect(barcode.length).to.equal(1);
    });

    it('should render OrderDataTile component', () => {
      const orderdataTile = wrapper.find('OrderDataTile');

      expect(orderdataTile.length).to.equal(1);
    });

    it('should render PickUpInfo component', () => {
      const pickupinfo = wrapper.find('PickUpInfo');

      expect(pickupinfo.length).to.equal(1);
    });

    it('should render delivery and gift Heading component', () => {
      const deliveryHeading = wrapper.find('Heading').at(2);

      expect(deliveryHeading.props().headingText).to.equal(i18n.orderHistory.deliveryMethodAndGiftOptions);
    });

    it('should render DeliveryView component', () => {
      const deliveryView = wrapper.find('DeliveryView');

      expect(deliveryView.length).to.equal(1);
    });

    it('should render TimeFrameView component', () => {
      const timeFrame = wrapper.find('TimeFrameView');

      expect(timeFrame.length).to.equal(1);
    });

    it('should render GiftBoxWrapperView component', () => {
      const giftBoxWrapper = wrapper.find('GiftBoxWrapperView');

      expect(giftBoxWrapper.length).to.equal(1);
    });

    it('should render payment method Heading component', () => {
      const paymentHeading = wrapper.find('Heading').at(5);

      expect(paymentHeading.props().headingText).to.equal(i18n.orderHistory.paymentMethod);
    });

    it('should render PaymentView component', () => {
      const paymentView = wrapper.find('PaymentView');

      expect(paymentView.length).to.equal(1);
    });

    it('should render product list Heading component', () => {
      const productHeading = wrapper.find('Heading').at(7);

      expect(productHeading.props().headingText).to.equal(i18n.orderHistory.purchasedItem);
    });

    it('should render ItemDetailsView component', () => {
      const itemDetails = wrapper.find('ItemDetailsView');

      expect(itemDetails.length).to.equal(1);
    });

    it('should render customer notes Link component', () => {
      const customerNotes = wrapper.find('Link').at(6);

      expect(customerNotes.props().label).to.equal(i18n.orderConfirmation.customerNotes);
    });

    it('should render go to orderlist Button component', () => {
      const goBack = wrapper.find('Button').last();

      expect(goBack.props().label).to.equal(i18n.orderHistory.back);
    });
  });

  describe('OrderDetails - show add back to cart button', () => {
    beforeEach(() => {
      wrapper = mountItem({
        ...state,
        order: {
          ...state.order,
          details: {
            ...state.order.details,
            payment_type: 'D',
            cancel_target_flg: '5',
          },
        },
      });
    });

    it('should render add back to cart Button component', () => {
      const backToCart = wrapper.find('Button').first();

      expect(backToCart.props().label).to.equal(i18n.orderHistory.addBackToCart);
    });
  });
});
