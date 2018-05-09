import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import DeliveryPreferencePanel from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<DeliveryPreferencePanel />);
}

describe('src/pages/Checkout/components/DeliveryPreferencePanel', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render DeliveryPreferencePanel component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render DeliveryPreferencePanel Heading correctly', () => {
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
    expect(heading.props().headingText).to.equal(i18n.delivery.deliveryPreferenceTitle);
  });

  it('should render DeliveryPreferencePanel description Text correctly', () => {
    const text = wrapper.find('Text').last();

    expect(text.props().children).to.equal(i18n.delivery.splitDelivery);
  });
});
