import React from 'react';
import i18n from 'i18n/strings-en';
import ApplePayRegistrationSuccess from '../ApplePayRegistrationSuccess.js';

const state = {
  isRegistrationInfoModalActive: false,
};

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<ApplePayRegistrationSuccess {...props} />, { ...state });
}

describe('pages/checkout/ApplePayRegistrationSuccess', () => {
  const wrapper = mountItem({ emailId: 'test@test.com', value: 'test@test.com' });

  it('should render correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render proper title', () => {
    const drawerWrapper = wrapper.find('Drawer');

    expect(drawerWrapper.find('h1').text()).to.equal(i18n.applePay.registrationComplete);
  });

  it('should display registration success message', () => {
    const container = wrapper.find('Container');

    expect(container.find('Text').first().text()).to.equal(i18n.applePay.thankyouForRegistration);
  });

  it('should display continue shopping button', () => {
    expect(wrapper.find('Button').length).to.equal(2);
  });

  it('should render RegistrationInfoModal if RegistrationInfoModal is active', () => {
    wrapper.setState({ isRegistrationInfoModalActive: true });
  });
});
