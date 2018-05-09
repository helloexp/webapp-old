import React, { PropTypes, PureComponent } from 'react';
import Text from 'components/uniqlo-ui/Text';
import Link from 'components/uniqlo-ui/Link';
import { connect } from 'react-redux';
import { getTopPageCvsUrls, getAvailableCvsBrands } from 'redux/modules/checkout/delivery/selectors';
import { getBrand } from 'redux/modules/cart/selectors';
import constants from 'config/site/default';
import Drawer from 'components/Drawer';
import CVSAddressPanel from './CVSAddressPanel';

const { string, func, object } = PropTypes;

@connect(state => ({
  cvsUrls: getTopPageCvsUrls(state),
  availableCvsBrands: getAvailableCvsBrands(state),
  brand: getBrand(state),
}))

export default class CVSMenuOptions extends PureComponent {

  static propTypes = {
    removeCvsAddress: func,
    cvsUrls: object,
    cvsBrand: string,
    showCVSMenu: func,
    availableCvsBrands: object,
    findNewStoreTitle: string,
    brand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  onDeleteAddress = () => {
    this.props.removeCvsAddress(this.props.cvsBrand);
  }

  createStores = () => {
    const {
      cvsUrls,
      availableCvsBrands,
    } = this.props;

    return constants.cvsStoreNames.reduce((storeList, brand) => {
      if (availableCvsBrands[brand]) {
        const element = (
          <Link external to={cvsUrls[brand]} key={brand} className={brand} >
            <CVSAddressPanel url={cvsUrls[brand]} cvsBrand={brand} />
          </Link>
        );

        storeList.push(element);
      }

      return storeList;
    }, []);
  }

  render() {
    const { checkout } = this.context.i18n;
    const {
      showCVSMenu,
      findNewStoreTitle,
      brand,
    } = this.props;
    const storeList = this.createStores();

    return (
      <div>
        <Drawer
          onCancel={showCVSMenu}
          title={findNewStoreTitle}
          variation="noFooter"
        >
          <Text content={checkout.convenienceSubTitle[brand]} />
          {storeList}
        </Drawer>
      </div>
    );
  }
}
