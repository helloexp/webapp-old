import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import CheckBox from 'components/uniqlo-ui/core/CheckBox';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import Drawer from 'components/Drawer';
import { onSetBillingAddress as onSetBillingAddressAction } from 'redux/modules/checkout/delivery';
import { getShouldSetBillingAddress } from 'redux/modules/checkout/delivery/selectors';
import styles from './styles.scss';

const { bool, object, func } = PropTypes;

@connect(state => ({
  shouldSetBillingAddress: getShouldSetBillingAddress(state),
}), {
  onSetBillingAddress: onSetBillingAddressAction,
})
export default class CheckBoxWithToolTip extends Component {
  static propTypes = {
    onSetBillingAddress: func,
    shouldSetBillingAddress: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  state = {
    isDrawerVisible: false,
  };

  infoButton = () => {
    this.setState({
      isDrawerVisible: !this.state.isDrawerVisible,
    });
  }

  render() {
    const {
      shouldSetBillingAddress,
      onSetBillingAddress,
    } = this.props;

    const { checkout } = this.context.i18n;

    return (
      <div className={styles.checkLockWrap}>
        <CheckBox
          checked={shouldSetBillingAddress}
          labelClass={styles.slimLabel}
          className={classNames('noLeftSpacing', 'spaCheckBox', styles.check)}
          id="ShippingAddressFormSetCheckbox"
          label={checkout.useBilling}
          onCheck={onSetBillingAddress}
        />
        <Button
          className={classNames('small', 'default', 'showOverflow', styles.infoIcon)}
          onTouchTap={this.infoButton}
        />
        <If if={this.state.isDrawerVisible}>
          <Drawer onCancel={this.infoButton} title={checkout.setDefaultAddressTitle} variation="noFooter">
            <Text>{checkout.setDefaultAddressDesc}</Text>
          </Drawer>
        </If>
      </div>
    );
  }
}
