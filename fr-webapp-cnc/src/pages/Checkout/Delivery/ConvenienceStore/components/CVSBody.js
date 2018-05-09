import React, { PropTypes, PureComponent } from 'react';
import classNames from 'classnames';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import Link from 'components/uniqlo-ui/Link';
import { connect } from 'react-redux';
import constants from 'config/site/default';
import {
  getCvsUrls,
  getIfReturnCVSUser,
  getAvailableCvsBrands,
} from 'redux/modules/checkout/delivery/selectors';
import { getBrand } from 'redux/modules/cart/selectors';
import styles from './styles.scss';
import CVSAddressPanel from './CVSAddressPanel';
import CVSMenuOptions from './CVSMenuOptions';

const { object, bool, string } = PropTypes;
const convinenceOptionsClass = classNames('convenienceOptions', styles.pickupConvenience);

@connect(state => ({
  cvsUrls: getCvsUrls(state),
  isReturnCVSUser: getIfReturnCVSUser(state),
  availableCvsBrands: getAvailableCvsBrands(state),
  brand: getBrand(state),
}))

export default class CVSBody extends PureComponent {
  static propTypes = {
    isReturnCVSUser: bool,
    cvsUrls: object,
    availableCvsBrands: object,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
    config: object,
  };

  state = {
    displayCVSMenu: false,
  };

  showCVSMenu = () => {
    this.setState(prevState => ({
      displayCVSMenu: !prevState.displayCVSMenu,
    }));
  };

  createStoreList = () => {
    const {
      cvsUrls,
      availableCvsBrands,
    } = this.props;

    return constants.cvsStoreNames.reduce((storeList, brand) => {
      if (availableCvsBrands[brand]) {
        storeList.push(
          <Link external to={cvsUrls[brand]} key={brand} className={brand}>
            <CVSAddressPanel url={cvsUrls[brand]} cvsBrand={brand} />
          </Link>
        );
      }

      return storeList;
    }, []);
  }

  render() {
    const {
      props: {
        isReturnCVSUser,
        brand,
      },
      context: {
        i18n: {
          checkout: {
            convenienceInfo,
            convenienceSubTitle,
            convenienceAppVersionUp,
            convenienceHeading,
            convenienceTitle,
            convenienceDesc,
            convenienceText,
          },
          delivery: {
            findNewStoreTitle,
          },
        },
        config: {
          LINK_TO_CVS_GUIDE,
        },
      },
      createStoreList,
    } = this;

    let cvsDisplayInfo = {
      subTitle: convenienceSubTitle[brand],
      title: convenienceTitle,
    };

    if (isReturnCVSUser) {
      cvsDisplayInfo = {
        subTitle: convenienceInfo,
        title: convenienceHeading,
      };
    }

    const storeList = createStoreList();

    return (
      <Container className={convinenceOptionsClass}>
        <Text className={styles.convenienceMessage}>{convenienceDesc}</Text>
        <Link className={styles.convenienceCondition} to={LINK_TO_CVS_GUIDE[brand]} target="_blank">{convenienceText[brand]}</Link>
        <Heading className={styles.convinenceTitle} headingText={cvsDisplayInfo.title} type="h5" />
        <Text className={styles.convenienceStore}>{cvsDisplayInfo.subTitle}</Text>
        <Text className={styles.convenienceStoreAppVersionUp}>{convenienceAppVersionUp[brand]}</Text>
        {storeList}
        <If
          if={this.state.displayCVSMenu}
          then={CVSMenuOptions}
          showCVSMenu={this.showCVSMenu}
          findNewStoreTitle={findNewStoreTitle}
          onCancel={this.showCVSMenu}
        />
      </Container>
    );
  }
}
