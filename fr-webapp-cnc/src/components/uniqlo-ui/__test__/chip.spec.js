import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import { spy } from 'sinon';
import { expect } from 'chai';
import Chip from '../Chip';
import Image from '../Image';
import Text from '../Text';
import ChipChild from '../Chip/ChipChild';

describe('Chip', () => {
  it('should check the no. of chips passed as a children', () => {
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head">
        <ChipChild headingContent="data1" toolTipData="tool1">
          <Image source="https://facebook.github.io/react/img/logo_og.png" />
        </ChipChild>
        <ChipChild headingContent="data2" toolTipData="tool2">
          <Image source="https://facebook.github.io/react/img/logo_og.png" />
        </ChipChild>
        <ChipChild headingContent="data3" toolTipData="tool3">
          <Image source="https://facebook.github.io/react/img/logo_og.png" />
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    expect(DomNode.length).to.equal(3);
  });

  it('should validate Image chip rendered correctly', () => {
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head">
        <ChipChild headingContent="data1" toolTipData="tool1">
          <Image source="https://facebook.github.io/react/img/logo_og.png" />
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.findRenderedDOMComponentWithTag(render, 'img');

    expect(DomNode.getAttribute('src')).to.equal('https://facebook.github.io/react/img/logo_og.png');
  });

  it('should validate Text chip rendered correctly', () => {
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head">
        <ChipChild headingContent="data1" toolTipData="Hello World">
          <Text>Hello World</Text>
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    expect(DomNode[0].props.toolTipData).to.equal('Hello World');
  });

  it('should trigger the onMouseEnter event', () => {
    const onClickSpy = spy();
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head" onMouseEnter={onClickSpy}>
        <ChipChild headingContent="data1" toolTipData="tool1">
          <Text>Hello World</Text>
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    TestUtils.Simulate.mouseEnter(ReactDOM.findDOMNode(DomNode[0]));
    expect(onClickSpy.called).to.equal(true);
  });

  it('should trigger the onMouseClick event', () => {
    const onClickSpy = spy();
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head" onMouseClick={onClickSpy}>
        <ChipChild headingContent="data1" toolTipData="tool1">
          <Text>Hello World</Text>
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(DomNode[0]));
    expect(onClickSpy.called).to.equal(true);
  });

  it('should trigger the onTouchTap event', () => {
    const onClickSpy = spy();
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head" onTouchTap={onClickSpy}>
        <ChipChild headingContent="data1" toolTipData="tool1">
          <Text>Hello World</Text>
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(DomNode[0]));
    expect(onClickSpy.called).to.equal(true);
  });

  it('should not trigger the onTouchTap event if the child is disabled', () => {
    const onClickSpy = spy();
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head" onTouchTap={onClickSpy}>
        <ChipChild enable headingContent="data1" toolTipData="tool1">
          <Text>Hello World</Text>
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(DomNode[0]));
    expect(onClickSpy.called).to.not.equal(true);
  });

  it('should trigger the onTouchTap event if the child is disabled but we have allowDisabled prop present', () => {
    const onClickSpy = spy();
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head" onTouchTap={onClickSpy}>
        <ChipChild allowDisabled enable headingContent="data1" toolTipData="tool1">
          <Text>Hello World</Text>
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    TestUtils.Simulate.click(ReactDOM.findDOMNode(DomNode[0]));
    expect(onClickSpy.called).to.equal(true);
  });

  it('should trigger the onMouseLeave event', () => {
    const onClickSpy = spy();
    const render = TestUtils.renderIntoDocument(
      <Chip headingText="head" onMouseLeave={onClickSpy}>
        <ChipChild headingContent="data1" toolTipData="tool1">
          <Text>Hello World</Text>
        </ChipChild>
      </Chip>
    );

    const DomNode = TestUtils.scryRenderedComponentsWithType(render, ChipChild);

    TestUtils.Simulate.mouseLeave(ReactDOM.findDOMNode(DomNode[0]));
    expect(onClickSpy.called).to.equal(true);
  });
});
