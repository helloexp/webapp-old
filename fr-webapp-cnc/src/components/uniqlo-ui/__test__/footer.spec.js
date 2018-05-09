import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Footer from '../Footer';
import FooterItem from '../Footer/FooterItem';
import Heading from '../Heading';
import Text from '../Text';
import accordionItemStyles from '../Accordion/AccordionItem.scss';

describe('Footer', () => {
  it('check the number of children for Accordion component', () => {
    const wrapper = mount(
      <Footer >
        <FooterItem>
          <Heading headingText="section1" type="h3" />
          <Text>Content 1</Text>
        </FooterItem>
        <FooterItem>
          <Heading headingText="section2" type="h3" />
          <Text>Content 2</Text>
        </FooterItem>
      </Footer>);

    expect(wrapper.find(FooterItem).length).to.be.equal(2);
  });

  it('should check if the content is displaying', () => {
    const wrapper = mount(
      <Footer >
        <FooterItem
          expanded
          hideIcon="ActionPlus"
          showIcon="ActionMinus"
        >
          <Heading headingText="section2" type="h3" />
          <Text>Content 2</Text>
        </FooterItem>
      </Footer>
    );

    expect(wrapper.find(`.${accordionItemStyles.expanded}`).length).to.be.above(0);
  });

  it('check if the content display is prevented', () => {
    const wrapper = mount(
      <Footer>
        <FooterItem
          hideIcon="ActionPlus"
          showIcon="ActionMinus"
        >
          <Heading headingText="section2" type="h3" />
          <Text>Content 2</Text>
        </FooterItem>
      </Footer>
    );

    expect(wrapper.find(`.${accordionItemStyles.expanded}`).length).to.be.equal(1);
  });
});
