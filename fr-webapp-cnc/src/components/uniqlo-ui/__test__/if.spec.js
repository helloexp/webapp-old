import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import If from '../If';

const truthy = true;
const falsy = false;

describe('If', () => {
  it('check that If renders div if no other component specified', () => {
    const wrapper = mount(<If if={truthy}>Hello</If>);

    expect(wrapper.find('div').length).to.be.equal(1);
  });

  it('check that If renders span if no other component specified', () => {
    const wrapper = mount(<If if={truthy} then="span">Hello</If>);

    expect(wrapper.find('span').length).to.be.equal(1);
  });

  it('check that If renders anchor if condition false', () => {
    const wrapper = mount(<If else="a" if={falsy} then="span">Hello</If>);

    expect(wrapper.find('a').length).to.be.equal(1);
  });

  it('check that If passes props', () => {
    const wrapper = mount(<If className="foo" if={truthy} then="span">Hello</If>);

    expect(wrapper.find('.foo').length).to.be.equal(1);
  });

  it('check that If passes props to else component', () => {
    const wrapper = mount(<If className="bar" else="a" if={falsy} then="span">Hello</If>);

    expect(wrapper.find('.bar').length).to.be.equal(1);
  });
});
