import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import OrderDetails from '../OrderDetails';

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
};

const defaultProps = {
  isUniqloStore: true,
  cartGift: { id: '05' },
  orderSummary: {},
  deliveryMethod: {
    deliveryType: '5',
  },
  barcodeInfo: {
    barcodeNumber: '5101934339275',
    orderTimeLimit: '20180110202936',
    barcodeImage: {
      contentType: 'image/png',
      content: `iVBORw0KGgoAAAANSUhEUgAAAdgAAABUAQAAAAAJpxsjAAAACXBIWXMAAAYnAAAGJwFNVNjHAAAA
          \nEnRFWHRTb2Z0d2FyZQBCYXJjb2RlNEryjnYuAAAAXElEQVR42u3LsRGAIBQE0WMIfkgH2ok2ZuAM
          \njUknlkBI4HhShOHGu09jKyO5Np/q2dodV5FKfZXvfqxhR7Nb11Iejezw7Tmn2YTFYrFYLBaLxWKx
          \nWCwWi8Vif7Uf90H0GMCa9JoAAAAASUVORK5CYII=\n`,
    },
  },
  items: [],
  orderConfirmDetails: {
    ord_no: '011801102045-33928',
    multi_delivery_flg: '0',
    orderer_eml_id: 'user@uniqlo.com',
    payment_type: 'B',
    gift_flg: '1',
    order_delv: {
      ord_no: '011801102045-33928',
      delv_type: '11',
      receiver_tel_no: '106975',
    },
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<OrderDetails {...renderProps} />, state);
}

describe('src/pages/Checkout/ConfirmOrder/OrderDetails', () => {
  let wrapper;
  const gotoOrderHistory = sinon.spy();

  describe('OrderDetails - shipping, store payment and gifting', () => {
    beforeEach(() => {
      wrapper = mountItem({ gotoOrderHistory });
    });

    it('should render OrderDetails', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render ConfirmStore component', () => {
      const confirmStore = wrapper.find('ConfirmStore');

      expect(confirmStore.length).to.equal(1);
    });

    it('should render OrderItemsSummary component', () => {
      const orderItemsSummary = wrapper.find('OrderItemsSummary');

      expect(orderItemsSummary.length).to.equal(1);
    });

    it('should render delivery AddressPanel component', () => {
      const addressPanel = wrapper.find('AddressPanel');

      expect(addressPanel.length).to.equal(1);
    });

    it('should render PackingMethod component', () => {
      const packingMethod = wrapper.find('PackingMethod');

      expect(packingMethod.length).to.equal(1);
    });

    it('should render GiftPanel component', () => {
      const giftPanel = wrapper.find('GiftPanel');

      expect(giftPanel.length).to.equal(1);
    });

    it('should render PayAtStoreDetails component', () => {
      const payAtStoreDetails = wrapper.find('PayAtStoreDetails');

      expect(payAtStoreDetails.length).to.equal(1);
    });

    it('should render OrderSummary component', () => {
      const orderSummary = wrapper.find('OrderSummary');

      expect(orderSummary.length).to.equal(1);
    });

    it('should render goto order history Button', () => {
      const orderHistory = wrapper.find('Button');

      expect(orderHistory.length).to.equal(1);
      expect(orderHistory.props().label).to.equal(i18n.checkout.orderSummary);
    });

    it('should trigger callback on clicking goto order history Button', () => {
      const orderHistory = wrapper.find('Button');

      orderHistory.simulate('click');
      expect(gotoOrderHistory.calledOnce).to.equal(true);
    });
  });

  describe('OrderDetails - store staff with store delivery and store payment', () => {
    beforeEach(() => {
      wrapper = mountItem({
        customerNotesURL: 'customerDigital://open/page/customerRegister?orderNo=011801102045-33928&barCd=5111429339352&storeNo=123456',
        orderConfirmDetails: {
          ...defaultProps.orderConfirmDetails,
          orderer_eml_id: 'user@uniqlo.store',
        },
        deliveryMethod: {
          deliveryType: '11',
        },
      });
    });

    it('should render customerNotesURL Button', () => {
      const customerNotesURL = wrapper.find('Button');

      expect(customerNotesURL.length).to.equal(1);
      expect(customerNotesURL.props().label).to.equal(i18n.orderConfirmation.customerNotes);
    });
  });

  describe('OrderDetails - not shipping, not store payment and no gifting', () => {
    beforeEach(() => {
      wrapper = mountItem({
        isUniqloStore: false,
        cartGift: {},
        deliveryMethod: {
          deliveryType: '11',
        },
      });
    });

    it('should not render ConfirmStore component', () => {
      const confirmStore = wrapper.find('ConfirmStore');

      expect(confirmStore.length).to.equal(0);
    });

    it('should not render PackingMethod component', () => {
      const packingMethod = wrapper.find('PackingMethod');

      expect(packingMethod.length).to.equal(0);
    });

    it('should not render GiftPanel component', () => {
      const giftPanel = wrapper.find('GiftPanel');

      expect(giftPanel.length).to.equal(0);
    });

    it('should not render PayAtStoreDetails component', () => {
      const payAtStoreDetails = wrapper.find('PayAtStoreDetails');

      expect(payAtStoreDetails.length).to.equal(0);
    });
  });
});
