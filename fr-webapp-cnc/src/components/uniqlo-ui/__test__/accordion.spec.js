import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import { mount } from 'enzyme';
import Accordion from '../Accordion';
import AccordionItem from '../Accordion/AccordionItem';
import Heading from '../Heading';
import Text from '../Text';
import ImagePlusText from '../ImagePlusText';
import accordionItemStyles from '../Accordion/AccordionItem.scss';

describe('Accordion', () => {
  it('check the number of children for Accordion component', () => {
    const wrapper = mount(
      <Accordion expandMultiple>
        <AccordionItem
          hideIcon="ActionPlus"
          showIcon="ActionMinus"
        >
          <Heading headingText="section1" type="h3" />
          <Text>Content 1</Text>
        </AccordionItem>
        <AccordionItem
          expanded
          hideIcon="ActionPlus"
          showIcon="ActionMinus"
        >
          <Heading headingText="section2" type="h3" />
          <Text>Content 2</Text>
        </AccordionItem>
      </Accordion>);

    chai.expect(wrapper.find(AccordionItem).length).to.be.equal(2);
  });

  it('should check if the content is displaying', () => {
    const wrapper = mount(
      <Accordion expandMultiple>
        <AccordionItem
          expanded
          hideIcon="ActionPlus"
          showIcon="ActionMinus"
        >
          <Heading headingText="section2" type="h3" />
          <Text>Content 2</Text>
        </AccordionItem>
      </Accordion>
    );

    chai.expect(wrapper.find(`.${accordionItemStyles.expanded}`).length).to.be.above(0);
  });

  it('check the itemReferenceId', () => {
    const render = TestUtils.renderIntoDocument(
      <AccordionItem
        hideIcon="ActionPlus"
        itemReferenceId={1}
        showIcon="ActionMinus"
      >
        <Heading headingText="section2" type="h3" />
        <Text>Content 2</Text>
      </AccordionItem>);

    const accordion = ReactDOM.findDOMNode(render);

    chai.expect(accordion.id).to.equal('1');
  });

  it('check if image is rendered correctly', () => {
    const wrapper = testHelpers.mountWithStore(
      <Accordion id="accord">
        <AccordionItem
          expanded
          hideIcon="ActionPlus"
          showIcon="ActionMinus"
        >
          <ImagePlusText
            header="パーカ"
            headerClass="accordionHeader"
            imageSrc="https://facebook.github.io/react/img/logo_og.png"
            link="google.com"
            targetwindow="_blank"
            text="イネス ​コラボレーション ユニクロ　アンド ​ルメール"
            textClass="accordionText"
            variation="imageLeft"
          />
          <Heading headingText="section2" type="h3" />
          <Text>Content 2</Text>
        </AccordionItem>
      </Accordion>);

    chai.expect(wrapper.find('img').html()).to.have.string('https://facebook.github.io/react/img/logo_og.png');
  });

  it('should check the anchor link', () => {
    const wrapper = testHelpers.mountWithStore(
      <Accordion id="accord">
        <AccordionItem
          expanded
          hideIcon="ActionPlus"
          showIcon="ActionMinus"
        >
          <ImagePlusText
            header="パーカ"
            headerClass="accordionHeader"
            imageSrc="https://facebook.github.io/react/img/logo_og.png"
            link="https://google.com"
            targetwindow="_blank"
            text="イネス ​コラボレーション ユニクロ　アンド ​ルメール"
            textClass="accordionText"
            variation="imageLeft"
          />
          <Heading headingText="section2" type="h3" />
          <Text>Content 2</Text>
        </AccordionItem>
      </Accordion>
    );

    chai.expect(wrapper.find('ImagePlusText').html()).to.have.string('https://google.com');
  });
});
