import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import { spy } from 'sinon';
import { expect } from 'chai';
import cx from 'classnames';
import ProxyLink from '../core/ProxyLink';
import Image from '../Image';
import styles from '../core/ProxyLink/ProxyLink.scss';

describe('ProxyLink', () => {
  it('should capture passed props', () => {
    const mockCallback = spy();
    const wrapper = testHelpers.mountWithStore(
      <ProxyLink
        fontSize="1em"
        fontWeight="bold"
        linkText="Click on this link"
        linkUrl="testLinkUrl"
        onClickEvent={mockCallback}
        textColor="black"
        textDecoration="underline"
      />
    );

    expect(wrapper.props().linkUrl).to.equal('testLinkUrl');
    expect(wrapper.props().linkText).to.equal('Click on this link');
    expect(wrapper.props().textColor).to.equal('black');
    expect(wrapper.props().fontWeight).to.equal('bold');
    expect(wrapper.props().fontSize).to.equal('1em');
    expect(wrapper.props().textDecoration).to.equal('underline');
  });

  it('should set the href value to the linkUrl value passed as props', () => {
    const render = TestUtils.renderIntoDocument(<ProxyLink
      linkText="Click on this link"
      linkUrl="http://uniqlo.com"
    />);

    const renderedNode = ReactDOM.findDOMNode(render);

    expect(renderedNode.getAttribute('href')).to.equal('http://uniqlo.com');
    expect(renderedNode.textContent).to.equal('Click on this link');
  });

  it('should set call the callback function passed in props on click', () => {
    const mockCallback = spy();
    const render = TestUtils.renderIntoDocument(<ProxyLink
      linkText="Click on this link"
      linkUrl="http://uniqlo.com"
      onClickEvent={mockCallback}
    />);

    const renderedNode = ReactDOM.findDOMNode(render);

    TestUtils.Simulate.click(renderedNode);
    expect(mockCallback.called).to.equal(true);
  });

  it('verifies the styles passed as classNames', () => {
    const render = TestUtils.renderIntoDocument(<ProxyLink
      fontSize="0.5em"
      fontWeight="normal"
      linkText="Click on this link"
      textColor="blue"
      textDecoration="none"
    />);

    const proxyLink = TestUtils.findRenderedDOMComponentWithTag(render, 'a');

    expect(proxyLink.getAttribute('class')).to.equal(cx(styles.proxyLink));
  });

  it('should render the child element', () => {
    const wrapper = testHelpers.mountWithStore(
      <ProxyLink linkUrl="testLinkUrl">
        <Image source="https://facebook.github.io/react/img/logo_og.png" />
      </ProxyLink>
    );

    expect(wrapper.find('img').props().src).to.equal('https://facebook.github.io/react/img/logo_og.png');
  });
});
