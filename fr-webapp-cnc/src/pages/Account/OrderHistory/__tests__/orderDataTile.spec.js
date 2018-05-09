import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import OrderDataTile from '../OrderDataTile';

const defaultProps = {
  showBarcodeLink: true,
  orderNumber: '011801101934-33927',
  orderData: {
    formatedOrderDate: '2018/01/10',
    statusValue: 'ご注文が成立していません。',
    plannedDeliveryDate: 'お届け予定日: 2018/01/14(日)〜2018/01/14(日)',
    uniqueStatus: {
      uniqueStatusLabel1: '配送会社',
      uniqueStatusLabel2: '配送伝票番号',
      uniqueStatusTexts1: ['日本郵便'],
      uniqueStatusLinks1: [' http://www.post.japanpost.jp/'],
      uniqueStatusTexts2: ['1234567890'],
      uniqueStatusLinks2: ['http://jizen.kuronekoyamato.co.jp/jizen/servlet/crjz.b.NQ0010?id=1234567890'],
    },
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<OrderDataTile {...defaultProps} />);
}

describe('src/pages/Account/OrderHistory/OrderDataTile', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render OrderDataTile component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Heading with order date', () => {
    const orderDate = wrapper.find('Heading').first();

    expect(orderDate.props().headingText).to.equal(defaultProps.orderData.formatedOrderDate);
  });

  it('should render order number Text', () => {
    const payAtStoreTitle = wrapper.find('Text').first();

    expect(payAtStoreTitle.props().children).to.equal(`${i18n.orderHistory.orderNumber}: ${defaultProps.orderNumber}`);
  });

  it('should render purchase Type', () => {
    const purchaseType = wrapper.find('Text').at(1);

    expect(purchaseType.props().children).to.equal(`${i18n.orderHistory.purchaseType}: ${i18n.orderHistory.online}`);
  });

  it('should render planned delivery date', () => {
    const plannedDeliveryDate = wrapper.find('Text').at(2);

    expect(plannedDeliveryDate.props().children).to.equal(defaultProps.orderData.plannedDeliveryDate);
  });

  it('should render order status', () => {
    const orderStatus = wrapper.find('Text').at(3);

    expect(orderStatus.props().children).to.equal(`${i18n.orderHistory.orderStatus}: ${defaultProps.orderData.statusValue}`);
  });

  it('should render UniqueStatus components', () => {
    const uniqueStatus = wrapper.find('UniqueStatus');

    expect(uniqueStatus.length).to.equal(2);
  });

  it('should render unique status label 1', () => {
    const uniqueStatus1 = wrapper.find('Text').at(4);

    expect(uniqueStatus1.props().children).to.equal(`${defaultProps.orderData.uniqueStatus.uniqueStatusLabel1}:`);
  });

  it('should render unique status label 2', () => {
    const uniqueStatus2 = wrapper.find('Text').at(5);

    expect(uniqueStatus2.props().children).to.equal(`${defaultProps.orderData.uniqueStatus.uniqueStatusLabel2}:`);
  });
});
