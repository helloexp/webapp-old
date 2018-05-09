import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import CartItems from '../CartItems';

expect.extend(expectJSX);

describe('components/ShoppingBagSummary/CartItems', () => {
  const setup = (props) => {
    const renderer = createRenderer();

    renderer.render(<CartItems {...props} />, {
      i18n: {
        miniBag: {
          count: '点',
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
    });

    expect(component).toExist();
  });
});
