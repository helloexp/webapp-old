import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import Confirmation from '../index';

const name = 'ユニクロ プランタン銀座店【※女性専門店】';
const defaultProps = {
  store: {
    id: 10101452,
    name: 'ユニクロ プランタン銀座店【※女性専門店】',
    lat: '35.67375821',
    long: '139.7650688',
    distance: '0.289',
    city: 'tokyo',
    municipality: 'tokyo',
    number: 123456789,
    weekDayOpen: '20:00:00',
    weekDayClose: '10:00:00',
  },
  isPaymentStore: true,
};

function mountItem() {
  const renderProps = { ...defaultProps };

  return testHelpers.mountWithAll(<Confirmation {...renderProps} />);
}

describe('Confirmation component', () => {
  it('should render Confirmation', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should display Heading', () => {
    const wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading).to.be.visible; // eslint-disable-line
  });

  it('should display Heading text', () => {
    const wrapper = mountItem();
    const heading = wrapper.find('Heading');

    expect(heading.props().headingText).to.equal(name);
  });

  it('should display Text', () => {
    const wrapper = mountItem();
    const text = wrapper.find('Text');

    expect(text).to.be.visible; // eslint-disable-line
  });

  it('should display Button', () => {
    const wrapper = mountItem();
    const button = wrapper.find('Button');

    expect(button).to.be.visible; // eslint-disable-line
  });

  it('should have label on cancel button ', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<Confirmation {...defaultProps} selectStore={onButtonClick} />);
    const cancelButton = wrapper.find('Button').first();

    expect(cancelButton.props().label).to.equal(i18n.delivery.rejectLabel);
  });

  it('should call callback when clicking on cancel button ', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<Confirmation {...defaultProps} selectStore={onButtonClick} />);
    const cancelButton = wrapper.find('Button').first();

    cancelButton.simulate('touchTap');
    expect(onButtonClick.called).to.equal(true);
  });

  it('should have label on accept button', () => {
    const onButtonClick = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<Confirmation {...defaultProps} setPickupStore={onButtonClick} />);
    const acceptButton = wrapper.find('Button').last();

    expect(acceptButton.props().label).to.equal(i18n.deliveryStore.accept);
  });

  it('should call callback when clicking on accept and cancel buttons ', () => {
    const onAcceptSpy = sinon.spy();
    const onCancelSpy = sinon.spy();
    const wrapper = testHelpers.shallowWithAll(<Confirmation {...defaultProps} setPickupStore={onAcceptSpy} selectStore={onCancelSpy} />);
    const cancelButton = wrapper.find('Button').first();
    const acceptButton = wrapper.find('Button').last();

    cancelButton.simulate('touchTap');
    acceptButton.simulate('touchTap');
    expect(onCancelSpy.callCount).to.equal(1);
    expect(onAcceptSpy.callCount).to.equal(1);
  });
});
