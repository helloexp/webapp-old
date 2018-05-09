import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-ja';
import config from 'config/site/default';
import PostPayInfoModal from '../PostPayInfoModal';

const store = {
  payment: {
    paymentMethod: 'D',
  },
};

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<PostPayInfoModal {...props} />, store, config, i18n);
}

describe('src/pages/Checkout/Payment/PostPay/PostPayInfoModal', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render PostPayInfoModal component correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render Drawer component', () => {
    const drawer = wrapper.find('Drawer');

    expect(drawer.length).to.equal(1);
    expect(drawer.props().title).to.equal(i18n.postPay.infoHeading);
  });

  it('should render postPay instructions Text', () => {
    const postPayInstructions = wrapper.find('Text').at(0);

    expect(postPayInstructions.props().children).to.equal(i18n.postPay.instructions);
  });

  it('should render Heading', () => {
    const heading = wrapper.find('Heading').at(1);

    expect(heading.props().headingText).to.equal(i18n.postPay.pleaseNote);
  });

  it('should render postPay Fee Text', () => {
    const postPayInstructions = wrapper.find('Text').at(1);

    expect(postPayInstructions.props().children).to.equal(i18n.postPay.postPayFee);
  });

  it('should render postPay cvs warning Text for UQ', () => {
    wrapper = mountItem({ brand: 'uq' });
    const postPayInstructions = wrapper.find('Text').at(2);

    expect(postPayInstructions.props().children).to.equal(i18n.postPay.cvsWarning.uq);
  });

  it('should render postPay cvs warning Text for GU', () => {
    wrapper = mountItem({ brand: 'gu' });
    const postPayInstructions = wrapper.find('Text').at(2);

    expect(postPayInstructions.props().children).to.equal(i18n.postPay.cvsWarning.gu);
  });

  it('should render about postPay Text', () => {
    const postPayInstructions = wrapper.find('Text').at(3);

    expect(postPayInstructions.props().children).to.equal(i18n.postPay.aboutPostPay);
  });

  it('should render postPay instructions Text', () => {
    const postPayInstructions = wrapper.find('Text').at(4);

    expect(postPayInstructions.props().children).to.equal(i18n.postPay.postPayLimit);
  });

  it('should render about postPay Link component', () => {
    const postPayLink = wrapper.find('Link').first();

    expect(postPayLink.props().to).to.equal(config.aboutPostPay);
    expect(postPayLink.props().children[0]).to.equal(i18n.postPay.NPLinkText);
  });
});
