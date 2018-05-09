import React from 'react';
import { expect } from 'chai';
import i18n from 'i18n/strings-en';
import Gift from '../index';

const defaultProps = {
  selected: false,
  gift: {
    amount: '¥150',
    image: 'https://im.testdm2.jp/images/jp/pc/img/material/giftbag_05_s_JP.jpg',
    title: 'ユニクロ箱',
  },
};

let giftWrapper;

function setup(props = {}) {
  const renderProps = { ...defaultProps, ...props };

  return testHelpers.mountWithAll(<Gift {...renderProps} />, i18n);
}
describe('src/pages/Cart/Gift', () => {
  describe('Default gift state', () => {
    beforeEach(() => {
      giftWrapper = setup();
    });
    it('should render cart gift component correctly', () => {
      expect(giftWrapper.length).to.equal(1);
    });

    it('Checkbox should not be selected', () => {
      const checkbox = giftWrapper.find('CheckBox');

      expect(checkbox.props().checked).to.equal(false);
    });

    it('should render info icon', () => {
      const infoToolTip = giftWrapper.find('InfoToolTip');

      expect(infoToolTip.length).to.equal(1);
    });

    it('should render gift image', () => {
      const infoToolTip = giftWrapper.find('InfoToolTip');

      infoToolTip.simulate('click');
      const image = infoToolTip.find('InfoToolTip');

      expect(image.length).to.equal(1);
    });
  });
  describe('Default gift selectedstate', () => {
    beforeEach(() => {
      giftWrapper = setup({ selected: true });
    });
    it('Checkbox should be selected', () => {
      const checkbox = giftWrapper.find('CheckBox');

      expect(checkbox.props().checked).to.equal(true);
    });
  });
});
