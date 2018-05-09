import React, { PropTypes, PureComponent } from 'react';
import Link from 'components/uniqlo-ui/Link';
import classNames from 'classnames';
import Heading from 'components/uniqlo-ui/Heading';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';

import styles from './styles.scss';

const { arrayOf, object, number, string, oneOfType, bool } = PropTypes;

class Ticker extends PureComponent {
  static propTypes = {
    className: string,
    messages: arrayOf(object).isRequired,
    timer: oneOfType([number, string]),
    invertColors: bool,
  };

  static contextTypes = {
    config: object,
    i18n: object,
  };

  state = {
    current: 0,
  };

  componentDidMount = () => {
    const { messages, timer } = this.props;
    const { config: { tickerDuration } } = this.context;

    if (messages.length > 1) {
      this.ticker = setInterval(this.tick, parseInt(timer, 10) || tickerDuration);
    }
  };

  shouldComponentUpdate(nextProps) {
    const { state: { current: currentState }, props: { messages } } = this;
    const { messages: nextMessages } = nextProps;

    return !!((nextMessages.length && nextMessages[currentState]) || nextMessages.length !== messages.length);
  }

  componentWillUnmount = () => {
    clearInterval(this.ticker);
  };

  tick = () => {
    const { state: { current: currentState }, props: { messages } } = this;

    this.setState({
      current: (messages.length - 1) === currentState ? 0 : currentState + 1,
    });
  };

  render() {
    const { state: { current: currentState }, props: { invertColors, className, messages } } = this;
    const { ticker: { gu: { freeShippingText, loggingText } } } = this.context.i18n;
    const { config: { applePay } } = this.context;

    if (!messages.length || !messages[currentState]) {
      return null;
    }

    const currentMessage = messages[currentState];
    const isAlert = currentMessage.designType === 'red';
    const isLink = !!currentMessage.url;
    const isImage = !!currentMessage.src;
    const absoluteUrlPattern = /^(https?:)?\/\//;
    // this key is needed for animation
    const compProps = { key: currentState };
    let RootTag;

    if (isLink) {
      let targetLink = currentMessage.url;

      if (absoluteUrlPattern.test(targetLink)) {
        RootTag = 'a';
        if (checkUQNativeApp()) {
          targetLink = `${targetLink}?${applePay.browserFlag.uq}`;
        } else if (checkGUNativeApp()) {
          targetLink = `${targetLink}?${applePay.browserFlag.gu}`;
        }
        compProps.href = targetLink;
        compProps.target = '_blank';
        compProps.className = styles.linkUrl;
      } else {
        RootTag = Link;
        compProps.to = targetLink;
      }
    } else {
      RootTag = 'span';
      compProps.className = styles.spanSpacing;
    }

    const containerClass = classNames(
      styles.container,
      {
        [styles.inverted]: invertColors,
        [className]: !!className,
        [styles.alert]: isAlert,
        [styles.info]: !isAlert,
      },
    );

    compProps.className = classNames(
      styles.in,
      `${styles[isAlert ? 'alertLink' : 'infoLink']}`,
      {
        [styles.message]: !isImage,
        [styles.link]: isLink,
        [styles.imageContainer]: isImage,
      }
    );

    return (
      <div className={containerClass}>
        <RootTag {...compProps}>
          { isImage
            ? <img alt="presentation" className={styles.image} src={currentMessage.src} />
            : <Heading className={styles.applePayTicker} type="h3">
                <span>{ freeShippingText }</span>
                <span>{ loggingText }</span>
              </Heading>
          }
        </RootTag>
      </div>
    );
  }
}

export default Ticker;
