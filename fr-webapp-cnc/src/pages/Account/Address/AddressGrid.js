import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import Button from 'components/Atoms/Button';
import cx from 'classnames';

import styles from './styles.scss';

const { object, func, bool } = PropTypes;

export default class AddressGrid extends PureComponent {
  static propTypes = {
    item: object,
    account: object,
    editAddress: func,
    onSelect: func,
    onRemove: func,
    isDefault: bool,
  };

  static defaultProps = {
    isDefault: false,
    onRemove: noop,
  };

  selectItem = () => {
    this.props.onSelect(this.props.item.id);
  };

  editAddress = () => {
    this.props.editAddress(this.props.item, this.props.isDefault);
  };

  removeAddress = () => {
    this.props.onRemove(this.props.item.id);
  };

  render() {
    const { item, account, isDefault } = this.props;

    return (
      <div className={styles.buttons}>
        <Button type={Button.type.flat} className={styles.button} onClick={this.selectItem}>
          <span className={item.isDefaultShippingAddress ? styles.tickIcon : 'hidden'} />
          {item.isDefaultShippingAddress ? account.selectedAddress : account.selectAddress}
        </Button>
        <Button type={Button.type.flat} className={cx(styles.button, { [styles.oneFourth]: !isDefault })} onClick={this.editAddress}>
          { isDefault ? account.editMemberAddress : account.editAddress }
        </Button>
        { !isDefault && (
          <Button type={Button.type.flat} className={cx(styles.button, { [styles.oneFourth]: !isDefault })} onClick={this.removeAddress}>
            <span className={styles.closeIcon} />
          </Button>)
        }
      </div>
    );
  }
}
