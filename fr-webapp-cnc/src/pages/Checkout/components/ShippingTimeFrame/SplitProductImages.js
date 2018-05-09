import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isSplitDeliverySelected } from 'redux/modules/checkout/delivery/selectors';
import Panel from 'components/Panel';
import ProductImages from 'components/ProductImages';
import { getCartItems } from './selectors';
import styles from './styles.scss';

const { string, bool, object, array } = PropTypes;

@connect((state, props) => ({
  cartItems: getCartItems(state, props),
  isSplitDeliveryApplied: isSplitDeliverySelected(state),
}))
export default class SplitProductImages extends PureComponent {
  static propTypes = {
    splitNo: string,
    isSplitDeliveryApplied: bool,
    cartItems: array,
    review: bool,
    isLastItem: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { props: { isSplitDeliveryApplied, splitNo, cartItems, review, isLastItem }, context: { i18n: { delivery } } } = this;
    const heading = isSplitDeliveryApplied && `${delivery.shipment} ${splitNo}`;

    return (
      <Panel
        className={classNames(
          { [styles.container]: isSplitDeliveryApplied },
          { [styles.noBottomSpacing]: isLastItem })
        }
        title={heading}
        headerStyle={styles.splitHeading}
      >
        <ProductImages dataArray={cartItems} editable showCount review={review} />
      </Panel>
    );
  }
}
