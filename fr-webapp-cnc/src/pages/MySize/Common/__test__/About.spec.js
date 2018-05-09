import React from 'react';
import { expect } from 'chai';
import Drawer from 'components/Drawer';
import i18n from 'i18n/strings-en';
import AboutTest from '../About';

const state = {
  mySize: {
    sections: { about: 'code' },
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<AboutTest />);
}

describe('About component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render About', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Drawer', () => {
    const wrappers = testHelpers.mountWithAll(<AboutTest />, state);
    const drawer = wrappers.find(Drawer);

    expect(drawer.props().title).to.equal(i18n.mySize.aboutHeading);
  });

  it('should have Text component with proper text', () => {
    const wrappers = testHelpers.mountWithAll(<AboutTest />, state);
    const Text = wrappers.find('Text');

    expect(Text.at(0).props().children).to.equal(i18n.mySize.aboutMySize.explanation);
  });

  it('should call callback when clicking on ', () => {
    const onButtonClick = sinon.spy();
    const wrappers = testHelpers.shallowWithAll(<AboutTest toggleSection={onButtonClick} />, state);
    const DrawerButton = wrappers.find(Drawer);

    DrawerButton.at(1).simulate('touchTap');
    expect(onButtonClick.called).to.equal(false);
  });
});
