import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import Filter from '../index';

describe('pages/Checkout/components/StoreSelector/Filters', () => {
  it('should render Filter', () => {
    const wrapper = testHelpers.shallowWithAll(<Filter />);

    expect(wrapper.length).to.equal(1);
  });

  it('should have heading', () => {
    const wrapper = testHelpers.shallowWithAll(<Filter />);
    const heading = wrapper.find('Heading');

    expect(heading.length).to.equal(1);
  });

  it('should have heading text', () => {
    const wrapper = testHelpers.shallowWithAll(<Filter total="%d" />);
    const heading = wrapper.find('Heading');

    expect(heading.props().headingText).to.equal(i18n.deliveryStore.results);
  });

  it('should have 2 buttons', () => {
    const wrapper = testHelpers.shallowWithAll(<Filter />);
    const button = wrapper.find('Button');

    expect(button.length).to.equal(2);
  });

  it('should call callback when clicking on filter button', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<Filter onToggleFilter={onButtonClick} />);
    const filterButton = wrapper.find('Button').last();

    filterButton.simulate('touchTap');
    expect(onButtonClick.called).to.equal(true);
  });
});
