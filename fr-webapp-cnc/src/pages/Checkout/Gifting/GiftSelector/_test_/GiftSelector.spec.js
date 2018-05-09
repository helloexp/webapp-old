import React from 'react';
import { expect } from 'chai';
import BoxSelector from 'components/BoxSelector';
import Image from 'components/uniqlo-ui/Image';
import GiftSelector from '../index';
import MessageEditor from '../MessageEditor';

const renderProps = {
  checked: true,
  name: 'card',
};

function mountItem() {
  return testHelpers.mountWithAll(<GiftSelector />);
}

describe('GiftSelector component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render GiftSelector', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have BoxSelector', () => {
    const boxSelector = wrapper.find(BoxSelector);

    expect(boxSelector.length).to.equal(1);
  });

  it('should render MessageEditor when GiftSelector name is card and is checked', () => {
    const wrappers = testHelpers.mountWithAll(<GiftSelector {...renderProps} />);

    expect(wrappers.find(MessageEditor).length).to.equal(1);
  });

  it('should render Image when passed as prop', () => {
    const wrappers = testHelpers.mountWithAll(<GiftSelector image="images/gift-box.png" />);

    expect(wrappers.find(Image).length).to.equal(1);
  });
});
