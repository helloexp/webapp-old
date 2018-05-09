import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import TimeFrame from 'components/TimeFrame';
import Panel from 'components/Panel';
import { getTimeFrameMessage, getShippingFrameMessage, getShippingCost } from './selectors';
import styles from './styles.scss';

const { object, string, bool } = PropTypes;

@connect((state, props) => ({
  timeFrameMessage: getTimeFrameMessage(state, props),
  shippingFrameMessage: getShippingFrameMessage(state, props),
  shippingCost: getShippingCost(state, props),
}))
export default class SplitTimeFrame extends PureComponent {
  static propTypes = {
    splitNo: string,
    timeFrameMessage: string,
    shippingFrameMessage: string,
    shippingCost: string,
    isLastItem: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { props: { splitNo, shippingFrameMessage, timeFrameMessage, shippingCost, isLastItem }, context: { i18n: { delivery } } } = this;

    return (
      <Panel
        className={classNames(styles.container, { [styles.noBottomSpacing]: isLastItem })}
        headerStyle={styles.splitHeading}
        title={`${delivery.shipment} ${splitNo}`}
      >
        <TimeFrame
          arrivalDate={shippingFrameMessage}
          containerStyle={classNames(styles.timeFrameContainer, styles.timeFrameWrap)}
          shippingPrice={shippingCost}
          timeFrameMessage={timeFrameMessage}
        />
      </Panel>
    );
  }
}
