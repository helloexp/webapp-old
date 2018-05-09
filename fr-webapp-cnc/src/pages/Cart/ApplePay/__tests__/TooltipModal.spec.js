import React from 'react';
import TooltipModal from '../TooltipModal.js';

function mountItem(props = {}) {
  const context = { applePay: { applePayLinks: { uq: { terms: 'https://faq.uniqlo.com/articles/FAQ/terms' } } } };

  return testHelpers.mountWithAll(
    <WithContext context={context}>
      <TooltipModal {...props} />
    </WithContext>
  );
}

describe('pages/Cart/ApplePay/TooltipModal', () => {
  const wrapper = mountItem();

  it('should render properly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render all text', () => {
    expect(wrapper.find('Text').length).to.equal(16);
  });

  it('Link should have link to apple pay', () => {
    expect(wrapper.find({ href: 'https://www.apple.com/jp/apple-pay/' }).length).to.equal(1);
  });

  it('Drawer should have the className applePayDrawer', () => {
    expect(wrapper.find('Drawer').hasClass('applePayDrawer')).to.equal(true);
  });
});
