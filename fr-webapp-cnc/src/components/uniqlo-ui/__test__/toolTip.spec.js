import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ToolTip from '../ToolTip';
import Image from '../Image';
import Text from '../Text';
import ToolTipStyles from '../ToolTip/Tooltip.scss';

describe('ToolTip', () => {
  it('Test if the trigger image url passed is correct', () => {
    const triggerImageUrl = 'https://facebook.github.io/react/img/logo_og.png';
    const wrapper = mount(
      <ToolTip
        heading="HEADING TEXT"
        triggerImage={triggerImageUrl}
      >
        <Text style={{ cursor: 'pointer' }}>Text1</Text>
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_31_170527" />
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_75_157491" />
        <Text style={{ cursor: 'pointer' }}>Text2</Text>
      </ToolTip>
    );

    expect(wrapper.find(ToolTip).props().triggerImage).to.be.equal(triggerImageUrl);
    expect(wrapper.find(ToolTip).props().heading).to.be.equal('HEADING TEXT');
  });

  it('Test if the class for trigger image is right', () => {
    const triggerImageUrl = 'https://facebook.github.io/react/img/logo_og.png';
    const wrapper = mount(
      <ToolTip
        heading="HEADING TEXT"
        triggerImage={triggerImageUrl}
      >
        <Text style={{ cursor: 'pointer' }}>Text1</Text>
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_75_157491" />
        <Text style={{ cursor: 'pointer' }}>Text2</Text>
      </ToolTip>
    );

    expect(wrapper.find(`img.${ToolTipStyles.triggerElement}`).length).to.be.equal(0);
  });

  it('Test if the classes applied to the image is correct', () => {
    const render = TestUtils.renderIntoDocument(
      <ToolTip
        heading="HEADING TEXT"
        triggerImage="http://uniqlo.scene7.com/is/image/UNIQLO/goods_75_157491"
      >
        <Text style={{ cursor: 'pointer' }}>Text1</Text>
        <Image source="http://uniqlo.scene7.com/is/image/UNIQLO/goods_75_157491" />
        <Text style={{ cursor: 'pointer' }}>Text2</Text>
      </ToolTip>);

    const toolTipElement = ReactDOM.findDOMNode(render);

    TestUtils.Simulate.click(toolTipElement);

    const imageContainerElement = TestUtils.scryRenderedDOMComponentsWithClass(render, 'triggerElement');

    expect(imageContainerElement.length).to.equal(0);
  });
});
