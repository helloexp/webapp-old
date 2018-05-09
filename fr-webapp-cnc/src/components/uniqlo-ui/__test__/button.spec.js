import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import Button from '../Button';

describe('Button', () => {
  it('checks the button text that is passed through label property', () => {
    const render = TestUtils.renderIntoDocument(<Button label="Login" />);
    const button = TestUtils.findRenderedDOMComponentWithTag(render, 'button');

    expect(button.textContent).to.equal('Login');
  });

  it('should trigger the MouseEnter event handled by the button', () => {
    const mouseEnterSpy = spy();
    const render = TestUtils.renderIntoDocument(<Button onMouseEnter={mouseEnterSpy} />);
    const button = TestUtils.findRenderedDOMComponentWithTag(render, 'button');

    TestUtils.Simulate.mouseEnter(button);
    expect(mouseEnterSpy.called).to.equal(true);
  });

  it('should trigger the TouchTap event handled by the button', () => {
    const touchTapSpy = spy();
    const node = TestUtils.renderIntoDocument(<Button onTouchTap={touchTapSpy} />);
    const button = ReactDOM.findDOMNode(node);

    TestUtils.Simulate.click(button);
    expect(touchTapSpy.called).to.equal(true);
  });

  it('should trigger the MouseLeave event handled by the button', () => {
    const mouseLeaveSpy = spy();
    const render = TestUtils.renderIntoDocument(<Button label="admin" onMouseLeave={mouseLeaveSpy} />);
    const button = TestUtils.findRenderedDOMComponentWithTag(render, 'button');

    TestUtils.Simulate.mouseLeave(button);
    expect(mouseLeaveSpy.called).to.equal(true);
  });

  it('verifies the disable property of a button component', () => {
    const render = TestUtils.renderIntoDocument(<Button disabled={false} />);
    const button = TestUtils.findRenderedDOMComponentWithTag(render, 'button');

    expect(button.disabled).to.equal(false);
  });

  it('verifies the styles of the button', () => {
    const render = TestUtils.renderIntoDocument(
      <Button className="className" style={{ border: 'none' }} />);

    const button = TestUtils.findRenderedDOMComponentWithTag(render, 'button');

    expect(button.getAttribute('class')).to.have.string('');
  });
});
