import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import RegularInput from 'components/Atoms/Input';
import Input from 'components/Atoms/field/Numeric';
import CreateMySizeTest from '../index';

function mountItem() {
  return testHelpers.mountWithAll(<CreateMySizeTest />);
}

describe('CreateMySize component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountItem();
  });

  it('should render CreateMySize', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should have Heading info', () => {
    const HeadingInfo = wrapper.find('HeadingInfo');

    expect(HeadingInfo.length).to.equal(4);
    expect(HeadingInfo.at(0).props().text).to.equal(i18n.mySize.heading);
  });

  it('should have InfoToolTip', () => {
    const InfoToolTip = wrapper.find('InfoToolTip');

    expect(InfoToolTip.length).to.equal(1);
    expect(InfoToolTip.find('Link').at(0).props().children).to.equal(i18n.mySize.aboutMySize.howToMeasureLinkLabel);
  });

  it('should have RegularInput ', () => {
    const regularInput = wrapper.find(RegularInput);

    expect(regularInput.length).to.equal(16);
    expect(regularInput.at(0).props().placeholder).to.equal(i18n.mySize.nameHint);
  });

  it('should have Link label ', () => {
    const Links = wrapper.find('Link');

    expect(Links.length).to.equal(5);
    expect(Links.at(1).props().children).to.equal(i18n.mySize.howToMeasure);
  });

  it('should have InputGroup with label ', () => {
    const InputGroup = wrapper.find('InputGroup');

    expect(InputGroup.length).to.equal(7);
    expect(InputGroup.find(Input).at(0).props().label).to.equal(i18n.mySize.heightHint);
  });
  it('should have button disabled initially', () => {
    const onButtonClick = sinon.spy();
    const button = wrapper.find('Button');

    expect(button.length).to.equal(1);
    button.last().simulate('click');
    expect(onButtonClick.called).to.equal(false);
  });
});
