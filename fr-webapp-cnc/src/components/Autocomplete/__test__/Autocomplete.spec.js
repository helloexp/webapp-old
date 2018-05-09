import React from 'react';
import Autocomplete from '../../Autocomplete';

function mountItem(props = {}) {
  return testHelpers.mountWithAll(<Autocomplete {...props} />);
}

describe('components/Autocomplete', () => {
  const changeSpy = sinon.spy();
  const wrapper = mountItem({ onChange: changeSpy });

  it('should render correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should call callback when changing the input field', () => {
    wrapper.find('input').simulate('change');
    expect(changeSpy.calledOnce).to.equal(true);
  });

  it('should not render Text when there is no data', () => {
    wrapper.setState({ showList: false });
    expect(wrapper.find('Text').length).to.equal(0);
  });

  it('should render Text when there is data', () => {
    const textWrapper = mountItem({ selection: { labelField: 'location1' } });

    expect(textWrapper.find('Text').length).to.equal(0);
    textWrapper.setProps({ data: [{ labelField: 'location1' }] });
    expect(textWrapper.find('Text').length).to.equal(1);
  });

  it('Text rendering when no selection', () => {
    const textWrapper = mountItem({ selection: false, data: [{ labelField: 'location1' }] });

    expect(textWrapper.find('Text').length).to.equal(1);
  });

  it('should select Text on press', () => {
    const textWrapper = mountItem(
      {
        selection: { labelField: 'location1' },
        data: [{ labelField: 'location1' }],
        onPress: changeSpy,
        analyticsOn: true,
        analyticsLabel: 'location1',
        analyticsCategory: 'storeCategory',
      }
    );

    textWrapper.find('Text').first().simulate('click');
    expect(changeSpy.calledOnce).to.equal(true);
  });

  it('should track Event', () => {
    const textWrapper = mountItem({ selection: { labelField: 'location1' }, data: [{ labelField: 'location1' }], onPress: changeSpy, analyticsOn: false });

    textWrapper.find('Text').first().simulate('click');
    expect(changeSpy.calledOnce).to.equal(true);
  });
});
