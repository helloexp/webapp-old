import React from 'react';
import { expect } from 'chai';
import ErrorMessageTile from '../ErrorMessageTile.js';

const defaultProps = {
  showError: true,
  message: 'エラーが発生しました。',
};

function mountItem(props) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<ErrorMessageTile {...renderProps} />);
}

describe('src/pages/Checkout/components/PaymentMethodTile/ErrorMessageTile', () => {
  let wrapper;

  describe('ErrorMessageTile - show error message', () => {
    beforeEach(() => {
      wrapper = mountItem();
    });

    it('should render ErrorMessageTile component correctly', () => {
      expect(wrapper.length).to.equal(1);
    });

    it('should render error message Text correctly', () => {
      const error = wrapper.find('Text');

      expect(error.length).to.equal(1);
      expect(error.props().content).to.equal('エラーが発生しました。');
    });
  });

  describe('ErrorMessageTile - do not show error message', () => {
    beforeEach(() => {
      wrapper = mountItem({ showError: false });
    });
    it('should not render error message Text', () => {
      const error = wrapper.find('Text');

      expect(error.length).to.equal(0);
    });
  });
});
