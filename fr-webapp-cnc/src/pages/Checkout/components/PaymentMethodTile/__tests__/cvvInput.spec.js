import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import CvvInput from '../CvvInput.js';

const defaultProps = {
  cvv: '123',
};

function mountItem(props) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<CvvInput {...renderProps} />);
}

describe('src/pages/Checkout/components/PaymentMethodTile/CvvInput', () => {
  const spy = sinon.spy();
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem({ onCvvInfoPress: spy, applyCreditCard: spy });
  });

  it('should render CvvInput component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render cvv Input field', () => {
    const input = wrapper.find('Input');

    expect(input.length).to.equal(1);
    expect(input.props().label).to.equal(i18n.paymentMethod.cvvCode);
  });

  it('should render cvv images', () => {
    const cvvImage = wrapper.find('Image');

    expect(cvvImage.length).to.equal(2);
  });

  it('should trigger callback when clicking on cvv info button', () => {
    const infoButton = wrapper.find('Button').first();

    infoButton.simulate('click');
    chai.expect(spy.called).to.equal(true);
  });

  it('should render BillingAddressPanel component', () => {
    const billingAddress = wrapper.find('BillingAddressPanel');

    expect(billingAddress.length).to.equal(1);
  });

  it('should render apply Button', () => {
    const applyButton = wrapper.find('Button').last();

    expect(applyButton.props().label).to.equal(i18n.payment.applyCreditCard);
  });

  it('should trigger callback when clicking on apply button', () => {
    const applyButton = wrapper.find('Button').last();

    applyButton.simulate('click');
    chai.expect(spy.called).to.equal(true);
  });
});
