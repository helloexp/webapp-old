import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Label from '../Label';

describe('Label', () => {
  it('should capture props is passed', () => {
    const render = TestUtils.renderIntoDocument(<Label
      background="Red"
      className="testClass"
      foreground="black"
      id="testId"
      text="labelText"
    />);

    expect(render.props.id).to.equal('testId');
    expect(render.props.className).to.equal('testClass');
    expect(render.props.background).to.equal('Red');
    expect(render.props.foreground).to.equal('black');
    expect(render.props.text).to.equal('labelText');
  });
});
