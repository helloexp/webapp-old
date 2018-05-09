import React, { PureComponent, PropTypes } from 'react';
import { formatCardNumber } from 'utils/format';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Input from 'components/Atoms/Input';
import Tooltip from 'components/Atoms/Tooltip';
import If from 'components/uniqlo-ui/If';
import Container from 'components/uniqlo-ui/core/Container';
import Button from 'components/uniqlo-ui/Button';
import Icon from 'components/uniqlo-ui/core/Icon';
import AddressPanel from 'components/AddressPanel';
import cx from 'classnames';
import styles from './styles.scss';

const cvvb = require('images/cvvb.png');
const cvvf = require('images/cvvf.png');

const { object, bool, func, string } = PropTypes;

const classNames = {
  inputWrapper: 'contentWrapper',
  imageWrapper: cx('imageWrapper', styles.imageWrapper),
  subInfo: cx('subInfo', styles.subInfo),
  billingAddressText: cx('subMessage', styles.securityInfoWrapper),
};

const BillingAddressPanel = ({ payment, billingAddress, applyCreditCard, disableApplyCreditCard, paymentMethod }) => (
  <Container>
    <AddressPanel title={payment.billingAddress} {...billingAddress} editable />
    <Button
      className="apply"
      disabled={disableApplyCreditCard}
      label={payment.applyCreditCard}
      onTouchTap={applyCreditCard}
    />
    <Text className={classNames.billingAddressText}>
      <Icon className="iconSecure" styleClass={styles.securityInfoLock} />
      <Text className={styles.securityInfo}>{paymentMethod.yourTransactionIsSecure}</Text>
    </Text>
  </Container>
);

BillingAddressPanel.propTypes = {
  payment: PropTypes.object,
  billingAddress: object,
  applyCreditCard: func,
  disableApplyCreditCard: bool,
  paymentMethod: object,
};

export default class CvvInput extends PureComponent {
  static propTypes = {
    billingAddress: object,
    applyCreditCard: func,
    editCvv: func,
    isShowCvvToolTip: bool,
    onComplete: func,
    disableApplyCreditCard: bool,
    hideBilling: bool,
    onCvvInfoPress: func,
    cvv: string,
  };

  static contextTypes = {
    i18n: object,
  };

  onValueInput = (event) => {
    this.props.editCvv({
      id: event.target.id,
      value: formatCardNumber(event.target.value),
    });
  };

  render() {
    const {
      billingAddress,
      applyCreditCard,
      isShowCvvToolTip,
      disableApplyCreditCard,
      hideBilling,
      onCvvInfoPress,
      cvv,
    } = this.props;
    const { i18n: { paymentMethod, payment } } = this.context;

    return (
      <Container className={styles.inputWrap}>
        <Container>
          <Container className={classNames.inputWrapper}>
            <Input
              value={cvv}
              label={paymentMethod.cvvCode}
              id="cvv"
              maxLength="4"
              onChange={this.onValueInput}
              pattern="[0-9]*"
              type="password"
            />
            <If className={styles.cvvToolTip} if={isShowCvvToolTip} then={Tooltip}>{paymentMethod.pleaseEnterTheCVV}</If>
          </Container>
          <div className={styles.cvvWrapper}>
            <Container>
              <Image
                className={cx('cardCvvImage', 'withImageTag')}
                source={cvvb}
              />
              <Image
                className={cx('cardCvvImage', 'withImageTag')}
                source={cvvf}
              />
            </Container>
            <Button
              className={cx('small', 'default', 'showOverflow', styles.infoIcon)}
              onTouchTap={onCvvInfoPress}
            />
          </div>
          <Text className={classNames.subInfo}>{payment.required}</Text>
        </Container>
        <If
          applyCreditCard={applyCreditCard}
          billingAddress={billingAddress}
          disableApplyCreditCard={disableApplyCreditCard}
          if={!hideBilling}
          payment={payment}
          paymentMethod={paymentMethod}
          then={BillingAddressPanel}
        />
      </Container>
    );
  }
}
