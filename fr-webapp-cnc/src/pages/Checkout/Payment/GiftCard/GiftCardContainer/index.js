import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { MATCH_COMMA_SPACE } from 'helpers/regex';
import If from 'components/uniqlo-ui/If';
import {
  isEditingValidGiftCard as isEditingValidGiftCardSelector,
  isEditingAppliedGiftCard as isEditingAppliedGiftCardSelector,
  getActiveCard as getActiveCardSelector,
  shouldShowContinueButton as shouldShowContinueButtonSelector,
 } from 'redux/modules/checkout/payment/giftCard/selectors';
import { setInputValue } from 'redux/modules/checkout/payment/giftCard/actions';
import { getCurrentBrand } from 'utils/routing';
import GiftCardForm from '../GiftCardForm';
import GiftCardInfo from '../GiftCardInfo';

const { bool, object, func, string } = PropTypes;

@connect(
  (state, props) => ({
    isEditingValidGiftCard: isEditingValidGiftCardSelector(state, props),
    isEditingAppliedGiftCard: isEditingAppliedGiftCardSelector(state, props),
    activeGiftCard: getActiveCardSelector(state, props),
    shouldShowContinueButton: shouldShowContinueButtonSelector(state, props),
    brand: getCurrentBrand(state),
  }), {
    setInputValue,
  }
)
export default class GiftCardContainer extends PureComponent {
  static propTypes = {
    // From selectors
    activeGiftCard: object,
    isEditingValidGiftCard: bool,
    isEditingAppliedGiftCard: bool,
    shouldShowContinueButton: bool,
    brand: string,

    // Actions from connect
    setInputValue: func,

    // From parent component
    giftCard: object,

    // Actions from parent component
    onRemove: func,
  };

  static contextTypes = {
    i18n: object,
  };

  onSetInputValue = (id, value) => {
    const stripPlaceholder = val => (val ? val.replace(MATCH_COMMA_SPACE, '') : '');

    this.props.setInputValue(id, stripPlaceholder(value));
  };

  render() {
    const {
      brand,
      giftCard,
      activeGiftCard,
      isEditingValidGiftCard,
      isEditingAppliedGiftCard,
      onRemove,
      shouldShowContinueButton,
    } = this.props;

    if (giftCard) {
      return (
        <GiftCardInfo
          {...{ giftCard, onRemove, shouldShowContinueButton, brand }}
          isEditingGiftCard={isEditingAppliedGiftCard}
          onChangeHandler={this.onSetInputValue}
        />
      );
    }

    return (
      <If
        if={isEditingValidGiftCard}
        then={GiftCardInfo}
        else={GiftCardForm}
        isEditingGiftCard={isEditingValidGiftCard}
        giftCard={activeGiftCard}
        onRemove={onRemove}
        onChangeHandler={this.onSetInputValue}
        brand={brand}
      />
    );
  }
}
