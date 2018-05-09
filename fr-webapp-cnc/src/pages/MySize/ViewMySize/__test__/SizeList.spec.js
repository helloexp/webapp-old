import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import Button from 'components/Atoms/Button';
import Text from 'components/Atoms/Text';
import Accordion from 'components/uniqlo-ui/Accordion';
import SizeListTest from '../SizeList';

const state = {
  mySize: {
    sections: { about: 'ee' },
    sizes: [{ s: 's' }, {}],
    loaded: {},
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<SizeListTest />,
    state,
  );
}

describe('SizeList component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render SizeList', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading info', () => {
    const HeadingInfo = wrapper.find('HeadingInfo');

    expect(HeadingInfo.length).to.equal(1);
    expect(HeadingInfo.at(0).props().text).to.equal(i18n.mySize.viewMySizes);
  });

  it('should have Accordion', () => {
    const accordion = wrapper.find(Accordion);

    expect(accordion.length).to.equal(1);
  });

  it('should have Button ', () => {
    const button = wrapper.find(Button);

    expect(button.length).to.equal(2);
    expect(button.at(0).find(Text).props().children).to.equal(i18n.mySize.addNewUser);
    expect(button.at(1).props().children).to.equal(i18n.mySize.backToHome);
  });
});
