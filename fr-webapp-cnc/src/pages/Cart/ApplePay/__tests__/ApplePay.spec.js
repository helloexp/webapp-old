import React from 'react';
import i18n from 'i18n/strings-en';
import ApplePay from '../../ApplePay';

function mountItem(props = {}) {
  const context = { applePay: { applePayLinks: { uq: { terms: 'https://faq.uniqlo.com/articles/FAQ/terms' } } } };

  return testHelpers.mountWithAll(
    <WithContext context={context}>
      <ApplePay {...props} />
    </WithContext>
  );
}

describe('pages/Cart/ApplePay', () => {
  const wrapper = mountItem({ brand: 'uq' });

  it('should render correctly', () => {
    expect(wrapper.length).to.equal(1);
  });

  it('should render buttons correctly', () => {
    expect(wrapper.find('Button').length).to.equal(3);
  });

  it('if gift card is applied, should display a message saying that apple pay is not applicable for gift card payment', () => {
    const wrapperWithoutGiftCard = mountItem({ brand: 'uq', isGiftCardPayment: false });

    expect(wrapperWithoutGiftCard.find('Text').length).to.equal(2);
    const wrapperWithGiftCard = mountItem({ brand: 'uq', isGiftCardPayment: true });

    expect(wrapperWithGiftCard.find('Text').length).to.equal(3);
  });

  it('should display text messages correctly', () => {
    expect(wrapper.find('Text').at(0).props().children).to.equal(i18n.applePay.aboutApplePay);
    expect(wrapper.find('Text').at(1).props().content).to.equal(i18n.cart.applePayFAQMessage);
  });
});
