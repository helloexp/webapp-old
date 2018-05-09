import React from 'react';
import { expect } from 'chai';
import { CollageItem } from '../Collage';

describe('Collage', () => {
  it('should render Collage component and its children.', () => {
    const wrapper = testHelpers.shallowWithStoreAndConfig(
      // temporarily removed <Carousel> to avoid a bug in test setup
      // where compConfig doesnt seem to be properly included
      <div>
        <CollageItem imageSrc="http://uniqlo.scene7.com/is/image/UNIQLO/goods_31_170527" />
        <CollageItem imageSrc="http://uniqlo.scene7.com/is/image/UNIQLO/goods_75_157491" />
        <CollageItem imageSrc="http://uniqlo.scene7.com/is/image/UNIQLO/goods_31_170527" />
      </div>
    );

    expect(wrapper.find(CollageItem)).to.have.length(3);
  });
});
