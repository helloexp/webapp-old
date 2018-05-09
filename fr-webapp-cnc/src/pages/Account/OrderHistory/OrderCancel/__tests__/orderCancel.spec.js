import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import OrderCancel from '../index';

const state = {
  orderHistory: {
    orderHistoryList: [],
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<OrderCancel params={{}} />, state);
}

describe('src/pages/Account/OrderHistory/OrderCancel', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render OrderCancel component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Drawer component correctly', () => {
    const drawer = wrapper.find('Drawer');

    expect(drawer.length).to.equal(1);
  });

  it('should show cancellation confirmation message', () => {
    const cancellationConfirm = wrapper.find('Text').first();

    expect(cancellationConfirm.props().children).to.equal(i18n.orderHistory.cancelationQuestion);
  });

  it('should render OrderDataTile component correctly', () => {
    const orderDataTile = wrapper.find('OrderDataTile');

    expect(orderDataTile.length).to.equal(1);
  });

  it('should show cancellation confirmation button', () => {
    const cancelButton = wrapper.find('Button').last();

    expect(cancelButton.props().label).to.equal(i18n.orderHistory.cancelTheOrder);
  });

  it('should show go back text', () => {
    const goBackText = wrapper.find('Text').last();

    expect(goBackText.props().children).to.equal(i18n.orderHistory.quit);
  });
});
