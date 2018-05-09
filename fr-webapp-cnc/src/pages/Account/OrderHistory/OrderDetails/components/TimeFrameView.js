import React, { PureComponent, PropTypes } from 'react';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import TimeFrame from 'components/TimeFrame';
import styles from '../styles.scss';

const { object, bool } = PropTypes;

export default class TimeFrameView extends PureComponent {
  static propTypes = {
    routing: object,
    shipping: bool,
    timeFrameInfo: object,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    timeFrameInfo: {},
  };

  render() {
    const { shipping, routing, timeFrameInfo } = this.props;
    const { orderHistory } = this.context.i18n;

    return (
      <If if={shipping}>
        <Container className={styles.shippingDetailsWrapper}>
          <Heading className={styles.timeFrameHeading} headingText={orderHistory.shippingMethod} type="h4" />
          <TimeFrame
            arrivalDate={timeFrameInfo.estimatedArrival}
            containerStyle={styles.timeFrameContainer}
            routing={routing}
            timeFrameMessage={timeFrameInfo.timeFrameMessage}
            baseAClassText
          />
        </Container>
      </If>
    );
  }
}
