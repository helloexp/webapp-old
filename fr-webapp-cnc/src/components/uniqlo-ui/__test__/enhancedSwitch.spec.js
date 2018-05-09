import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import EnhancedSwitch from '../core/EnhancedSwitch';

describe('EnhancedSwitch', () => {
  // RadioButton test cases
  it('should display radio button with inputType radio is passed', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch inputType="radio" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.getAttribute('type')).to.equal('radio');
  });

  it('should have radio button value when the value props is passed', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch inputType="radio" value="Hello" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.value).to.equal('Hello');
  });

  it('should set radio button checked when checked props is true', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch checked inputType="radio" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.checked).to.be.equal(true);
  });

  it('should set radio button  checked when defaultChecked props is true', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch defaultChecked inputType="radio" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.checked).to.be.equal(true);
  });

  it('should be radio button disabled when the disabled props is passed', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch disabled inputType="radio" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.disabled).to.equal(true);
  });

  it('should set name when name props is passed', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch inputType="radio" name="chName" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.name).to.equal('chName');
  });

  // Checkbox test cases
  it('should display checkbox with inputType checkbox is passed', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch inputType="checkbox" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.getAttribute('type')).to.equal('checkbox');
  });

  it('should have checkbox value when the value props is passed', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch inputType="checkbox" value="Hello" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.value).to.equal('Hello');
  });

  it('should set checkbox  checked when checked props is true', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch checked inputType="checkbox" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.checked).to.be.equal(true);
  });

  it('should set checkbox  checked when defaultChecked props is true', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch defaultChecked inputType="checkbox" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.checked).to.be.equal(true);
  });

  it('should checkbox trigger the onSwich event handled by the checkbox', () => {
    const onSwitchSpy = spy();
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch inputType="checkbox" onSwitch={onSwitchSpy} />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    TestUtils.Simulate.change(input);
    expect(onSwitchSpy.called).to.equal(true);
  });

  it('should be checkbox disabled when the disabled props is passed', () => {
    const render = TestUtils.renderIntoDocument(<EnhancedSwitch disabled inputType="checkbox" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.disabled).to.equal(true);
  });
});
