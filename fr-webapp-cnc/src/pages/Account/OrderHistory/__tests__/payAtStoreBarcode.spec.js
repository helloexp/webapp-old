import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import { getCurrentDay, getPayAtStoreTime } from 'utils/formatDate';
import { truncate } from 'utils/format';
import PayAtStoreBarcode from '../PayAtStoreBarcode';

const defaultProps = {
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
  storeDetail: {
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
};

function mountItem() {
  return testHelpers.mountWithAll(<PayAtStoreBarcode {...defaultProps} />);
}

describe('src/pages/Account/OrderHistory/PayAtStoreBarcode', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render PayAtStoreBarcode component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render order number Text', () => {
    const orderNumber = wrapper.find('Text').first();

    expect(orderNumber.props().children).to.equal(i18n.orderConfirmation.onlineOrderNo);
  });

  it('should render pay at store title Text', () => {
    const payAtStoreTitle = wrapper.find('Text').at(1);

    expect(payAtStoreTitle.props().children).to.equal(i18n.orderConfirmation.payAtStoreTitle);
  });

  it('should render pay at store time', () => {
    const payAtStoreTime = wrapper.find('Text').at(2);

    expect(payAtStoreTime.props().children).to.equal(getPayAtStoreTime(defaultProps.barcodeInfo.orderTimeLimit));
  });

  it('should render store name', () => {
    const payAtStoreName = wrapper.find('Text').at(3);

    expect(payAtStoreName.props().children).to.equal(`${i18n.orderHistory.storeName}: ${defaultProps.storeDetail.name}`);
  });

  it('should render current day working hours', () => {
    const todayHours = wrapper.find('Text').at(4);
    const currentDay = getCurrentDay();

    expect(todayHours.props().children).to.equal(
      `${i18n.orderConfirmation.todayHours}: ${truncate(defaultProps.storeDetail[currentDay].open)}AM～${truncate(defaultProps.storeDetail[currentDay].close)}PM`
    );
  });

  it('should render holiday working hours', () => {
    const holidayHours = wrapper.find('Text').at(5);

    expect(holidayHours.props().children).to.equal(
      `${i18n.orderConfirmation.holidayHours}: ${truncate(defaultProps.storeDetail.weekendOpen)}AM～${truncate(defaultProps.storeDetail.weekendClose)}PM`
    );
  });

  it('should render barcode Image', () => {
    const barcodeImage = wrapper.find('Image');

    expect(barcodeImage.length).to.equal(1);
  });

  it('should render barcode info Text', () => {
    const barcodeInfo = wrapper.find('Text').at(6);

    expect(barcodeInfo.props().children).to.equal(defaultProps.barcodeInfo.barcodeNumber);
  });
});
