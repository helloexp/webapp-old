import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { spy } from 'sinon';
import cx from 'classnames';
import Container from '../core/Container';
import styles from '../core/Container/Container.scss';

describe('Container', () => {
  it('should apply the properties of the class to the Container when the Container is rendered', () => {
    const render = TestUtils.renderIntoDocument(<Container className="testClass" />);
    const image = TestUtils.findRenderedDOMComponentWithTag(render, 'div');

    expect(image.className).to.have.string(cx(styles.container, styles.testClass));
  });

  it('should check if click handling works', () => {
    const clickHandlerOuter = spy();
    const clickHandlerInner = spy();
    const render = TestUtils.renderIntoDocument(
      <Container onClick={clickHandlerOuter} >
        <Container onClick={clickHandlerInner} />
      </Container>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, Container);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(DomNode[1]));
    expect(clickHandlerOuter.called).to.equal(false);
    expect(clickHandlerInner.called).to.equal(true);
  });

  it('container should behave and pass clicks to parent if it does not know what to do with them', () => {
    const clickHandlerOuter = spy();
    const render = TestUtils.renderIntoDocument(
      <Container onClick={clickHandlerOuter} >
        <Container />
      </Container>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, Container);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(DomNode[1]));
    expect(clickHandlerOuter.called).to.equal(true);
  });
});
