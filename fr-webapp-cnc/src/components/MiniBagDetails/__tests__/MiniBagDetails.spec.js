import React from 'react';
import MiniBagDetails from '../index';

const defaultProps = {
  onToggle: () => null,
  goToCart: () => null,
};

function mountItem(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return shallow(<MiniBagDetails {...renderProps} />);
}

describe('MiniBagDetails', () => {
  it('should render properly', () => {
    const wrapper = mountItem();

    chai.expect(wrapper).not.to.equal(undefined);
  });
});
