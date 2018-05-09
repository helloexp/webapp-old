import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import Loading from 'components/LoadingIndicator';
import { loginOnGDS, initializeLoginPage } from 'redux/modules/account/auth';
import styles from './styles.scss';

const { bool, object, func } = PropTypes;

@connect(state => ({ ...state.auth }), {
  initializeLoginPage,
  loginOnGDS,
})
export default class Login extends Component {

  static propTypes = {
    initializeLoginPage: func,
    isLoading: bool,
    location: object,
    loginOnGDS: func,
    user: object,
  };

  static contextTypes = {
    i18n: object,
    router: object,
    config: object,
  };

  componentDidMount() {
    this.props.initializeLoginPage();
  }

  render() {
    const { account } = this.context.i18n;

    return (
      <div className={styles.accountLogin}>
        <Helmet title={account.login} />
        <Loading show type="fullscreen" />
      </div>
    );
  }
}
