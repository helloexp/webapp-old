import React from 'react';
import MiniBagContainer from '../index';

const defaultProps = {
  onToggle: () => null,
  totalOrderAmount: '2000',
  toggleButton: <span className="toggle-button" />,
  common: {
    price: 'price',
  },
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<MiniBagContainer {...renderProps} />);
}

describe('MiniBagContainer', () => {
  it('should call callback when clicking on toggle button', () => {
    const clickSpy = sinon.spy();

    const wrapper = mountItem({ onToggle: clickSpy });

    wrapper.find('.toggle-button').simulate('click');
    chai.expect(clickSpy.calledOnce).to.equal(true);
  });
});
