import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import {
  isLoaded as isAuthLoaded,
  load as authLoad,
  saveAndRedirectToLogin as goToLogin,
} from 'redux/modules/account/auth';
import { setPreviousPath, setDisableAnalyticsCookie } from 'redux/modules/app';
import { setLoginCookieInvalid } from 'redux/modules/applePay';
import config from 'config';
import { asyncConnect } from 'redux-connect';
import { isAnalyticsDisabledRoute, isFromLineApp } from 'utils/routing';
import events from 'utils/events';
import analytics from 'helpers/analytics/Analytics';
import debounce from 'utils/debounce';
import If from 'components/uniqlo-ui/If';
import MessageBox from 'components/MessageBox';
import BacktoTop from 'components/BacktoTop';
import HeaderContainer from 'containers/Header';
import FooterContainer from 'containers/Footer';
import GlobalTicker from 'components/Ticker/GlobalTicker';
import LogoutConfirm from 'components/LogoutConfirm';
import MergeRevivalAlert from 'components/MergeRevivalAlert';
import Loading from 'components/LoadingIndicator';
import { ScrollContainer } from 'react-router-scroll';
import NavigateConfirm from 'components/NavigateConfirm';
import initConfiguration from './configurations';
import styles from './App.scss';

const { object, func, string, bool } = PropTypes;

function loadGtm() {
  // Google Tag Manager
  /* eslint-disable */
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-29C3G');
  /* eslint-enable */
  // End Google Tag Manager
}

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const promises = [];
    const presentState = getState();

    if (!isAuthLoaded(presentState)) {
      promises.push(dispatch(authLoad()));
    }

    return Promise.all(promises);
  },
}])
@connect(state => ({
  user: state.auth.user,
  url: state.auth.redirectUrl,
  isRouteLoading: state.app.isLoading,
  isXHr: state.app.isXHr,
}), { setPreviousPath, setDisableAnalyticsCookie, goToLogin, setLoginCookieInvalid })
@initConfiguration
@analytics
export default class App extends PureComponent {
  static propTypes = {
    children: object.isRequired,
    user: object,
    params: object,
    location: object,
    url: string,
    confirmLogout: func,
    cancelLogout: func,
    isRouteLoading: bool,
    isXHr: bool,
    setPreviousPath: func,
    setDisableAnalyticsCookie: func,
    goToLogin: func,
    setLoginCookieInvalid: func,
  };

  static contextTypes = {
    store: object.isRequired,
    i18n: object,
    router: object,
    config: object,
  };

  static childContextTypes = {
    routerContext: object,
    events: object.isRequired,
  };

  static defaultProps = {
    location: {},
  };

  state = {
    menuActive: false,
    isLoading: false,
    showLoginAlert: false,
  };

  getChildContext() {
    return {
      routerContext: {
        location: this.props.location,
        params: this.props.params,
        router: this.context.router,
      },
      events,
    };
  }

  componentDidMount() {
    events.register(document.querySelector('.safari .appContainer'));

    this.setLoading = debounce(this.setState, 100, this);
    this.shouldDisableAnalytics = isAnalyticsDisabledRoute();
    this.currentLocation = this.props.location.pathname;

    if (isFromLineApp()) {
      this.props.setDisableAnalyticsCookie();
    }

    if (!__DEVELOPMENT__ && !this.shouldDisableAnalytics) {
      loadGtm();
    }

    this.runLoginTimer(this.props);
    window.addEventListener('unhandledrejection', () => this.setLoading({ isLoading: false }));
    window.addEventListener('error', () => this.setLoading({ isLoading: false }));
  }

  componentWillReceiveProps(nextProps) {
    const routeChanged = nextProps.location !== this.props.location;

    if (routeChanged) {
      this.currentLocation = nextProps.location.pathname;
      this.props.setPreviousPath(this.props.location.pathname);
    }

    if (!this.authTime && nextProps.user && nextProps.user.authTime) {
      this.runLoginTimer(nextProps);
    } else if (!this.authTime) {
      this.props.setLoginCookieInvalid();
    }

    this.setLoading({ isLoading: !nextProps.isRouteLoading && nextProps.isXHr });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { state, props } = this;

    return (
      state.isLoading !== nextState.isLoading ||
      state.showLoginAlert !== nextState.showLoginAlert ||
      props.children !== nextProps.children ||
      props.location !== nextProps.location ||
      props.isRouteLoading !== nextProps.isRouteLoading
    );
  }

  componentWillUnmount() {
    clearInterval(this.loginTimer);
  }

  /**
   * This method will save current location in cookie and takes user to login page.
   * I am not resetting `state.showLoginAlert` to `false as we are navigating away
   * to an external site. When we come back it will be `false` anyway.
   */
  onLoginPress = () => this.props.goToLogin();

  runLoginTimer = (props) => {
    const { sensitive } = config.app;

    this.authTime = props.user ? ~~props.user.authTime * 1000 : 0;

    if (this.authTime) {
      this.loginTimer = setInterval(() => {
        const now = new Date();
        // show login alert only in checkout pages except order_confirm page
        const isCheckout = (/\/checkout/).test(this.currentLocation) && !(/\/checkout\/order\/confirm/).test(this.currentLocation);
        const isCart = (/\/cart/).test(this.currentLocation);

        if (now - this.authTime > sensitive.timeToForceLogin && (isCheckout || isCart)) {
          clearInterval(this.loginTimer);
          if (isCart) {
            this.props.setLoginCookieInvalid();
          } else {
            this.setState({ showLoginAlert: true });
          }
        }
      }, 100);
    }
  }

  render() {
    const { location, isRouteLoading, children } = this.props;
    const { isLoading, showLoginAlert } = this.state;
    const { i18n: { account } } = this.context;

    return (
      <ScrollContainer scrollKey="apple" >
        <div className="appContainer">
          <div className={styles.app}>
            <Helmet {...config.app.head} />
            <HeaderContainer />
            <GlobalTicker />
            <div className={styles.appContent}>
              { isRouteLoading ? <Loading /> : children }
            </div>
            <FooterContainer />
            <BacktoTop currentPage={location.pathname} distFromTop="2000" />
            <Loading show={isLoading} type="fullscreen" />
            <LogoutConfirm />
            <NavigateConfirm />
            <MergeRevivalAlert />
            <If
              if={showLoginAlert}
              then={MessageBox}
              rejectLabel={account.goToLoginPage}
              onAction={this.onLoginPress}
              message={account.loginAgainMsg}
              variation="completed"
            />
          </div>
        </div>
      </ScrollContainer>
    );
  }
}
