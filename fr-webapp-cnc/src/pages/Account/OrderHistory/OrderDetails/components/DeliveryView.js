import React, { PureComponent, PropTypes } from 'react';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import AddressPanel from 'components/AddressPanel';
import { mapDeliveryAddress } from 'redux/modules/checkout/mappings/deliveryMappings';
import { truncate } from 'utils/format';
import { getTitleAndVariation } from '../../utils';

const { object, bool } = PropTypes;

export default class DeliveryView extends PureComponent {
  static propTypes = {
    deliveryDetails: object,
    storeDetail: object,
    storeDetailsAvailable: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { deliveryDetails, storeDetail, storeDetailsAvailable } = this.props;
    const { deliveryStore, orderHistory } = this.context.i18n;
    const { title, variation } = getTitleAndVariation(deliveryDetails.delv_type, orderHistory);
    const shippingAddress = mapDeliveryAddress(deliveryDetails);

    return (
      <div>
        <AddressPanel title={title} {...shippingAddress} fromOrderDetails variation={variation} />
        <If if={storeDetailsAvailable} >
          <Text className="blockText">{deliveryStore.weekDayOpen} {`${truncate(storeDetail.weekDayOpen)}AM～${truncate(storeDetail.weekDayClose)}PM`}</Text>
          <Text className="blockText">{deliveryStore.holidaysOpen} {`${truncate(storeDetail.weekendOpen)}AM～${truncate(storeDetail.weekendClose)}PM`}</Text>
        </If>
      </div>
    );
  }
}
