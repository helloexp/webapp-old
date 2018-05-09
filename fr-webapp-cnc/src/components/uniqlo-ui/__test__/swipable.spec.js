import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Swipable from '../core/Swipable';
import Image from '../Image';

describe('Swipable', () => {
  it('should render Swipable components as children.', () => {
    const swipableNode = mount(
      <Swipable>
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_67_163334" />
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_31_170527" />
      </Swipable>);

    expect(swipableNode.find(Image).length).to.be.equal(2);
  });

  it('should check the display property of Swipable.', () => {
    const swipableNode = TestUtils.renderIntoDocument(
      <Swipable display={2}>
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_67_163334" />
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_31_170527" />
      </Swipable>
    );

    expect(swipableNode.props.display).to.equal(2);
  });

  it('should render the Component items when cycle props passed true.', () => {
    const swipableNode = mount(
      <Swipable cycle display={2} style={{ width: '100px' }}>
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_67_163334" />
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_31_170527" />
      </Swipable>
    );

    expect(swipableNode.find(Image).length).to.be.equal(4);
    expect(swipableNode.prop('cycle')).to.equal(true);
  });
});
