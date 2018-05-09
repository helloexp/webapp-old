import React from 'react';
import expect from 'expect';
import expectJSX from 'expect-jsx';
import { shallow } from 'enzyme';
import Ticker from '../index';

expect.extend(expectJSX);

const i18n = require('../../../i18n/strings-ja');

const config = {
  applePay: {
    browserFlag: {
      uq: 'browser_flg=1',
      gu: 'open_target_ios=browser',
    },
  },
};

describe('Ticker', () => {
  function getPromoMessages() {
    return [
      { type: 'shipping' },
      { text: 'ご注文内容や配送について', url: 'asfasfasf' },
      { text: '指定先住所のお届け先' },
      { text: 'ご注文内容や配送について', url: 'asfasfasf' },
      { text: '指定先住所のお届け先', type: 'alert' },
      { text: 'ご注文内容や配送について', type: 'alert' },
      { type: 'shipping' },
      { text: 'ご注文内容や配送について' },
      { text: '指定先住所のお届け先' },
      { text: 'ご注文内容や配送について' },
    ];
  }

  const setup = (props) => {
    const wrapper = shallow(<Ticker {...props} />, {
      context: {
        i18n,
        config,
      },
    });

    return { props, wrapper };
  };

  it('should render correctly', () => {
    const component = setup({ messages: getPromoMessages(), total: 10000, minimum: 50000 });

    return expect(component).toExist();
  });
});
