import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FilmStrip from '../FilmStrip';
import FilmStripItem from '../FilmStrip/FilmStripItem';

describe('FilmStrip', () => {
  it('should render Collage component and its children.', () => {
    const wrapper = shallow(
      <FilmStrip>
        <FilmStripItem
          imageSource="http://uniqlo.scene7.com/is/image/UNIQLO/usgoods_07_168542003"
          link="http://www.uniqlo.com/jp/stylingbook/pc/style/7746"
        />
        <FilmStripItem
          imageSource="http://uniqlo.scene7.com/is/image/UNIQLO/usgoods_07_168542003"
          link="http://www.uniqlo.com/jp/stylingbook/pc/style/7746"
        />
      </FilmStrip>
    );

    expect(wrapper.find(FilmStripItem)).to.have.length(2);
  });
});
