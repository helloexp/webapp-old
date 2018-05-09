import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Heading from 'components/uniqlo-ui/Heading';
import Text from 'components/uniqlo-ui/Text';
import MessageBox from '../index';

describe('components/MessageBox', () => {
  it('should render the title', () => {
    const wrapper = mount(<MessageBox title="This is the title" />);
    const heading = wrapper.find(Heading);

    expect(heading).to.have.length(1);
    expect(heading.text()).to.equal('This is the title');
  });

  it('should render the message', () => {
    const wrapper = mount(<MessageBox message="Are you sure you want to do that?" />);
    const message = wrapper.findWhere(n =>
        n.type() === Text && n.text() === 'Are you sure you want to do that?');

    expect(message).to.have.length(1);
  });
});
