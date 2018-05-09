import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import RadioButton from '../core/RadioButtonGroup/RadioButton';

describe('RadioButton', () => {
  it('should display radio input when render the RadioButton component', () => {
    const render = TestUtils.renderIntoDocument(<RadioButton />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.getAttribute('type')).to.equal('radio');
  });

  it('should display label  when the label props is passed', () => {
    const render = TestUtils.renderIntoDocument(<RadioButton label="Test label" />);
    const renNode = ReactDOM.findDOMNode(render);

    expect(renNode.childNodes[1].textContent).to.equal('Test label');
  });

  it('should be disabled when the disabled props is passed', () => {
    const render = TestUtils.renderIntoDocument(<RadioButton disabled />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.disabled).to.equal(true);
  });

  it('should set label position to left or right when prop passed respectively', () => {
    const render = TestUtils.renderIntoDocument(<RadioButton label="Test label" labelPosition="left" />);
    const renNode = ReactDOM.findDOMNode(render);

    expect(renNode.childNodes[0].textContent).to.equal('Test label');
  });

  it('should set value when value props is passed', () => {
    const render = TestUtils.renderIntoDocument(<RadioButton value="test" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.value).to.equal('test');
  });

  it('should radio button trigger the onCheck event handled by the RadioButton', () => {
    const onSwitchSpy = spy();
    const render = TestUtils.renderIntoDocument(<RadioButton onCheck={onSwitchSpy} />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    TestUtils.Simulate.change(input);
    expect(onSwitchSpy.called).to.equal(true);
  });
});
