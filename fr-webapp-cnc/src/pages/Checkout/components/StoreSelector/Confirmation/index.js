import React, { PropTypes, PureComponent } from 'react';
import { truncate } from 'utils/format';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import { getFeatures, getArrival, getIrregularOpenOurs, getClosedDates } from 'utils/store';
import { checkErrorMessage } from 'redux/modules/errorHandler';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import styles from './styles.scss';

const { object, func, string, bool } = PropTypes;
const headingClass = classNames('subHeader', styles.numberOfResults);
const buttonCancelClass = classNames('default', 'medium', styles.cancel);
const buttonAcceptClass = classNames('secondary', 'medium', styles.accept);

export default class Confirmation extends PureComponent {

  static propTypes = {
    errorMessages: object,
    plannedDateTime: string,
    selectStore: func,
    setPickupStore: func,
    store: object,
    isPaymentPage: bool,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  onSetPickupStore = () => {
    const { setPickupStore, store } = this.props;

    setPickupStore(store);
  }

  onCancel = () => this.props.selectStore(null);

  getDistanceText = () => {
    const { isPaymentPage, store, brand } = this.props;
    const { deliveryStore, checkout: { pickupStoreDistanceText } } = this.context.i18n;
    const shouldShowDistance = isPaymentPage && store.distance;
    let distance;

    if (isPaymentPage) {
      distance = store.distance && `${store.distance} ${deliveryStore.unit}`;
    } else {
      distance = pickupStoreDistanceText[brand];
    }

    return { shouldShowDistance, distance };
  }

  render() {
    const {
      errorMessages,
      store,
      plannedDateTime,
      isPaymentPage,
    } = this.props;
    const { deliveryStore } = this.context.i18n;
    const error = checkErrorMessage(errorMessages, true);
    const distanceText = this.getDistanceText();

    return (
      <div className={styles.confirmation}>
        <div className={styles.content}>
          <Heading
            className={headingClass}
            headingText={store.name}
            type="h6"
          />
          <If
            errorIdentifier={error && error.key}
            if={error}
            isCustomError
            message={error && error.message}
            then={ErrorMessage}
          />
          <Text className="blockText">{store.city}{store.municipality}{store.number}</Text>
          <Text className="blockText">{deliveryStore.possibleTime}：</Text>
          <Text className={`blockText ${styles.possibleTime}`}>
            {deliveryStore.weekDayOpen}{`${truncate(store.weekDayOpen)}AM～${truncate(store.weekDayClose)}PM`}
          </Text>
          <Text className={`blockText ${styles.weekDayTime}`}>
            {deliveryStore.holidaysOpen}{`${truncate(store.weekendOpen)}AM～${truncate(store.weekendClose)}PM`}
          </Text>
          {getIrregularOpenOurs(store, 'storeLocator', deliveryStore, styles)}
          {getClosedDates(store, 'storeLocator', deliveryStore, styles)}
          {getArrival(store, styles)}
          <If
            if={!isPaymentPage}
            then={Text}
            content={plannedDateTime}
            className="blockText"
          />
          <If
            if={distanceText.shouldShowDistance}
            then={Text}
            className={classNames('blockText', styles.distanceText)}
            content={distanceText.distance}
            else={Text}
          />
          <Text className="finePrint">{getFeatures(store, deliveryStore, styles)}</Text>
        </div>
        <div className={styles.buttons}>
          <Button
            className={buttonCancelClass}
            labelClass={styles.labelStyle}
            label={deliveryStore.cancel}
            onTouchTap={this.onCancel}
            preventMultipleClicks
          />
          <Button
            className={buttonAcceptClass}
            labelClass={styles.labelStyle}
            label={deliveryStore.accept}
            onTouchTap={this.onSetPickupStore}
            analyticsOn="Button Click"
            analyticsCategory="Checkout Funnel"
            analyticsLabel="Cofirm Store Location"
            preventMultipleClicks
          />
        </div>
      </div>
    );
  }
}
