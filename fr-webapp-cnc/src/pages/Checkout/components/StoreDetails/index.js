import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import Button from 'components/uniqlo-ui/Button';
import noop from 'utils/noop';
import classNames from 'classnames';
import styles from './styles.scss';

const { bool, func, object, string } = PropTypes;
const textClass = classNames('blockText', styles.boldText, styles.storeSelection);
const datesTextClass = classNames('blockText', styles.instructions);
const buttonClass = classNames('small', 'default', styles.btn);

export default class StoreDetails extends PureComponent {

  static contextTypes = {
    i18n: object,
  };

  static propTypes = {
    isDeliveryStore: bool,
    onChoose: func,
    onRemove: func,
    currentStore: object,
    deliveryLeadDate: string,
  };

  static defaultProps = {
    onRemove: noop,
    onChoose: noop,
  }

  render() {
    const { deliveryStore, payment, checkout } = this.context.i18n;
    const { isDeliveryStore, deliveryLeadDate, currentStore, onChoose, onRemove } = this.props;

    let roomNumber = '';
    let dates;
    let heading = payment.storeSelected;
    let name = currentStore.name;
    let prefecture = currentStore.city;
    let city = `${currentStore.municipality} ${currentStore.number}`;

    const deliveryLeadDateWithLabel = deliveryLeadDate
      ? checkout.standardDeliveryDateWithSeparator + deliveryLeadDate
      : '';

    if (isDeliveryStore) {
      roomNumber = currentStore.roomNumber;
      dates = <Text className={datesTextClass}>{deliveryLeadDateWithLabel}</Text>;
      heading = deliveryStore.previousDeliveries;
      name = `${currentStore.familyName} ${currentStore.givenName}`;
      prefecture = currentStore.prefecture;
      city = `${currentStore.city} ${currentStore.address}`;
    }

    return (
      <div>
        <Heading
          className="subHeader"
          headingText={heading}
          type="h2"
        />
        <Text className={textClass}>
          {name}
        </Text>
        <div className={styles.address}>
          <Text className="blockText">
            {prefecture}{city}
          </Text>
          <Text className="blockText">
            {roomNumber}
          </Text>
        </div>
        {dates}
        <div className={styles.options}>
          <Button
            className={buttonClass}
            label={deliveryStore.map}
            labelClass={styles.optionBtn}
            onTouchTap={onChoose}
          />
          <Button
            className={buttonClass}
            onTouchTap={onRemove}
          >
            <span className={styles.removeBtn} />
          </Button>
        </div>
      </div>
    );
  }
}
