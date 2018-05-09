import React from 'react';
import { expect } from 'chai';
import Drawer from 'components/Drawer';
import i18n from 'i18n/strings-en';
import howToMeasure from 'pages/MySize/images/how-to-measure.png';
import HowToTest from '../HowTo';

const state = {
  mySize: {
    sections: { howTo: true },
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<HowToTest />, state);
}

describe('HowTo component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render HowTo', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Drawer', () => {
    const wrappers = testHelpers.mountWithAll(<HowToTest />, state);
    const drawer = wrappers.find(Drawer);

    expect(drawer.length).to.equal(1);
    expect(drawer.props().title).to.equal(i18n.mySize.measureHeading);
  });

  it('should have Image component', () => {
    const wrappers = testHelpers.mountWithAll(<HowToTest />, state);
    const Image = wrappers.find('Image');

    expect(Image.at(0).props().source).to.equal(howToMeasure);
  });
});
