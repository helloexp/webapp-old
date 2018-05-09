import React from 'react';
import { expect } from 'chai';
import DeliveryView from '../DeliveryView';

const defaultProps = {
  deliveryDetails: {},
  storeDetail: {},
  storeDetailsAvailable: true,
};

function mountItem() {
  return testHelpers.mountWithAll(<DeliveryView {...defaultProps} />);
}

describe('src/pages/Account/OrderHistory/components/DeliveryView', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render DeliveryView component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render AddressPanel component correctly', () => {
    const addressPanel = wrapper.find('AddressPanel');

    expect(addressPanel.length).to.equal(1);
  });

  it('should show store details if available', () => {
    const storeDetailText = wrapper.find('Text');

    expect(storeDetailText.length).to.equal(2);
  });
});
