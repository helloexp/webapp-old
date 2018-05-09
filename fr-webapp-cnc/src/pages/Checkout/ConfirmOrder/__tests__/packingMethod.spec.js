import React from 'react';
import config from 'i18n/strings-ja.js';
import PackingMethod from '../PackingMethod';

const defaultProps = {
  arrivalDate: config.account.date,
  timeFrameMessage: config.checkout.nextDayMessage,
};

function mountItem(props) {
  return testHelpers.mountWithAll(<PackingMethod {...defaultProps} {...props} />);
}

describe('src/pages/Checkout/ConfirmOrder/PackingMethod', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render PackingMethod component correctly', () => {
    expect(wrapper.find('ShippingSummary').length).to.equal(1);
  });

  it('should render arrivalDate correctly', () => {
    const text = wrapper.find('Text').last();

    expect(text.props().children).to.equal(config.account.date);
  });

  it('should render timeFrameMessage correctly', () => {
    const text = wrapper.find('Text').at(1);

    expect(text.props().children).to.equal(config.checkout.nextDayMessage);
  });
});
