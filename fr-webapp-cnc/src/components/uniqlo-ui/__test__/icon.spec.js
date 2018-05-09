import React from 'react';
import { expect } from 'chai';
import TestUtils from 'react-addons-test-utils';
import Icon from '../core/Icon';

describe('Icon', () => {
  it('should render icon when className props passed', () => {
    const component = TestUtils.renderIntoDocument(<Icon className="iconHelp" />);
    const Node = TestUtils.scryRenderedDOMComponentsWithClass(component, 'iconHelp');

    expect(Node).to.not.be.undefined; // eslint-disable-line no-unused-expressions
  });
});
