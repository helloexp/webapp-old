import React, { PropTypes, PureComponent } from 'react';
import classNames from 'classnames/bind';
import Text from 'components/uniqlo-ui/Text';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import If from 'components/uniqlo-ui/If';
import { getCvsStoreAddresses, shouldShowCvsArrivesAt } from 'redux/modules/checkout/delivery/selectors';
import { connect } from 'react-redux';
import styles from './styles.scss';
import FooterButtons from './FooterButtons';
import StoreAddressDetails from './StoreAddressDetails';

const sejLogo = require('../images/seveneleven-logo.png');
const lawsonLogo = require('../images/lawsonministop.jpg');
const fmLogo = require('../images/familymart_logo.gif');
const lawsonLogoTrailing = require('../images/loppi.jpg');

const logoImages = {
  sevenEleven: sejLogo,
  lawson: lawsonLogo,
  familyMart: fmLogo,
};
const cx = classNames.bind(styles);

const { object, string, func, bool } = PropTypes;

@connect((state, props) => ({
  storeAddress: getCvsStoreAddresses(state),
  showArrivesAt: shouldShowCvsArrivesAt(state, props),
}))

export default class CVSAddressPanel extends PureComponent {

  static propTypes = {
    storeAddress: object,
    arrivesAt: string,
    removeCvsAddress: func,
    cvsBrand: string,
    showAddress: bool,
    showArrivesAt: bool,
  };

  static contextTypes = {
    i18n: object,
  };

  static defaultProps = {
    showAddress: false,
  };

  render() {
    const { delivery, checkout } = this.context.i18n;
    const { removeCvsAddress, storeAddress, arrivesAt, cvsBrand, showAddress, showArrivesAt } = this.props;
    const addressToDisplay = storeAddress[cvsBrand];
    const showStoreAddress = showAddress && addressToDisplay;
    const storeImageClass = cx({
      convenienceStoreImg: true,
      storeImage: addressToDisplay,
    });
    const trailingImageClass = cx({
      convenienceStoreImg: true,
      storeImage: true,
      trailingImage: true,
    });

    const convenienceStoreContainerClass = cx('blockText', {
      convenienceStore: true,
      cvsBrandTitle: true,
      convenienceStoreHeader: addressToDisplay,
    });

    const containerClass = showAddress && cvsBrand || '';
    const caretIconComponent = () => <span className={styles.caretRight} />;

    return (
      <Container className={`${styles.convenienceContainer} ${containerClass}`}>
        <Container className={styles.convenienceStoreContainer}>
          <Image
            className={storeImageClass}
            source={logoImages[cvsBrand]}
          />
          <Container className={styles.contentWrapper}>
            <Text className={convenienceStoreContainerClass}>
              {delivery[cvsBrand === 'lawson' ? 'lawsonMinistop' : cvsBrand]}
            </Text>
            <If
              if={showStoreAddress}
              then={StoreAddressDetails}
              storeAddress={addressToDisplay}
              cvsBrand={cvsBrand}
            />
            <If
              if={showArrivesAt}
              then={Text}
              content={checkout.standardDeliveryDateWithSeparator + arrivesAt}
            />
          </Container>
          <If
            if={cvsBrand === 'lawson'}
            then={Image}
            source={lawsonLogoTrailing}
            className={trailingImageClass}
          />
          <If
            if={!showStoreAddress}
            then={caretIconComponent}
          />
        </Container>
        <If
          if={showStoreAddress}
          removeCvsAddress={removeCvsAddress}
          then={FooterButtons}
          cvsBrand={cvsBrand}
        />
      </Container>
    );
  }
}
