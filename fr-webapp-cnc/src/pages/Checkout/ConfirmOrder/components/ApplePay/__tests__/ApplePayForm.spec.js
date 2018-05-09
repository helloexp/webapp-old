import React from 'react';
import ApplePayForm from '../ApplePayForm.js';

const state = {
  isFormValid: false,
  isPasswordVisible: false,
  isSubscribed: true,
  password: '',
};

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<ApplePayForm {...props} />, { ...state });
}

describe('pages/checkout/ApplePayForm', () => {
  const wrapper = mountItem({
    variation: 'noFooter',
    cartSpacing: 'cartSpacingSubTitle',
    className: 'applePayDrawer',
    type: true,
  });

  it('should render correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render logo', () => {
    expect(wrapper.find('img').hasClass('logoApplePayForm')).to.equal(true);
  });

  it('should show InfoToolTip', () => {
    const infoToolTip = wrapper.find('InfoToolTip').first();

    expect(infoToolTip.length).to.equal(1);
  });

  it('Drawer should have the class name applePayDrawer', () => {
    expect(wrapper.find('Drawer').hasClass('applePayDrawer')).to.equal(true);
  });

  it('should render all buttons', () => {
    expect(wrapper.find('Button').length).to.equal(3);
  });

  it('should render checkbox', () => {
    expect(wrapper.find('CheckBox').length).to.equal(2);
  });
});
