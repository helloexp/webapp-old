import React, { PropTypes, Component } from 'react';
import Select from 'components/Atoms/Select';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import { connect } from 'react-redux';
import * as deliveryActions from 'redux/modules/checkout/delivery';
import { getDeliveryDateTimeListForOption, getDeliveryMethodOfDiv, getNextDateOption } from 'redux/modules/checkout/delivery/selectors';
import Drawer from 'components/Drawer';
import constants from 'config/site/default';
import { getDateFromValue, timeForCode, getDayString } from 'utils/formatDate';
import cx from 'classnames';
import castArray from 'utils/castArray';
import spacing from 'theme/spacing.scss';
import styles from './styles.scss';

function getDateDetails(date, list) {
  return list.filter(item => item.date === date);
}

const { object, array, func, bool, oneOfType, string } = PropTypes;
const {
  deliveryTypes: {
    SHIPPING,
  },
  NULL_TIMEFRAME,
} = constants;

@connect((state, props) => ({
  deliveryRequestedDateTimes: getDeliveryDateTimeListForOption(state, props),
  deliveryMethod: getDeliveryMethodOfDiv(state, props),
  nextDateOption: getNextDateOption(state, props),
}), {
  setDeliveryMethodOption: deliveryActions.setDeliveryMethodOption,
})
export default class DateTimeSelector extends Component {
  static propTypes = {
    deliveryRequestedDateTimes: array,
    setDeliveryMethodOption: func,
    onCancel: func,
    deliveryMethod: object,
    nextDateOptionSelected: bool,
    nextDateOption: oneOfType([array, bool]),
    splitNo: string,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    deliveryRequestedDateTimes: [],
  };

  state = {
    isValidDate: true,
  };

  componentWillMount = () => {
    this.currentScrollPos = document.documentElement.scrollTop || document.body.scrollTop;
    const { nextDateOptionSelected, deliveryRequestedDateTimes, deliveryMethod, nextDateOption } = this.props;
    const timeList = deliveryRequestedDateTimes[0].timeSlots;
    let deliveryDate = NULL_TIMEFRAME;
    let deliveryTimeframe = NULL_TIMEFRAME;

    if (nextDateOptionSelected) {
      deliveryDate = deliveryRequestedDateTimes[0].date;
      deliveryTimeframe = timeList[0];
      if (timeList && deliveryMethod.deliveryReqTime) {
        deliveryTimeframe = timeList.includes(deliveryMethod.deliveryReqTime)
          ? deliveryMethod.deliveryReqTime
          : timeList[0];
      }
    } else if (deliveryMethod && !(nextDateOption && deliveryMethod.deliveryReqDate === nextDateOption[0].date)) {
      if (deliveryMethod.deliveryReqDate || deliveryMethod.deliveryReqTime) {
        const reqestedDate = deliveryMethod.deliveryReqDate || deliveryDate;
        const requestedTime = deliveryMethod.deliveryReqTime || deliveryTimeframe;
        const emptyDateSlot = { timeSlots: [] };
        // first check if the date selected by user is available in latest delivery_selectable call.
        const dateSlotAvailable = deliveryRequestedDateTimes.find(dateSlot => dateSlot.date === reqestedDate) || emptyDateSlot;
        // then check if the time specified by user is available in the timeslots array of matched date slot.
        const timeSlotAvailable = dateSlotAvailable.timeSlots.find(timeSlot => timeSlot === requestedTime);

        // if time slot was not found, then the delivery information of this cart is outdated.
        if (timeSlotAvailable) {
          deliveryDate = dateSlotAvailable.timeSlots.length && deliveryMethod.deliveryReqDate || deliveryDate;
          deliveryTimeframe = deliveryMethod.deliveryReqTime || deliveryTimeframe;
        }
      }
    }

    this.setState({ deliveryDate, deliveryTimeframe });
  }

  onDoneButtonClick = () => {
    const {
      deliveryRequestedDateTimes,
      setDeliveryMethodOption,
      splitNo,
    } = this.props;
    const { deliveryDate, deliveryTimeframe } = this.state;
    const newState = {};
    const deliveryRequestedSlots = deliveryDate && getDateDetails(deliveryDate, deliveryRequestedDateTimes);
    const deliveryRequestedTimes = deliveryRequestedSlots[0].timeSlots;

    let currentDeliveryDate = '';

    if (deliveryDate === NULL_TIMEFRAME) {
      newState.isValidDate = deliveryRequestedTimes.includes(deliveryTimeframe);
    } else {
      newState.isValidDate = deliveryRequestedSlots.length && deliveryRequestedTimes.includes(deliveryTimeframe);
      currentDeliveryDate = deliveryDate;
    }

    if (newState.isValidDate) {
      setDeliveryMethodOption(SHIPPING, splitNo, true, currentDeliveryDate, deliveryTimeframe);
      this.closeModal();
    } else {
      newState.deliveryDate = NULL_TIMEFRAME;
      newState.deliveryTimeframe = NULL_TIMEFRAME;
    }

    this.setState(newState);
  };

  onDateTimeChange = (newDate, newTime) => {
    const { deliveryDate, deliveryTimeframe } = this.state;

    if (!newDate) {
      newDate = deliveryDate;
    } else if (!newTime) {
      newTime = deliveryTimeframe;
    }

    const { dateOptions, timeOptions } = this.getDatetimeOptions(newDate);

    if (!dateOptions.some(item => item.value === newDate)) {
      newDate = dateOptions[0].value;
    }

    if (!timeOptions.some(item => item.value === newTime)) {
      newTime = timeOptions[0].value;
    }

    this.setState({
      deliveryDate: newDate,
      deliveryTimeframe: newTime,
    });
  }

