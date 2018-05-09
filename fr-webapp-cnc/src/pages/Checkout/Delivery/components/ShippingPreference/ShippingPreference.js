import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import noop from 'utils/noop';
import { setDeliveryMethodOption } from 'redux/modules/checkout/delivery';
import * as deliverySelectors from 'redux/modules/checkout/delivery/selectors';
import If from 'components/uniqlo-ui/If';
import Button from 'components/uniqlo-ui/Button';
import Container from 'components/uniqlo-ui/core/Container';
import Text from 'components/uniqlo-ui/Text';
import constants from 'config/site/default';
import RadioSelector from 'components/Selector';
import cx from 'classnames';
import ItemDetails from './ItemDetails.js';
import styles from './styles.scss';

const { bool, func, object, string, arrayOf, shape, array } = PropTypes;
const { SHIPPING, YU_PACKET, SAME_DAY, YAMATO_MAIL } = constants.deliveryTypes;

@connect((state, props) => ({
  isSameDaySelected: deliverySelectors.isSameDaySelected(state, props),
  isSameDayAvailable: deliverySelectors.isSameDayAvailable(state, props),

  isStandardDeliverySelected: deliverySelectors.isStandardDeliverySelected(state, props),
  isStandardDeliveryAvailable: deliverySelectors.isStandardDeliveryAvailable(state, props),

  isCustomTimeFrameSelected: deliverySelectors.isCustomTimeFrameSelected(state, props),
  isCustomTimeFrameAvailable: deliverySelectors.isCustomTimeFrameAvailable(state, props),
  selectedDeliveryTime: deliverySelectors.getSelectedDeliveryTime(state, props),

  isYuPacketSelected: deliverySelectors.isYuPacketSelected(state, props),
  isYuPacketAvailable: deliverySelectors.isYuPacketAvailable(state, props),
  yuPacketText: deliverySelectors.getYuPacketText(state, props),

  isNekoposPacketSelected: deliverySelectors.isNekoposPacketSelected(state, props),
  isNekoposPacketAvailable: deliverySelectors.isNekoposPacketAvailable(state, props),
  nekoposPacketText: deliverySelectors.getNekoposPacketText(state, props),

  isNextDaySelected: deliverySelectors.isNextDaySelected(state, props),
  isNextDayAvailable: deliverySelectors.isNextDayAvailable(state, props),
  selectedNextDayDeliveryTime: deliverySelectors.getSelectedNextDeliveryTime(state, props),
  shouldShowNextDay: deliverySelectors.shouldShowNextDay(state, props),

  shippingFees: deliverySelectors.getShippingFees(state, props),
  shippingDescriptions: deliverySelectors.getShippingDescriptions(state, props),
}), {
  setDeliveryMethodOption,
})

export default class ShippingPreference extends PureComponent {
  static propTypes = {
    // From selectors to enable/disable the available shipping options
    isSameDaySelected: bool,
    isSameDayAvailable: bool,

    isStandardDeliverySelected: bool,
    isStandardDeliveryAvailable: bool,

    isCustomTimeFrameSelected: bool,
    isCustomTimeFrameAvailable: bool,

    isYuPacketSelected: bool,
    isYuPacketAvailable: bool,
    yuPacketText: array,

    isNekoposPacketSelected: bool,
    isNekoposPacketAvailable: bool,
    nekoposPacketText: arrayOf(shape({ type: string, text: string })),

    isNextDaySelected: bool,
    isNextDayAvailable: bool,
    selectedNextDayDeliveryTime: string,
    shouldShowNextDay: bool,

    selectedDeliveryTime: string,
    shippingFees: object,
    shippingDescriptions: object,

    setDeliveryMethodOption: func,

    splitNo: string,

    // From parent component
    onToggleDateTimeModal: func,
    onToggleNextDateModal: func,
  };

