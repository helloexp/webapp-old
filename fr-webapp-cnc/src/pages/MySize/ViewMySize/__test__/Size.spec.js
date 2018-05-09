import React from 'react';
import Size from '../Size';

function mountItem(props = {}) {
  const renderProps = { ...props };

  return testHelpers.mountWithAll(<Size {...renderProps} />);
}

describe('Size component', () => {
  let wrapper;

  it('should not render Accordion component', () => {
    wrapper = mountItem({ size: {} });
    const Accordion = wrapper.find('AccordionItem');

    expect(Accordion.length).to.equal(0);
  });

  it('should render Accordion component', () => {
    wrapper = mountItem({ size: { size_id: 1 } });
    const Accordion = wrapper.find('AccordionItem');

    expect(Accordion.length).to.equal(1);
  });

  it('should trigger callback when clicking on deleteSize button', () => {
    const spy = sinon.spy();

    wrapper = mountItem({ deleteSize: spy, size: { size_id: 1 }, index: 0 });
    const deleteButton = wrapper.find('Button').last();

    deleteButton.simulate('click');

    expect(spy.called).to.equal(true);
  });
});
