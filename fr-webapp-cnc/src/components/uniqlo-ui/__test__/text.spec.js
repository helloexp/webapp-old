import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import { spy } from 'sinon';
import { expect } from 'chai';
import Text from '../Text';

describe('Text', () => {
  // TODO: cover all the scenarios for the test cases
  // TODO: cover test cases based on configuration as well
  it('should check whether all the props are captured.', () => {
    const render = TestUtils.renderIntoDocument(<Text content="Hello World" />);
    const TextDomNode = ReactDOM.findDOMNode(render);

    expect(TextDomNode.textContent).to.equal('Hello World');
    expect(TextDomNode.className).to.equal('txt');
  });

  it('should display the text with specified style when style props is passed', () => {
    const render = TestUtils.renderIntoDocument(
      <Text
        content="Hello World"
        style={{ color: 'red', display: 'block' }}
      />
    );
    const TextDomNode = ReactDOM.findDOMNode(render);

    expect(TextDomNode.style.color).to.equal('red');
  });

  it('should trigger the onPress event', () => {
    const opPressSpy = spy();
    const render = TestUtils.renderIntoDocument(
      <Text
        content="Hello World"
        onPress={opPressSpy}
      />
    );
    const TextDomNode = ReactDOM.findDOMNode(render);

    TestUtils.Simulate.click(TextDomNode);
    expect(opPressSpy.called).to.equal(true);
  });
});
