import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import Panel from '../index';

expect.extend(expectJSX);

describe('components/Panel', () => {
  const setup = (props) => {
    const renderer = createRenderer();

    renderer.render(<Panel {...props} />, {
      i18n: {
        common: {},
      },
    });

    const output = renderer.getRenderOutput();

    return { props, output, renderer };
  };

  it('should render correctly', () => {
    const component = setup({ title: 'Testing title' });

    return expect(component).toExist();
  });

  it('should render the title', () => {
    const component = setup({ title: 'Testing title' });

    expect(component.output).toIncludeJSX('<Heading className="subHeader" headingText="Testing title" onPress={function noRefCheck() {}} type="h6" />');
  });

  it('should render the title centered', () => {
    const component = setup({
      title: 'Testing title',
      centerTitle: true,
      confirm: true,
    });

    expect(component.output).toIncludeJSX(`
      <Heading className="subHeader" headingText="Testing title" onPress={function noRefCheck() {}} type="h6" />
    `);
  });
});
