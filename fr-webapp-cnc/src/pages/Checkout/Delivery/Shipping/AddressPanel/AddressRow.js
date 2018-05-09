import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import Button from 'components/Atoms/Button';
import styles from './styles.scss';

const { object, func } = PropTypes;

export default class AddressRow extends PureComponent {
  static propTypes = {
    editAddress: func,
    onRemoveAddress: func,
    onSetAsDefaultAddress: func,
    item: object,
  };

  static contextTypes = {
    i18n: object,
  };

  onSetAsDefaultAddressPress = () => {
    const { item } = this.props;

    if (!item.isDefaultShippingAddress) {
      this.props.onSetAsDefaultAddress(item);
    }
  };

  onEditAddressPress = () => {
    this.props.editAddress(this.props.item);
  };

  onRemoveAddressPress = () => {
    const { item } = this.props;

    this.props.onRemoveAddress(item.id, item.isDefaultShippingAddress);
  };

  render() {
    const { item, onRemoveAddress } = this.props;
    const { account } = this.context.i18n;
    const isRemoveAddressVisible = !!onRemoveAddress;
    const isDefault = item.isDefaultShippingAddress;

    return (
      <div className={styles.addressFooter}>
        <Button
          type={Button.type.flat}
          className={styles.footerBtn}
          onClick={this.onSetAsDefaultAddressPress}
        >
          <span className={isDefault ? styles.tickIcon : 'hidden'} />
          {isDefault ? account.selectedAddress : account.selectAddress}
        </Button>
        <Button
          type={Button.type.flat}
          className={classNames(styles.footerBtn, { [styles.oneFourth]: isRemoveAddressVisible })}
          onClick={this.onEditAddressPress}
        >
          { isRemoveAddressVisible ? account.editAddress : account.editMemberAddress }
        </Button>
        { isRemoveAddressVisible && (
          <Button
            type={Button.type.flat}
            className={classNames(styles.footerBtn, { [styles.oneFourth]: isRemoveAddressVisible })}
            onClick={this.onRemoveAddressPress}
          >
            <span className={styles.closeIcon} />
          </Button>)
        }
      </div>
    );
  }
}
