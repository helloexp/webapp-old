import React, { PropTypes, PureComponent } from 'react';
import config from 'config';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import * as cartActions from 'redux/modules/cart';
import * as authActions from 'redux/modules/account/auth';
import { prependRoot } from 'utils/routing';
import { routes } from 'utils/urlPatterns';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Link from 'components/uniqlo-ui/Link';
import styles from './Home.scss';

const logoImage = require('images/logo.png');

const { string, object, func } = PropTypes;

@connect(
  state => ({
    ...state.cart.uq,
    user: state.auth.user,
  }),
  {
    ...cartActions,
    logout: authActions.logout,
    saveAndRedirectToLogin: authActions.saveAndRedirectToLogin,
  }
)
export default class Home extends PureComponent {
  static propTypes = {
    params: object,
    user: object,
    cartNumber: string,
    token: string,
    logout: func,
    saveAndRedirectToLogin: func,
  };

  static contextTypes = {
    config: object,
  };

  render() {
    const { props } = this;
    const { cartNumber, token, saveAndRedirectToLogin, user } = props;
    // require the logo image both from client and server
    /* eslint-disable max-len */
    const eMapUrl = 'http://www.e-map.ne.jp/smt/711map/s.htm?addr=%E6%9D%B1%E4%BA%AC%E9%83%BD&p_s1=40017&p_s2=http://localhost:3000/jp/checkout/delivery&p_s3=http://localhost:3000/jp/checkout/delivery&p_s4=012345';
    /* eslint-enable max-len */

    return (
      <div className={styles.home}>
        <Helmet title="Home" />
        <div className={styles.masthead}>
          <div className="container">
            <div className={styles.logo}>
              <img alt="presentation" src={logoImage} />
            </div>
            <h1>{config.app.title}</h1>
            <div>{config.app.description}</div>
          </div>
        </div>

        <div className="container">
          <div className={styles.counterContainer}>
            <div>Hello {config.app.title}</div>
          </div>

          <Container className="tile">
            <Text className="blockText">Current UQ cart number and token.</Text>
            <Text className="blockText">Cart number: {cartNumber}</Text>
            <Text className="blockText">Cart token: {token}</Text>
          </Container>
          <Container className="tile">
            <Text className="blockText">Login sample! You will be taken to the login form on accont platform, you can create a new user from there.</Text>
            <Button
              className="secondary medium"
              label="Login!"
              onTouchTap={() => saveAndRedirectToLogin()}
            />
          </Container>
          <Container className="tile">
            <Text className="blockText">Loging out sample</Text>
            <Text className="blockText">When loging out the access token and cart token are removed form cookies.</Text>
            {
              Object.keys(user || {}).map((field, index) =>
                <Text className="blockText" key={index}><strong>{field}</strong>: {user[field]}</Text>
              )
            }
            <Button
              className="secondary medium"
              label="Logout!"
              onTouchTap={this.props.logout}
            />
          </Container>

          <hr />
          <Link to={prependRoot(routes.addToCart)}> Add to cart</Link>
          <hr />
          <Link to={prependRoot(routes.cart)}> Cart </Link>
          <hr />
          <Link to={prependRoot(routes.delivery)}> Delivery </Link>
          <hr />
          <Link to={eMapUrl}>
            Sample Link component for testing redirect to www.e-map.ne.jp
          </Link>
        </div>
      </div>
    );
  }
}
