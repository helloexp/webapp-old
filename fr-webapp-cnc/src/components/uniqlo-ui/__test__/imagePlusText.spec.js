import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import ImagePlusText from '../ImagePlusText';

describe('ImagePlusText', () => {
  it('should render all the props passed', () => {
    const ImagePlusTextProps = {
      id: 'ImagePlusTextId',
      className: 'className',
      style: { width: 50 },
      imageSrc: 'https://facebook.github.io/react/img/logo_og.png',
      imageTitle: 'altText',
      imageStyle: { width: 100 },
      text: 'textContent',
      textStyle: { width: 150 },
      link: 'http://www.uniqlo.com/jp/stylingbook/pc/style/7746',
      linkText: 'Link Text',
      linkStyle: { width: 200 },
      targetwindow: '_blank',
      variation: 'imageRight',
    };

    const wrapper = testHelpers.mountWithStore(<ImagePlusText {...ImagePlusTextProps} />);

    expect(wrapper.props().id).to.equal('ImagePlusTextId');
    expect(wrapper.props().className).to.equal('className');
    expect(wrapper.props().style.width).to.equal(50);
    expect(wrapper.props().imageSrc).to.equal('https://facebook.github.io/react/img/logo_og.png');
    expect(wrapper.props().imageTitle).to.equal('altText');
    expect(wrapper.props().imageStyle.width).to.equal(100);
    expect(wrapper.props().text).to.equal('textContent');
    expect(wrapper.props().textStyle.width).to.equal(150);
    expect(wrapper.props().link).to.equal('http://www.uniqlo.com/jp/stylingbook/pc/style/7746');
    expect(wrapper.props().linkText).to.equal('Link Text');
    expect(wrapper.props().linkStyle.width).to.equal(200);
    expect(wrapper.props().targetwindow).to.equal('_blank');
    expect(wrapper.props().variation).to.equal('imageRight');
  });

  it('should check the Image component rendered', () => {
    const wrapper = testHelpers.mountWithStore(
      <ImagePlusText
        imageSrc="https://facebook.github.io/react/img/logo_og.png"
        link="http://www.uniqlo.com/jp/stylingbook/pc/style/7746"
        linkText="SHOP THE LOOK"
        targetwindow="_blank"
        text="sample Text"
        variation="imageTop"
      />
    );

    expect(wrapper.find('Image')).to.have.length(1);
  });

  it('should check the image source', () => {
    const render = TestUtils.renderIntoDocument(<ImagePlusText
      imageSrc="https://facebook.github.io/react/img/logo_og.png"
      variation="imageLeft"
    />
  );

    const ImagePlusTextDomNode = TestUtils.findRenderedDOMComponentWithTag(render, 'img');

    expect(ImagePlusTextDomNode.src).to.equal('https://facebook.github.io/react/img/logo_og.png');
  });

  it('should render image of ImagePlusText component', () => {
    const wrapper = testHelpers.mountWithStore(
      <ImagePlusText
        imageSrc="https://facebook.github.io/react/img/logo_og.png"
        link="http://www.uniqlo.com/jp/stylingbook/pc/style/7746"
        linkText="SHOP THE LOOK"
        targetwindow="_blank"
        text="sample Text"
        variation="imageBottom"
      />
    );

    expect(wrapper.find('img').props().src).to.equal('https://facebook.github.io/react/img/logo_og.png');
  });

  it('should check the anchor link', () => {
    const wrapper = testHelpers.mountWithStore(
      <ImagePlusText
        imageSrc="https://facebook.github.io/react/img/logo_og.png"
        link="http://www.uniqlo.com/jp/stylingbook/pc/style/7746"
        linkText="SHOP THE LOOK"
        targetwindow="_blank"
        text="Learn about the science behind the HEATTECH"
        variation="imageBottom"
      />
    );

    expect(wrapper.find('a').props().href).to.equal('http://www.uniqlo.com/jp/stylingbook/pc/style/7746');
  });

  it('should check the Text component rendered', () => {
    const wrapper = testHelpers.mountWithStore(
      <ImagePlusText
        imageSrc="https://facebook.github.io/react/img/logo_og.png"
        link="http://www.uniqlo.com/jp/stylingbook/pc/style/7746"
        linkText="SHOP THE LOOK"
        targetwindow="_blank"
        text="sample Text"
        variation="imageBottom"
      />
    );

    expect(wrapper.find('Text')).to.have.length(1);
  });

  it('should check the two caption render', () => {
    const wrapper = testHelpers.mountWithStore(
      <ImagePlusText
        imageSrc="https://facebook.github.io/react/img/logo_og.png"
        link="http://www.uniqlo.com/jp/stylingbook/pc/style/7746"
        linkText="SHOP THE LOOK"
        secondaryLink="http://www.uniqlo.com/jp/stylingbook/pc/style/7790"
        secondaryLinkText="SHOP"
        secondaryText="Learn about the science behind the HEATTECH"
        targetwindow="_blank"
        text="Learn about the science behind the HEATTECH"
        variation="twoCaption"
      />
    );

    expect(wrapper.find('Text')).to.have.length(2);
  });

  it('should check the singleMedia variations rendered header as expected', () => {
    const render = TestUtils.renderIntoDocument(<ImagePlusText
      header="sample header"
      imageSrc="https://facebook.github.io/react/img/logo_og.png"
      variation="singleMediaSquareImage"
    />
  );

    const renderedNode = ReactDOM.findDOMNode(render);

    expect(renderedNode.querySelectorAll('h1')[0].getAttribute('class')).to.contains('');
    expect(renderedNode.textContent).to.equal('sample header');
  });

  it('should check the singleMedia variations rendered subHeader as expected', () => {
    const render = TestUtils.renderIntoDocument(<ImagePlusText
      imageSrc="https://facebook.github.io/react/img/logo_og.png"
      subHeader="sample sub header"
      variation="singleMediaSquareImage"
    />
  );

    const renderedNode = ReactDOM.findDOMNode(render);

    expect(renderedNode.querySelectorAll('h1')[0].getAttribute('class')).to.contains('');
    expect(renderedNode.textContent).to.equal('sample sub header');
  });

  it('should check the largeProduct variations rendered header as expected', () => {
    const render = TestUtils.renderIntoDocument(<ImagePlusText
      header="sample header"
      imageSrc="https://facebook.github.io/react/img/logo_og.png"
      variation="largeProduct"
    />
  );

    const renderedNode = ReactDOM.findDOMNode(render);

    expect(renderedNode.textContent).to.equal('sample header');
  });

  it('should check the largeProductRectangular variations rendered subHeader as expected', () => {
    const render = TestUtils.renderIntoDocument(<ImagePlusText
      imageSrc="https://facebook.github.io/react/img/logo_og.png"
      subHeader="sample sub header"
      variation="largeProductRectangle"
    />
  );

    const renderedNode = ReactDOM.findDOMNode(render);

    expect(renderedNode.textContent.trim()).to.equal('sample sub header');
  });

  it('should check the largeProduct variations rendered priceText as expected', () => {
    const render = TestUtils.renderIntoDocument(<ImagePlusText
      imageSrc="https://facebook.github.io/react/img/logo_og.png"
      priceText="230"
      variation="largeProduct"
    />
  );

    const renderedNode = ReactDOM.findDOMNode(render);

    expect(renderedNode.textContent).to.equal('230');
  });
});