  onDateChange = (event) => {
    this.onDateTimeChange(event.target.value, null);
  };

  onTimeframeChange = (event) => {
    this.onDateTimeChange(null, event.target.value);
  };

  getDatetimeOptions = (newDate) => {
    const { deliveryRequestedDateTimes } = this.props;
    const { delivery } = this.context.i18n;
    const nullText = timeForCode(NULL_TIMEFRAME, delivery);
    const dateOptions = deliveryRequestedDateTimes && castArray(deliveryRequestedDateTimes).map(item =>
      ({ label: item.date === NULL_TIMEFRAME && nullText || getDateFromValue(item.date), value: item.date }));
    const timeOptions = deliveryRequestedDateTimes
      ? castArray(getDateDetails(newDate, deliveryRequestedDateTimes)[0].timeSlots).map(timeframe =>
        ({ label: timeForCode(timeframe, delivery), value: timeframe }))
      : ({ label: timeForCode(NULL_TIMEFRAME, delivery), value: NULL_TIMEFRAME });

    return { dateOptions, timeOptions };
  }

  closeModal = () => {
    this.props.onCancel(this.currentScrollPos);
  }

  constructMessage() {
    const {
      props: {
        deliveryRequestedDateTimes,
      },
      state: {
        deliveryDate,
        deliveryTimeframe,
      },
      context: {
        i18n: {
          delivery,
        },
      },
    } = this;
    const dateSelected = deliveryDate || deliveryRequestedDateTimes[0].date;
    const timeSelected = deliveryTimeframe || getDateDetails(deliveryDate, deliveryRequestedDateTimes)[0].timeSlots[0];
    const time = timeSelected && timeForCode(timeSelected, delivery) || null;

    if (!deliveryDate || deliveryDate === NULL_TIMEFRAME) {
      if (!deliveryTimeframe || deliveryTimeframe === NULL_TIMEFRAME) {
        return '';
      }

      return `${delivery.deliverySelectedTime} ${time} ${delivery.asSpecified}`;
    }

    const date = getDateFromValue(dateSelected);
    const day = `(${getDayString(date, this.context.i18n)})`;

    if (deliveryTimeframe === NULL_TIMEFRAME && dateSelected) {
      return `${delivery.deliverySelectedDate} ${date} ${day} ${delivery.asSpecified}`;
    }

    return `${delivery.deliveryScheduled} ${date} ${day} ${time} ${delivery.asSpecified}`;
  }

  render() {
    const {
      props: { nextDateOptionSelected },
      state: {
        deliveryDate,
        deliveryTimeframe,
        isValidDate,
      },
      context: {
        i18n: {
          delivery,
          common,
        },
      },
    } = this;

    const timeFrameMessage = this.constructMessage();
    const drawerFooterVariation = timeFrameMessage ? 'fixedBorderedFooter' : 'fixedFooterUnselected';
    const { dateOptions, timeOptions } = this.getDatetimeOptions(deliveryDate);

    return (
      <Drawer
        acceptLabel={common.done}
        cancelLabel={common.cancelText}
        className={styles.drawerClass}
        onAccept={this.onDoneButtonClick}
        onCancel={this.closeModal}
        title={delivery.heading}
        variation={drawerFooterVariation}
        bodyClass={styles.drawerBody}
        acceptBtnProps={{
          analyticsOn: 'Button Click',
          analyticsLabel: 'UPDATE SHIPPING DATETTIME',
          analyticsCategory: 'Checkout Funnel',
        }}
      >
        <div className={cx(styles.dateTimeWrapper, { [styles.footerSpacing]: !timeFrameMessage })}>
          <Text className={styles.dateTimeLabel}>{delivery.chooseDateTime}</Text>
          <If
            if={!isValidDate}
            then={Text}
            className="blockText errorMessageText"
          >
            {delivery.errorMessage}
          </If>
          <Select
            values={dateOptions}
            value={deliveryDate}
            onChange={this.onDateChange}
            label={delivery.deliveryDate}
            isValid={isValidDate}
            className={cx(spacing.MTL, spacing.MBSM)}
            singleOption={nextDateOptionSelected}
            analyticsOn="Shipping Date Change"
            analyticsCategory="Checkout Funnel"
            analyticsLabel="日時"
          />
          <Select
            values={timeOptions}
            value={deliveryTimeframe}
            onChange={this.onTimeframeChange}
            label={delivery.deliveryTimeframe}
            isValid={isValidDate}
            className={spacing.MBL}
            analyticsOn="Shipping Time Change"
            analyticsCategory="Checkout Funnel"
            analyticsLabel="時間"
          />
        </div>
        <If
          if={timeFrameMessage}
          then={Text}
          className={cx({
            [styles.secondLastFooterText]: nextDateOptionSelected,
            [styles.timeframeMessage]: !nextDateOptionSelected,
            [styles.lastFooterText]: !nextDateOptionSelected,
          })}
          content={timeFrameMessage}
        />
        <If
          if={nextDateOptionSelected}
          then={Text}
          className={cx(styles.lastFooterText, styles.nextDayWarningText)}
          content={delivery.nextDayWarning}
        />
      </Drawer>
    );
  }
}
