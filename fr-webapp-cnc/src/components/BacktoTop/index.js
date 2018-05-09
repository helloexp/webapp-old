import React, { PureComponent, PropTypes } from 'react';
import Icon from 'components/uniqlo-ui/core/Icon';
import events from 'utils/events';
import classNames from 'classnames';
import styles from './BacktoTop.scss';

const toPosition = 0;
const timeForUserToSettle = 500;
const { object, string, number, oneOfType } = PropTypes;

export default class BacktoTop extends PureComponent {
  static propTypes = {
    distFromTop: oneOfType([string, number]),
    currentPage: string,
  };

  static contextTypes = {
    config: object.isRequired,
  };

  static defaultProps = {
    distFromTop: 0,
    currentPage: '',
  };

  state = {
    isShown: false,
  };

  componentDidMount() {
    const { currentPage } = this.props;

    this.previousScrollTop = events.getContentScroll();

    return currentPage.includes('checkout') || currentPage.includes('cart')
      ? true
      : this.listenScroll();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isShown !== nextState.isShown;
  }

  componentWillUnmount() {
    events.unsubscribe(this.subscription);
  }

  getScrollDirection() {
    const currentScrollTop = events.getContentScroll();
    const isScrollUp = currentScrollTop < this.previousScrollTop;

    this.previousScrollTop = currentScrollTop;

    return isScrollUp;
  }

  /**
   * Subscription id
   * @type {number}
   */
  subscription = 0;

  handleScroll = () => {
    const { config } = this.context;
    const { distFromTop } = this.props;
    const isScrollUp = this.getScrollDirection();
    const fromTop = distFromTop || config.goToTop.top || window.outerHeight;
    const isBeyondTopLimit = events.getContentScroll() > fromTop;

    clearTimeout(this.pauseForScrollStop);

    if (isBeyondTopLimit && isScrollUp) {
      this.setState({ isShown: true });
    } else if (isBeyondTopLimit && !isScrollUp) {
      this.setState({ isShown: false });

      // To provide delay after the scrolling has stopped and for the user to settle.
      this.pauseForScrollStop = setTimeout(() => {
        this.setState({ isShown: true });
      }, timeForUserToSettle);
    } else {
      this.setState({ isShown: false });
    }
  };

  listenScroll = () => {
    this.subscription = events.subscribe('scroll', this.handleScroll);
  };

  handleClick = () => {
    const { config } = this.context;

    events.scrollToTop(toPosition, config.goToTop.duration || 500);
  };

  render() {
    const { config } = this.context;
    const { isShown } = this.state;
    const { currentPage } = this.props;

    return (
      <div
        className={classNames(styles.backToTopContainer, { [styles.hide]: !isShown, [styles.onTop]: currentPage.includes('cart') })}
        onClick={this.handleClick}
      >
        <Icon className="iconChevronUpSmall" styleClass={styles.backToTopIcon} />
        <span className={styles.text}>{config.goToTop.text}</span>
      </div>
    );
  }
}
