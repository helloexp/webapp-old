import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import RadioButtonGroup from '../core/RadioButtonGroup';
import RadioButton from '../core/RadioButtonGroup/RadioButton';

describe('RadioButtonGroup', () => {
  it('should display all radio buttons when render the component ', () => {
    const render = TestUtils.renderIntoDocument(
      <RadioButtonGroup name="shipSpeed">
        <RadioButton
          label="prepare for light speed"
          value="light"
        />
        <RadioButton
          label="light speed too slow"
          value="not_light"
        />
        <RadioButton
          disabled
          label="go to ludicrous speed"
          value="ludicrous"
        />
      </RadioButtonGroup>
    );

    const renNode = TestUtils.scryRenderedComponentsWithType(render, RadioButton);

    expect(renNode.length).to.equal(3);
  });

  it('should set the name of all the radio input when name props is passed', () => {
    const render = TestUtils.renderIntoDocument(
      <RadioButtonGroup name="shipSpeed">
        <RadioButton
          label="prepare for light speed"
          value="light"
        />
        <RadioButton
          label="light speed too slow"
          value="not_light"
        />
      </RadioButtonGroup>
    );
    const renNode = TestUtils.scryRenderedComponentsWithType(render, RadioButton);

    for (let iter = 0; iter++; iter < renNode.length) {
      const input = TestUtils.findRenderedDOMComponentWithTag(renNode[iter], 'input');

      expect(input.getAttribute('name')).to.equal('shipSpeed');
    }
  });

  it('should select the value of the radio when valueSelected props is passed', () => {
    const render = TestUtils.renderIntoDocument(
      <RadioButtonGroup name="shipSpeed" valueSelected="not_light">
        <RadioButton
          label="prepare for light speed"
          value="light"
        />
        <RadioButton
          label="light speed too slow"
          value="not_light"
        />
      </RadioButtonGroup>
    );
    const renNode = TestUtils.scryRenderedComponentsWithType(render, RadioButton);
    const input = TestUtils.findRenderedDOMComponentWithTag(renNode[1], 'input');

    expect(input.checked).to.equal(true);
  });

  it('should call the onChange callback function when radio input value is changed', () => {
    const mockonChange = spy();
    const render = TestUtils.renderIntoDocument(
      <RadioButtonGroup name="shipSpeed" onChange={mockonChange} valueSelected="not_light">
        <RadioButton
          label="prepare for light speed"
          value="light"
        />
        <RadioButton
          label="light speed too slow"
          value="not_light"
        />
      </RadioButtonGroup>
    );
    const renNode = TestUtils.scryRenderedComponentsWithType(render, RadioButton);
    const input = TestUtils.findRenderedDOMComponentWithTag(renNode[0], 'input');

    TestUtils.Simulate.change(input);
    expect(mockonChange).to.be.called; // eslint-disable-line no-unused-expressions
  });
});
