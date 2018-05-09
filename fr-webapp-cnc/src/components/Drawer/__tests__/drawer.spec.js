import React from 'react';
import Drawer from '../index';

function mountItem(props = {}) {
  const renderProps = { ...props };

  return testHelpers.mountWithAll(<Drawer {...renderProps} />);
}

describe('Drawer component', () => {
  let wrapper;

  it('should render drawer component', () => {
    wrapper = mountItem();
    const drawer = wrapper.find('div');

    expect(drawer.length).to.equal(4);
  });

  it('should render h1 tag', () => {
    wrapper = mountItem({ variation: 'giftHeader' });
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
  });

  it('should not render footer', () => {
    wrapper = mountItem({ variation: 'noFooter', hideCloseIcon: true });
    const button = wrapper.find('Button');

    expect(button.length).to.equal(0);
  });

  it('should not render close button', () => {
    wrapper = mountItem({ hideCloseIcon: true });
    const button = wrapper.find('Button');

    expect(button.length).to.equal(2);
  });

  it('should trigger callback when clicking on cancel button', () => {
    const spy = sinon.spy();

    wrapper = mountItem({ onCancel: spy });
    const cancelButton = wrapper.find('Button').first();

    cancelButton.simulate('click');

    expect(spy.called).to.equal(true);
  });

  it('should trigger callback when clicking on accept button', () => {
    const spy = sinon.spy();

    wrapper = mountItem({ onAccept: spy });
    const acceptButton = wrapper.find('Button').at(2);

    acceptButton.simulate('click');

    expect(spy.called).to.equal(true);
  });
});