  static defaultProps = {
    onToggleDateTimeModal: noop,
    onToggleNextDateModal: noop,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  static generateExplanatoryText(texts) {
    return texts.map((item, idx) =>
      <div className={cx(styles.shippingPreferenceDescription, styles[item.type])} key={idx}>{item.text}</div>);
  }

  componentWillMount() {
    if (this.props.isNekoposPacketSelected) {
      this.setShippingPreference(YAMATO_MAIL);
    }
  }

  onToggleDateTimeModal = () => {
    this.props.onToggleDateTimeModal(this.props.splitNo);
  }

  onToggleNextDateModal = () => {
    this.props.onToggleNextDateModal(this.props.splitNo);
  }

  setShippingPreference = (value) => {
    if (value === 'standard') {
      this.props.setDeliveryMethodOption(SHIPPING, this.props.splitNo, true, 'standard');
    } else {
      this.props.setDeliveryMethodOption(value, this.props.splitNo, true);
    }
  }

  render() {
    const {
      isSameDayAvailable,
      isStandardDeliveryAvailable,
      isCustomTimeFrameAvailable,
      isYuPacketAvailable,
      yuPacketText,
      isStandardDeliverySelected,
      selectedDeliveryTime,
      isCustomTimeFrameSelected,
      isYuPacketSelected,
      isSameDaySelected,
      isNekoposPacketSelected,
      isNekoposPacketAvailable,
      nekoposPacketText,
      shippingFees,
      shippingDescriptions,
      isNextDayAvailable,
      isNextDaySelected,
      selectedNextDayDeliveryTime,
      shouldShowNextDay,
      splitNo,
    } = this.props;

    const { i18n: { checkout, delivery }, config: { defaultSplitNumber } } = this.context;

    const yuDescription = yuPacketText
      ? (<div>
          <div className={styles.shippingDescription}>{shippingDescriptions[YU_PACKET]}</div>
          { this.constructor.generateExplanatoryText(yuPacketText) }
        </div>)
      : shippingDescriptions[YU_PACKET];

    const nekoposDescription = nekoposPacketText
      ? (<div>
          <div>{shippingDescriptions[YAMATO_MAIL]}</div>
          { this.constructor.generateExplanatoryText(nekoposPacketText) }
        </div>)
      : shippingDescriptions[YAMATO_MAIL];

    const editButton = isCustomTimeFrameSelected && !isNextDaySelected
      ? (
        <Button
          className="editButton"
          label={checkout.editTimeFrame}
          onTouchTap={this.onToggleDateTimeModal}
        />
      )
      : null;

    const nextDayEditButton = isNextDaySelected
      ? (
        <Button
          className="editButton"
          label={checkout.editTimeFrame}
          onTouchTap={this.onToggleNextDateModal}
        />
      )
      : null;

    return (
      <Container
        className={cx({
          [styles.topSpacing]: splitNo === defaultSplitNumber,
          [styles.largeTopSpacing]: (splitNo && splitNo !== defaultSplitNumber),
        })}
      >
        <If
          if={splitNo}
          then={Text}
          className={`blockText ${styles.shipmentTitleStyle}`}
          content={`${delivery.shipment} ${splitNo}`}
        />
        <If
          if={splitNo}
          then={ItemDetails}
          splitNo={splitNo}
        />
        <If
          if={isSameDayAvailable}
          then={RadioSelector}
          checked={isSameDaySelected}
          description={shippingDescriptions[SAME_DAY]}
          label={checkout.sameDay}
          labelStyle={styles.labelStyle}
          name="timeFrame"
          onChange={this.setShippingPreference}
          price={shippingFees[SAME_DAY]}
          value={SAME_DAY}
          analyticsOn="Shipping Checkbox Toggle"
          analyticsLabel="当日便"
          analyticsCategory="Checkout Funnel"
        />
        <If
          checked={isNextDaySelected}
          description={selectedNextDayDeliveryTime}
          editButton={nextDayEditButton}
          enabled={isNextDayAvailable}
          if={shouldShowNextDay}
          label={checkout.nextDay}
          labelStyle={styles.labelStyle}
          name="timeFrame"
          onChange={this.onToggleNextDateModal}
          price={shippingFees[SHIPPING]}
          then={RadioSelector}
          value="byNextDate"
          analyticsOn="Shipping Checkbox Toggle"
          analyticsLabel="お届け日時指定"
          analyticsCategory="Checkout Funnel"
        />
        <If
          if={isCustomTimeFrameAvailable}
          then={RadioSelector}
          checked={!isNextDaySelected && isCustomTimeFrameSelected}
          description={!isNextDaySelected && selectedDeliveryTime}
          editButton={editButton}
          label={checkout.byDate}
          labelStyle={styles.labelStyle}
          name="timeFrame"
          onChange={this.onToggleDateTimeModal}
          price={shippingFees[SHIPPING]}
          value="bydate"
          analyticsOn="Shipping Checkbox Toggle"
          analyticsLabel="お届け日時指定"
          analyticsCategory="Checkout Funnel"
        />
        <If
          if={isStandardDeliveryAvailable}
          then={RadioSelector}
          checked={isStandardDeliverySelected}
          description={shippingDescriptions[SHIPPING]}
          label={checkout.standardTime}
          labelStyle={styles.labelStyle}
          name="timeFrame"
          onChange={this.setShippingPreference}
          price={shippingFees[SHIPPING]}
          value="standard"
          analyticsOn="Shipping Checkbox Toggle"
          analyticsLabel="お届け日時を指定しない"
          analyticsCategory="Checkout Funnel"
        />
        <If
          if={isYuPacketAvailable}
          then={RadioSelector}
          checked={isYuPacketSelected}
          description={yuDescription}
          label={checkout.byYupacket}
          labelStyle={styles.labelStyle}
          name="timeFrame"
          onChange={this.setShippingPreference}
          price={shippingFees[YU_PACKET]}
          value={YU_PACKET}
          analyticsOn="Shipping Checkbox Toggle"
          analyticsLabel="ゆうパケット"
          analyticsCategory="Checkout Funnel"
        />
        <If
          if={isNekoposPacketAvailable}
          then={RadioSelector}
          checked={isNekoposPacketSelected}
          description={nekoposDescription}
          label={checkout.nekopos}
          labelStyle={styles.labelStyle}
          name="timeFrame"
          onChange={this.setShippingPreference}
          price={shippingFees[YAMATO_MAIL]}
          value={YAMATO_MAIL}
          analyticsOn="Shipping Checkbox Toggle"
          analyticsLabel="ネコポス"
          analyticsCategory="Checkout Funnel"
        />
      </Container>
    );
  }
}
