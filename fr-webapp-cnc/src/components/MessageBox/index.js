import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import If from 'components/uniqlo-ui/If';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import Icon from 'components/uniqlo-ui/core/Icon';
import cx from 'classnames';
import styles from './styles.scss';

const { string, func, object, bool, oneOfType, oneOf, array } = PropTypes;

export default class MessageBox extends PureComponent {
  static propTypes = {
    title: string,
    message: oneOfType([string, array]),
    variation: oneOf([
      'alert',
      'borderlessConfirm',
      'completed',
      'confirm',
      'ignoreOrProceed',
      'info',
      'noOverlayConfirm',
      'popup',
      'releaseAlert',
      'loginOrProceed',
    ]),
    blockBox: bool,
    confirmLabel: string,
    rejectLabel: string,
    onAction: func,
    stickyBox: bool,
    widthNav: bool,
    onClose: func,
    couponPopup: bool,

    rejectProps: object,
    confirmProps: object,
  };

  static defaultProps = {
    onAction: noop,
    onClose: noop,
    couponPopup: false,
  };

  static contextTypes = {
    i18n: object,
  };

  onPressYes = () => {
    this.props.onAction('yes');
  };

  onPressNo = () => {
    this.props.onAction('no');
  };

  render() {
    const {
      title,
      message,
      variation,
      confirmLabel,
      confirmProps,
      rejectLabel,
      rejectProps,
      stickyBox,
      blockBox,
      widthNav,
      onClose,
      couponPopup,
    } = this.props;

    const noLabelStyles = ['releaseAlert', 'popup'].includes(variation);
    const labelClass = cx({
      [styles.releaseAlertLbl]: variation === 'releaseAlert',
    });
    const iconCloseClass = cx({
      [styles.iconCloseBlack]: variation === 'popup',
      [styles.iconClose]: !(variation === 'releaseAlert' && !couponPopup),
    });

    const overlay = variation !== 'noOverlayConfirm'
      ? (<div
        className={cx(styles.overlay,
          {
            [styles.confirmationBoxContainer]: stickyBox,
            [styles.overlayContainer]: variation !== 'noOverlayConfirm' && !couponPopup,
            [styles.couponOverlay]: variation === 'releaseAlert' && couponPopup,
          }
        )}
        onClick={variation !== 'info' ? noop : this.onPressNo}
      />)
      : null;

    return (
      <div className={styles.messageContainer}>
        {overlay}
        <Container
          className={cx('z2', styles.messageBox, {
            [styles.blockBox]: blockBox,
            [styles.confirmationBox]: stickyBox,
            [styles.confirmationBoxWithNav]: widthNav,
            [styles.alertBoxWithClose]: variation === 'alert',
            [styles.releaseAlert]: ['releaseAlert', 'completed', 'ignoreOrProceed', 'loginOrProceed'].includes(variation),
            [styles.confirmationBoxPopup]: variation === 'popup',
          })}
        >
          <div
            className={cx({
              [styles.stickyBoxMessageBody]: stickyBox,
              [styles.messageBody]: !stickyBox && variation !== 'loginOrProceed',
              [styles.alertMessageBody]: ['alert', 'releaseAlert', 'popup'].includes(variation),
            })}
          >

            <div
              className={cx({
                [styles.headingWithClose]: ['alert', 'releaseAlert', 'popup', 'ignoreOrProceed'].includes(variation),
              })}
            >
              <If
                if={!stickyBox && !blockBox && title}
                then={Heading}
                className={cx({
                  [styles.releaseAlertTitle]: variation === 'releaseAlert',
                  [styles.alertHeading]: variation === 'popup' || variation === 'ignoreOrProceed' || variation === 'loginOrProceed',
                  [styles.alertTitle]: variation === 'popup',
                  subHeader: variation !== 'popup',
                })}
                headingText={title}
                type="h4"
              />
              <If
                if={['alert', 'releaseAlert', 'popup', 'ignoreOrProceed'].includes(variation)}
                then={Icon}
                className="iconClose"
                onClick={onClose}
                styleClass={iconCloseClass}
              />
            </div>
            <Text
              className={cx('blockText', styles.whiteSpace,
                { [styles.loginPromptText]: variation === 'loginOrProceed',
                  [styles.messageText]: blockBox,
                  [styles.alertMessageText]: variation === 'alert',
                  [styles.messageClass]: variation === 'popup',
                })
              }
            >
              {message}
            </Text>
          </div>
          <div
            className={cx(styles.footer, {
              [styles.splitButtons]: variation === 'loginOrProceed',
              [styles.infoFooter]: (variation === 'info' || variation === 'completed' || variation === 'ignoreOrProceed' || variation === 'loginOrProceed'),
              [styles.alertFooter]: ['alert', 'releaseAlert', 'popup'].includes(variation),
              [styles.stickyBoxFooter]: stickyBox || blockBox,
              [styles.borderlessConfirmFooter]: variation === 'borderlessConfirm',
            })}
          >
            <If
              if={variation !== 'ignoreOrProceed' && variation !== 'loginOrProceed'}
              then={Button}
              className={cx({
                'default medium boldLight': (['confirm', 'info', 'noOverlayConfirm', 'borderlessConfirm'].includes(variation)),
                'medium secondary': ['alert', 'popup'].includes(variation),
                medium: variation === 'releaseAlert',
                [styles.alertButton]: ['alert', 'popup'].includes(variation),
                [styles.releaseAlertBtn]: variation === 'releaseAlert',
                [styles.completed]: variation === 'completed',
                [styles.btnStyle]: ['borderlessConfirm', 'confirm'].includes(variation),
                [styles.confirmAlertButton]: variation === 'popup',
              })}
              labelClass={labelClass}
              noLabelStyles={noLabelStyles}
              label={rejectLabel}
              onTouchTap={this.onPressNo}
              {...rejectProps}
            />
            <If
              if={['borderlessConfirm', 'confirm', 'noOverlayConfirm', 'ignoreOrProceed', 'loginOrProceed'].includes(variation)}
              then={Button}
              className={cx('secondary', 'bold', {
                medium: variation !== 'loginOrProceed',
                [styles.btnStyle]: ['confirm', 'borderlessConfirm'].includes(variation),
                [styles.completed]: variation === 'ignoreOrProceed' || variation === 'loginOrProceed',
                [styles.applePayLogin]: variation === 'loginOrProceed',
              })}
              label={confirmLabel}
              onTouchTap={this.onPressYes}
              {...confirmProps}
            />
            <If
              if={variation === 'loginOrProceed'}
              then={Button}
              className={styles.chooseGuest}
              label={rejectLabel}
              onTouchTap={this.onPressNo}
              {...rejectProps}
            />
          </div>
        </Container>
      </div>
    );
  }
}
