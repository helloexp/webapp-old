import React from 'react';
import i18n from 'i18n/strings-ja';
import ErrorMessage from '../index';

function mountItem(props = {}) {
  const renderProps = { errorIdentifier: 1, message: 'test', ...props };

  return testHelpers.mountWithAll(<ErrorMessage {...renderProps} />);
}

const { giftError, confirmError } = i18n.delivery;

describe('components/ErrorMessage', () => {
  let wrapper;

  it('should render message', () => {
    wrapper = mountItem({ message: giftError });
    const text = wrapper.find('Text');

    expect(text.length).to.equal(1);
    expect(text.props().children).to.equal(giftError);
    wrapper.setProps({ message: confirmError, scrollUpOnError: true });
    expect(text.props().children).to.equal(confirmError);
  });

  it('should render close button', () => {
    wrapper = mountItem({ showCloseButton: true });
    const button = wrapper.find('Button');

    button.simulate('click');
    expect(button.length).to.equal(1);
  });

  it('should not render close button', () => {
    wrapper = mountItem({ showCloseButton: false });
    const closeButton = wrapper.find('Button');

    expect(closeButton.length).to.equal(0);
  });
});
