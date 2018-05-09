import React from 'react';
import { expect } from 'chai';
import GuProductRecommendationsTest from '../index';

const state = {
  silveregg: {
    items: [],
  },
};

function mountItem() {
  return testHelpers.mountWithAll(<GuProductRecommendationsTest />, state);
}

describe('GuProductRecommendations component', () => {
  it('should render GuProductRecommendations', () => {
    const wrapper = mountItem();

    expect(wrapper.length).to.equal(1);
  });

  it('should have Silveregg component', () => {
    const wrapper = mountItem();
    const Silveregg = wrapper.find('Silveregg');

    expect(Silveregg.length).to.equal(1);
  });
});
