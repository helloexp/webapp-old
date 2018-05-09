import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Panel from 'components/Panel';
import Text from 'components/uniqlo-ui/Text';
import { getCartPaymentType } from 'redux/modules/cart/selectors';
import { setPreviousLocation as setPreviousLocationAction, saveAndContinue, reloadDeliveryMethodOptions } from 'redux/modules/checkout/delivery';
import { redirect, getCurrentBrand, getUrlWithQueryData } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import styles from './styles.scss';

const { bool, object, string, func } = PropTypes;

@connect((state, props) => ({
  paymentType: getCartPaymentType(state, props),
  brand: getCurrentBrand(state),
}), {
  setPreviousLocation: setPreviousLocationAction,
  setPreferenceSelectView: saveAndContinue,
  reloadDeliveryOptions: reloadDeliveryMethodOptions,
})
export default class DeliveryPreferencePanel extends PureComponent {
  static propTypes = {
    paymentType: string,
    review: bool,
    reloadDeliveryOptions: func,
    setPreviousLocation: func,
    setPreferenceSelectView: func,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  onEdit = () => {
    const { review, setPreviousLocation, setPreferenceSelectView, reloadDeliveryOptions, paymentType, brand } = this.props;
    const onTapRedirectUrl = getUrlWithQueryData(routes.delivery, { brand });

    if (review) {
      setPreviousLocation();
    }

    if (paymentType) {
      reloadDeliveryOptions();
    }

    setPreferenceSelectView(true);
    redirect(onTapRedirectUrl);
  }

  render() {
    const { delivery } = this.context.i18n;

    return (
      <Panel
        className={classNames(styles.deliveryPreferenceWrap, styles.preferenceContainer)}
        frame
        editable
        onEdit={this.onEdit}
        title={delivery.deliveryPreferenceTitle}
        lighterBoxShadow
        headerStyle={styles.headerStyle}
      >
        <Text className="blockText">{delivery.splitDelivery}</Text>
      </Panel>
    );
  }
}
