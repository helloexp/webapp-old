import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import Button from 'components/uniqlo-ui/Button';
import Input from 'components/Atoms/Input';
import spacing from 'theme/spacing.scss';
import cx from 'classnames';
import styles from './styles.scss';

const { object, string, func, bool } = PropTypes;

export default class CouponForm extends PureComponent {
  static propTypes = {
    code: string,
    className: string,
    onAdd: func,
    onChange: func,
    valid: bool,
    isButtonDisabled: bool,
  };

  static defaultProps = {
    onChange: noop,
  };

  static contextTypes = {
    i18n: object,
    router: object,
  };

  onAdd = () => {
    const { code, onAdd } = this.props;

    onAdd(code);
  };

  setValue = (event) => {
    const { onChange } = this.props;

    onChange(event.target.value);
  };

  render() {
    const { code, isButtonDisabled, valid } = this.props;
    const { coupons } = this.context.i18n;

    return (
      <div className={cx(styles.wrapper, spacing.PVL)}>
        <Input
          className={cx(styles.input, spacing.MRL)}
          value={code}
          onChange={this.setValue}
          label={coupons.code}
          isValid={valid}
        />
        <Button
          className={cx('secondary', 'medium', styles.button, spacing.PHL)}
          label={coupons.apply}
          labelClass={styles.buttonLabel}
          onTouchTap={this.onAdd}
          disabled={isButtonDisabled}
          analyticsOn="Button Click"
          analyticsCategory="Checkout Funnel"
          analyticsLabel="Into Coupon Number"
          preventMultipleClicks
        />
      </div>
    );
  }
}
