import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import config from 'config/site/default';
import ShippingAddressForm from '../ShippingAddressForm.js';

function setup() {
  return testHelpers.mountWithAll(<ShippingAddressForm />);
}
describe('src/pages/Checkout/Delivery/Shipping/ShippingAddressForm', () => {
  const wrapper = setup();

  it('should render ShippingAddressForm component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render the enter address label correctly', () => {
    const label = wrapper.find('Text').at(0).props().children;

    expect(label).to.equal(i18n.checkout.enterAddress);
  });

  it('should render the TSLToolTip component correctly', () => {
    const component = wrapper.find('TSLToolTip');

    expect(component.length).to.equal(1);
    expect(component.html()).to.have.string(i18n.common.tslTooltip.tooltipText);
    expect(component.html()).to.have.string(i18n.common.tslTooltip.toolTipLinkText);
    expect(component.find(`[href="${config.ABOUT_TLS_URL}"]`)).to.have.length(1);
  });

  it('should render the AddressForm component correctly', () => {
    expect(wrapper.find('AddressForm').length).to.equal(1);
  });

  it('should render the contactYou label correctly', () => {
    const label = wrapper.find('Text').at(3).props().children;

    expect(label).to.equal(i18n.checkout.contactYou);
  });

  it('should render the CheckBoxWithToolTip component correctly', () => {
    expect(wrapper.find('CheckBoxWithToolTip').length).to.equal(1);
  });

  it('should render the ValidationMessage component correctly', () => {
    expect(wrapper.find('ValidationMessage').length).to.equal(1);
  });

  it('should render the Button component correctly', () => {
    const component = wrapper.find('Button').last();

    expect(component.length).to.equal(1);
    expect(component.props().label).to.equal(i18n.common.done);
  });
});
