import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import MiniBag from '../index';

expect.extend(expectJSX);

describe('MiniBag', () => {
  const setup = (props) => {
    const renderer = createRenderer();

    renderer.render(<MiniBag {...props} />, {
      i18n: {
        miniBag: {
          message: 'Shipping threshold message',
        },
        common: {
          close: 'close',
        },
      },
    });

    const output = renderer.getRenderOutput();

    return { props, output, renderer };
  };

  it('should render correctly', () => {
    const component = setup({
      items: [
        { title: 'Testing 1', price: '¥ 1000' },
        { title: 'Testing 2', price: '¥ 1000' },
      ],
      totalAmount: '2000',
      totalItems: 2,
      minimumFreeShipping: 5000,
      totalMerchandise: 2000,
    });

    expect(component).toExist();
  });

  it('Button should render correctly', () => {
    const component = setup({
      items: [
        { title: 'Testing 1', price: '¥ 1000' },
        { title: 'Testing 2', price: '¥ 1000' },
      ],
      totalAmount: '2000',
      totalItems: 2,
      minimumFreeShipping: 5000,
      totalMerchandise: 2000,
    });

    expect(component.output).toIncludeJSX(`
       <Button
        className={undefined}
        label="close"
        labelClass={undefined}
        onMouseEnter={function noRefCheck() {}}
        onMouseLeave={function noRefCheck() {}}
        onTouchTap={function noRefCheck() {}}
       />
    `);
  });
});
