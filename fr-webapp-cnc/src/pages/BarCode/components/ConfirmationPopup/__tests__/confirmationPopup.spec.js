import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import Text from 'components/uniqlo-ui/Text';
import Icon from 'components/uniqlo-ui/core/Icon';
import ConfirmationPopupTest from '../index';

const defaultProps = {
  message: i18n.membership.confirmExchangeMessage,
};

function setup(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<ConfirmationPopupTest {...renderProps} />, i18n);
}

describe('src/pages/BarCode/components/ConfirmationPopup', () => {
  it('should render ConfirmationPopup component correctly', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should get confirmation message', () => {
    const wrapper = setup();
    const message = wrapper.find(Text);

    expect(message.props().children).to.equal(i18n.membership.confirmExchangeMessage);
  });

  it('should render BarcodeButton when coupon is choosed', () => {
    const onButtonClick = sinon.spy();
    const wrapper = setup({ closePopup: onButtonClick });
    const icon = wrapper.find(Icon);

    icon.simulate('click');
    expect(onButtonClick.called).to.equal(true);
  });

  it('should have close popup icon', () => {
    const wrapper = setup();
    const icon = wrapper.find(Icon);

    expect(icon.props().className).to.equal('iconClose');
  });
});
