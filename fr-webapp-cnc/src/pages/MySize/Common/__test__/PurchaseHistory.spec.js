import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import AtomLink from 'components/Atoms/Link';
import PurchaseHistoryTest from '../PurchaseHistory';

const state = {
  purchaseHistory: {
    purchaseHistoryList: [
      {
        image: {
          family: {},
        },
      },
    ],
  },
  brand: 'uq',
};
const mySizeLabels = { productSize: 's' };

function mountItem() {
  return testHelpers.mountWithAll(<PurchaseHistoryTest />, state);
}

describe('PurchaseHistory component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render PurchaseHistory', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have ItemText', () => {
    const wrappers = testHelpers.mountWithAll(<PurchaseHistoryTest mySizeLabels={mySizeLabels} />, state);
    const ItemText = wrappers.find('ItemText');

    expect(ItemText.length).to.equal(1);
  });

  it('should have Carousel', () => {
    const Carousel = wrapper.find('Carousel');

    expect(Carousel.length).to.equal(1);
  });

  it('should have AtomLink', () => {
    const atomLink = wrapper.find(AtomLink);

    expect(atomLink.length).to.equal(1);
    expect(atomLink.find('Text').first().props().children).to.equal(i18n.mySize.showMore);
  });
});
