import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import Item from '../index';

expect.extend(expectJSX);

describe('components/OrderSummary/Item', () => {
  const setup = (props) => {
    const renderer = createRenderer();

    renderer.render(<Item {...props} />, {
      i18n: {
        cart: {
          items: 'Items',
        },
        common: {
          currencySymbol: '¥',
        },
      },
    });

    const output = renderer.getRenderOutput();

    return { props, output, renderer };
  };

  it('should render correctly', () => {
    const component = setup({
      description: '商品合計',
      price: '¥ 1000',
      descriptionClass: 'description',
      priceClass: 'price',
    });

    expect(component).toExist();
  });

  it('should render the formatted number', () => {
    const component = setup({
      description: '商品合計',
      price: '¥ 1234567',
      descriptionClass: 'description',
      priceClass: 'price',
    });

    expect(component.output).toIncludeJSX('¥ 1,234,567');
  });
});
