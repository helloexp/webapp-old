import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import CheckBox from '../core/CheckBox';

describe('CheckBox', () => {
  it('should display checkbox input when render the CheckBox component', () => {
    const render = TestUtils.renderIntoDocument(<CheckBox />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.getAttribute('type')).to.equal('checkbox');
  });

  it('should be checked by default when the defaultChecked props is passed', () => {
    const render = TestUtils.renderIntoDocument(<CheckBox defaultChecked />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.checked).to.equal(true);
  });

  it('should display label  when the label props is passed', () => {
    const render = TestUtils.renderIntoDocument(<CheckBox label="Test label" />);
    const renNode = ReactDOM.findDOMNode(render);

    expect(renNode.childNodes[1].textContent).to.equal('Test label');
  });

  it('should be disabled when the disabled props is passed', () => {
    const render = TestUtils.renderIntoDocument(<CheckBox disabled />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.disabled).to.equal(true);
  });

  it('should set label position to left or right when prop passed respectively', () => {
    const render = TestUtils.renderIntoDocument(<CheckBox label="Test label" labelPosition="left" />);
    const renNode = ReactDOM.findDOMNode(render);

    expect(renNode.childNodes[0].textContent).to.equal('Test label');
  });

  it('should set value when value props is passed', () => {
    const render = TestUtils.renderIntoDocument(<CheckBox value="test value" />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    expect(input.value).to.equal('test value');
  });

  it('should change the value  when checkbox button is clicked', () => {
    const render = TestUtils.renderIntoDocument(<CheckBox checked />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    input.checked = !input.checked;
    TestUtils.Simulate.change(input);
    expect(input.checked).to.equal(false);
  });

  it('should checkbox button trigger the onCheck event handled by the checkbox', () => {
    const onSwitchSpy = spy();
    const render = TestUtils.renderIntoDocument(<CheckBox onCheck={onSwitchSpy} />);
    const input = TestUtils.findRenderedDOMComponentWithTag(render, 'input');

    TestUtils.Simulate.change(input);
    expect(onSwitchSpy.called).to.equal(true);
  });
});
