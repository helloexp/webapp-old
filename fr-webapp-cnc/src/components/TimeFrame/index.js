import React, { PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import cx from 'classnames';
import styles from './styles.scss';

function renderShippingPrice(shippingPrice) {
  if (shippingPrice) {
    return (
      <Container className={styles.freeText}>
        <span className={styles.priceLine}>| </span>
        {shippingPrice}
      </Container>);
  }

  return null;
}

const Timeframe = (props, context) => {
  const { checkout, orderConfirmation, common } = context.i18n;
  const { titleStyle, containerStyle, timeFrameMessage, shippingPrice, arrivalDate, editable, hideEdit, baseAClassText, editLabelStyle, onEdit } = props;
  const mainWrapperStyle = ['pickerContainer', containerStyle].filter(Boolean).join(' ');

  let header = <Heading className={titleStyle} headingText={orderConfirmation.shippingMethod} type="h4" />;

  header = editable
    ? (<Container className={`z8 ${styles.headerContainer}`}>
      {header}
      <Button
        className="editButton"
        label={common.edit}
        labelClass={cx(styles.editBtn, { [styles[editLabelStyle]]: !!editLabelStyle })}
        onTouchTap={onEdit}
        analyticsOn="Button Click"
        analyticsLabel="Shipping Method Change"
        analyticsCategory="Checkout Funnel"
      />
    </Container>)
    : null;

  header = hideEdit
    ? (<Container className={`z8 ${styles.headerContainer}`}>
      <Heading className={titleStyle} headingText={checkout.estimatedDelivery} type="h4" />
    </Container>)
    : header;

  const timeFrameMessagePanel = timeFrameMessage
    ? <Text className={cx('inlineBlockText', { [styles.frameContent]: baseAClassText })}>{timeFrameMessage}</Text>
    : null;
  const arrivalDatePanel = arrivalDate
    ? <Text className={cx('blockText', { [styles.frameContent]: baseAClassText })}>{arrivalDate}</Text>
    : null;

  return (
    <Container className={mainWrapperStyle}>
      {header}
      {timeFrameMessagePanel}
      { renderShippingPrice(shippingPrice) }
      {arrivalDatePanel}
    </Container>
  );
};

const { string, object, bool, func } = PropTypes;

Timeframe.propTypes = {
  titleStyle: string,
  containerStyle: string,
  timeFrameMessage: string,
  arrivalDate: string,
  shippingPrice: string,
  editable: bool,
  editLabelStyle: string,
  hideEdit: bool,
  baseAClassText: bool,
  onEdit: func,
};

Timeframe.contextTypes = {
  i18n: object,
};

Timeframe.defaultProps = {
  hideEdit: false,
};

export default Timeframe;
