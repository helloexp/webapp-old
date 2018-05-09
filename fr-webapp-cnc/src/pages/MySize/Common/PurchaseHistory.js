import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Link from 'components/uniqlo-ui/Link';
import AtomLink from 'components/Atoms/Link';
import ImagePlusText from 'components/uniqlo-ui/ImagePlusText';
import Swipable from 'components/uniqlo-ui/core/Swipable';
import { getTransactions } from 'redux/modules/mySize/selectors';
import { loadPurchaseHistory } from 'redux/modules/account/purchaseHistory';
import { getBrand } from 'redux/modules/cart/selectors';
import { root, getCurrentHost } from 'utils/routing';
import Text from 'components/Atoms/Text';
import spacing from 'theme/spacing.scss';
import cx from 'classnames';
import ItemText from './ItemText';
import styles from './PurchaseHistory.scss';

const { object, func, array, string } = PropTypes;

/**
 * Carousel
 */
const Carousel = ({ transactions, brand }, { i18n: { mySize: mySizeLabels }, config }) => (
  <div className={styles.carouselWrapper}>
    <Text size={3} className={cx(spacing.PVL, spacing.MHM)} weight="bolder">{mySizeLabels.purchaseHeading}</Text>
    <Swipable activeTranslation pan className={spacing.PBM}>
      {
        transactions.map((transaction) => {
          const { colorCode } = transaction;
          const image = transaction.image.family;
          const imgUrl = image && image.urls && image.urls[colorCode];
          const url = `${root}/store/goods/${transaction.onlineID}`;
          const text = <ItemText mySizeLabels={mySizeLabels} transaction={transaction} />;

          // intentionally using <a> instead of <Link> because router doesn't recognize
          // the external PDP
          return (
            <Link to={url} noRouter key={transaction.tran_no}>
              <ImagePlusText
                className={styles.swipeContainer}
                header={transaction.ec_name}
                imageSrc={imgUrl}
                key={transaction.SKU}
                text={text}
                variation="imageTop"
              />
            </Link>
          );
        })
      }
    </Swipable>
    <div className={cx(spacing.MHM, spacing.MTL)}>
      <AtomLink
        to={config.purchaseHistory[brand].replace('{%hostname}', getCurrentHost(false))}
        type={AtomLink.type.secondary}
      >
        <Text type={Text.type.inline} size={1} weight="bolder">{mySizeLabels.showMore}</Text>
      </AtomLink>
    </div>
  </div>
);

Carousel.propTypes = {
  transactions: array,
  brand: string,
};

Carousel.contextTypes = {
  i18n: object,
  config: object,
};

@connect(state => ({
  transactions: getTransactions(state),
  brand: getBrand(state),
}), {
  loadPurchaseHistory,
})
export default class PurchaseHistory extends PureComponent {
  static contextTypes = {
    i18n: object,
    config: object,
  };

  static propTypes = {
    transactions: array,
    loadPurchaseHistory: func,
    brand: string,
  };

  componentDidMount() {
    this.props.loadPurchaseHistory(20);
  }

  render() {
    const { transactions, brand } = this.props;
    const isEmpty = !transactions || !transactions.length;

    return isEmpty
      ? null
      : <Carousel transactions={transactions} brand={brand} />;
  }
}
