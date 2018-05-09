import React, { PureComponent, PropTypes } from 'react';
import Tooltip from 'components/Atoms/Tooltip';
import Input from 'components/Atoms/Input';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import cx from 'classnames';
import { formatPrice } from 'utils/format';
import spacing from 'theme/spacing.scss';
import styles from '../styles.scss';

const { bool, func, string, object } = PropTypes;

export default class AmountInput extends PureComponent {

  static propTypes = {
    isValidAmount: bool,
    showCharError: bool,
    onChange: func,
    required: string,
    value: string,
  }

  static contextTypes = {
    i18n: object,
  }

  state = {
    amountFocused: true,
  };

  onAmountFocus = () => {
    this.setState({ amountFocused: true });
  };

  onAmountBlur = () => {
    this.setState({ amountFocused: false });
  };

  render() {
    const { payWithGiftCard, common: { validation, currencySymbol } } = this.context.i18n;
    const { showCharError, value, isValidAmount, required, onChange } = this.props;
    const errorMessage = showCharError ? validation.singleByteNumber : payWithGiftCard.invalidAmountError;
    const priceInput = this.state.amountFocused ? `${currencySymbol}${value}` : formatPrice(value, false);

    return (
      <label className={cx(styles.inputGroup, spacing.MBL)}>
        <If if={!isValidAmount || showCharError} then={Tooltip} type="error">{errorMessage}</If>
        <div className={styles.requiredWrapper}>
          <Text className={styles.required}>{required}</Text>
        </div>
        <Input
          type="tel"
          label={payWithGiftCard.enterAmount}
          id="payment"
          onChange={onChange}
          onFocus={this.onAmountFocus}
          onBlur={this.onAmountBlur}
          value={priceInput}
          required
        />
      </label>
    );
  }
}
