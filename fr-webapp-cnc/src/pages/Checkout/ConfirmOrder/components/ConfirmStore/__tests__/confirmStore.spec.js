import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import { getPayAtStoreTime } from 'utils/formatDate';
import ConfirmStore from '../index';

const defaultProps = {
  barcodeInfo: {
    barcodeImage: {
      contentType: 'image/png',
      content: 'iVBORw0KGgoAAAANSUhEUgAAAdgAAABUAQAAAAAJpxsjAAAACXBIWXMAAAYnAAAGJwFNVNjHAAAA' +
              'EnRFWHRTb2Z0d2FyZQBCYXJjb2RlNEryjnYuAAAAVklEQVR42u3LsQ2AIBgF4WcoKBmBRYwuRqKj' +
              'yUaUf8WTzgUsr73LpzhKnCN13xrJ2uX5hVaznZ+iFaZajcu52+tt6wmLxWKxWCwWi8VisVgsFovF' +
              '/mpfLl0GhyJbjycAAAAASUVORK5CYII=' },
    orderTimeLimit: '20170807201238',
    barcodeNumber: '5071917206279',
  },
  storeDetail: {
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
    Saturday: {},
    Sunday: {},
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<ConfirmStore {...renderProps} />);
}

describe('src/pages/Checkout/ConfirmOrder/components/ConfirmStore', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render ConfirmStore component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render ConfirmStore component correctly when barcodeInfo is null', () => {
    const wrapperWithBarcodeInfoNull = mountItem({ barcodeInfo: null });

    expect(wrapperWithBarcodeInfoNull.length).to.equal(1);
  });

  it('should show order completion Heading', () => {
    const heading = wrapper.find('Heading').first();

    expect(heading.props().headingText).to.equal(i18n.orderConfirmation.orderCompletion);
  });

  it('should show pay at store Heading', () => {
    const heading = wrapper.find('Heading').last();

    expect(heading.props().headingText).to.equal(i18n.orderConfirmation.payAtStoreTitle);
  });

  it('should show order time limit text', () => {
    const orderTimeLimit = wrapper.find('Text').first();

    expect(orderTimeLimit.props().children).to.equal(getPayAtStoreTime('20170807201238'));
  });

  it('should show barcode image', () => {
    const barcodeImage = wrapper.find('Image');

    expect(barcodeImage.length).to.equal(1);
  });

  it('should show barcode number text', () => {
    const barcodeNo = wrapper.find('Text').last();

    expect(barcodeNo.props().children).to.equal('5071917206279');
  });
});
