import React from 'react';
import HeadingInfo from '../index';
import InfoToolTip from '../../../../components/InfoToolTip';

function mountItem(props = {}) {
  const renderProps = { ...props };

  return testHelpers.mountWithAll(<HeadingInfo {...renderProps} text="Heading" />);
}

describe('Headinginfo component', () => {
  let wrapper;

  it('should render Headinginfo component', () => {
    wrapper = mountItem();
    const text = wrapper.find('Text');

    expect(text.length).to.equal(1);
    expect(text.props().children).to.equal('Heading');
  });

  it('should render Link component', () => {
    wrapper = mountItem({ infoToolTip: null, iconNavigation: 'link' });
    const link = wrapper.find('a');

    expect(link.length).to.equal(1);
  });

  it('should render nav icon', () => {
    wrapper = mountItem({ infoToolTip: null, iconNavigation: () => {} });
    const Icon = wrapper.find('span');

    expect(Icon.length).to.equal(1);
  });

  it('should render InfoToolTip', () => {
    wrapper = mountItem({ infoToolTip: <InfoToolTip /> });
    const Icon = wrapper.find('InfoToolTip');

    expect(Icon.length).to.equal(1);
  });
});
