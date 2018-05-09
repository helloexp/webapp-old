import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { isSplitDeliverySelected as checkIfSplitDeliverySelected, getSplitCount } from 'redux/modules/checkout/delivery/selectors';
import ShippingPreference from './ShippingPreference.js';

const { func, bool, number } = PropTypes;

@connect(
  state => ({
    isSplitDeliverySelected: checkIfSplitDeliverySelected(state),
    splitCount: getSplitCount(state),
  })
)
export default class ShippingPreferenceWrapper extends PureComponent {
  static propTypes = {
    isSplitDeliverySelected: bool,
    onToggleDateTimeModal: func,
    onToggleNextDateModal: func,
    splitCount: number,
  };

  componentWillMount() {
    this.shipmentList = this.makeShipments(this.props.splitCount);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.splitCount !== nextProps.splitCount) {
      this.shipmentList = this.makeShipments(nextProps.splitCount);
    }
  }

  makeShipments = (splitCount) => {
    const { onToggleDateTimeModal, onToggleNextDateModal } = this.props;
    const shippingPreferences = [];

    for (let i = 1; i <= splitCount; i++) {
      shippingPreferences.push(
        <ShippingPreference
          onToggleDateTimeModal={onToggleDateTimeModal}
          onToggleNextDateModal={onToggleNextDateModal}
          splitNo={i.toString()}
          key={i}
        />
      );
    }

    return shippingPreferences;
  };

  render() {
    const { isSplitDeliverySelected, onToggleDateTimeModal, onToggleNextDateModal } = this.props;

    if (isSplitDeliverySelected) {
      return <div>{this.shipmentList}</div>;
    }

    return <ShippingPreference onToggleDateTimeModal={onToggleDateTimeModal} onToggleNextDateModal={onToggleNextDateModal} />;
  }
}
