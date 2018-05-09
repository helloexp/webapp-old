import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Dropdown, { DropdownItem } from '../core/Dropdown';

describe('Dropdown', () => {
  it('should render Dropdown components with dafault variation  when no props variation  passed', () => {
    const wrapper = mount(
      <Dropdown>
        <DropdownItem label="32 GOLD" value="32" />
        <DropdownItem label="22 LIGHT GREY" value="22" />
      </Dropdown>
    );

    const items = wrapper.find(DropdownItem);

    expect(items).to.have.length(3);
  });

  it('should render Dropdown components with selectInput variation  when no props variation  passed', () => {
    const wrapper = mount(
      <Dropdown>
        <DropdownItem label="32 GOLD" value="32" />
        <DropdownItem label="22 LIGHT GREY" value="22" />
      </Dropdown>
    );

    const items = wrapper.find(DropdownItem);

    expect(items).to.have.length(3);
  });

  it('should render Dropdown components with bottomBordered variation  when variation  passed', () => {
    const wrapper = mount(
      <Dropdown variation="bottomBordered">
        <DropdownItem label="32 GOLD" value="32" />
        <DropdownItem label="22 LIGHT GREY" value="22" />
      </Dropdown>
    );

    const items = wrapper.find(DropdownItem);

    expect(items).to.have.length(3);
  });

  it('should render Dropdown components with colorSelect variation  when variation  passed', () => {
    const wrapper = mount(
      <Dropdown variation="colorSelect">
        <DropdownItem label="32 GOLD" value="32" />
        <DropdownItem label="22 LIGHT GREY" value="22" />
      </Dropdown>
    );

    const items = wrapper.find(DropdownItem);

    expect(items).to.have.length(3);
  });
});
