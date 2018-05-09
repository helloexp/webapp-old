import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import Button from 'components/uniqlo-ui/Button';
import StoreDetails from 'pages/Checkout/components/StoreDetails';
import { getStorePickupDeliveryDescription, getStoreClosedstatus, getCurrentPickupStoreOfBrand } from 'redux/modules/checkout/delivery/selectors';
import noop from 'utils/noop';
import classNames from 'classnames';
import styles from './styles.scss';

const { object, string, func, bool } = PropTypes;

@connect(state => ({
  currentPickupStore: getCurrentPickupStoreOfBrand(state),
  isClosed: getStoreClosedstatus(state),
  deliveryLeadDate: getStorePickupDeliveryDescription(state),
}))
export default class CurrentStoreAddress extends PureComponent {

  static propTypes = {
    isClosed: bool,
    currentPickupStore: object,
    onSetLocationAccess: func,
    onRemoveCurrentStore: func,
    onSelectCurrentStore: func,
    deliveryLeadDate: string,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const {
      currentPickupStore,
      onSetLocationAccess,
      onRemoveCurrentStore,
      onSelectCurrentStore,
      deliveryLeadDate,
      isClosed,
    } = this.props;

    const confirmBtnClass = classNames('medium', {
      [styles.confirm]: !isClosed,
      [styles.disableConfirm]: isClosed,
    });

    return (
      <div className={styles.smallTopPadding}>
        <StoreDetails
          currentStore={currentPickupStore}
          deliveryLeadDate={deliveryLeadDate}
          isDeliveryStore
          onChoose={onSetLocationAccess}
          onRemove={onRemoveCurrentStore}
        />
        <Button
          className={confirmBtnClass}
          label={this.context.i18n.deliveryStore.confirm}
          onTouchTap={!isClosed && onSelectCurrentStore || noop}
          analyticsOn="Button Click"
          analyticsCategory="Checkout Funnel"
          analyticsLabel="UPDATE SHIPPING STORE"
        />
      </div>
    );
  }
}
