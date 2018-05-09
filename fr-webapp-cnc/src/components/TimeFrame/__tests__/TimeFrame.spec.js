import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import Timeframe from '../index';

expect.extend(expectJSX);

describe('components/Timeframe', () => {
  const setup = (props) => {
    const renderer = createRenderer();

    renderer.render(<Timeframe {...props} />, {
      i18n: {
        common: {
          timeframe: 'Time Frame',
        },
        checkout: {
          free: 'Free',
        },
        orderConfirmation: {
          shippingMethod: 'Shipping Method',
        },
      },
    });

    const output = renderer.getRenderOutput();

    return { props, output, renderer };
  };

  it('should render correctly', () => {
    const component = setup({
      routing: { location: { query: { brand: 'uq' } } },
    });

    expect(component).toExist();
  });

  it('should render the contents', () => {
    const component = setup({
      arrivalDate: '2016/12/22',
      timeFrameMessage: 'Standard delivery 3-5 days',
      shippingPrice: '20',
      titleStyle: 'titleStyle',
      priceClass: 'priceClass',
      routing: { location: { query: { brand: 'uq' } } },
    });

    expect(component.output).toIncludeJSX(
      `<Container className="pickerContainer">
        <Text className="inlineBlockText"> Standard delivery 3-5 days </Text>
        <Container className={undefined}>
          <span className={undefined}> | </span>
          20
        </Container>
        <Text className="blockText"> 2016/12/22 </Text>
       </Container>`
    );
  });
});
