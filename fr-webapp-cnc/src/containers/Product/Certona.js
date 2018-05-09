import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { ProductCertonaCarousel } from 'components/Product';
import * as certonaActions from 'redux/modules/certona';
import * as wishlistActions from 'redux/modules/wishlist/actions';
import getProperty from 'utils/getProperty';

const { object, func, string, bool, array } = PropTypes;

function getContent(types, recommendations, wishlist, toggleWishlist, pageType, brand) {
  if (!(types && recommendations)) {
    return null;
  }

  const carousels = types.reduce((acc, type, index) => {
    if (recommendations[type]) {
      acc.push(
        <ProductCertonaCarousel
          items={recommendations[type]}
          headingStyle={pageType === 'CART' ? 'smallSpacingHeading' : ''}
          key={`${type}_${index}`}
          {...{ type, wishlist, toggleWishlist, brand }}
        />
      );
    }

    return acc;
  }, []);

  return (
    <div className="certonaContainer">
      {carousels}
    </div>
  );
}

@connect(
  (state, props) => ({
    items: getProperty(state, 'certona.items', {}),
    wishlist: state.wishlist.all[props.brand].products,
  }),
  {
    loadCertonaRecommendations: certonaActions.loadCertonaRecommendations,
    toggleWishlist: wishlistActions.toggleWishlist,
  }
)
export default class Certona extends Component {
  static propTypes = {
    brand: string,
    onlineId: string,
    loadCertonaRecommendations: func,
    type: string,
    multiple: bool,
    pageType: string,
    containerId: string,
    items: object,
    wishlist: array,
    toggleWishlist: func,
  };

  static contextTypes = {
    routerContext: object,
  };

  componentWillMount() {
    const { props: { loadCertonaRecommendations, onlineId, items, containerId, pageType, multiple } } = this;

    const id = multiple ? onlineId : containerId && items[containerId] && items[containerId].onlineId || containerId;

    if (id) {
      loadCertonaRecommendations(id, multiple, pageType).then(() => !this.isUnmounted && this.forceUpdate());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { props: { loadCertonaRecommendations, onlineId, containerId, pageType, multiple } } = this;

    if (!multiple && (nextProps.onlineId !== onlineId || nextProps.containerId !== containerId)) {
      const { containerId: nextContainerId, items: newItems, onlineId: nextOnlineId } = nextProps;
      const id = nextContainerId && newItems[nextContainerId] && newItems[nextContainerId].onlineId || nextOnlineId;

      if (id) {
        loadCertonaRecommendations(id, false, pageType);
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    const { items, containerId, wishlist } = this.props;
    const nextContainer = nextProps.items[containerId];
    const currentContainer = items[containerId];
    const nextWishlist = nextProps.wishlist;

    // Very complex, but it does the following: makes sure to only render if new items are fetched
    // AND they have recommendations loaded for them as well
    // Once this happened (and only once), this will always return false.
    // also, if wishlist changes, we need to update
    return !!((wishlist.length !== nextWishlist.length) || (((Object.keys(items).length !== Object.keys(nextProps.items).length)
      || (Object.keys(items).length === Object.keys(nextProps.items).length) && currentContainer && !currentContainer.recommendations.alsoBought.length)
      && nextContainer && nextContainer.recommendations.alsoBought.length));
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  toggleWishlist = id => this.props.toggleWishlist('products', id, this.props.brand);

  render() {
    const {
      type = 'alsoLooked,alsoBought',
      items,
      containerId,
      wishlist,
      pageType,
      brand,
    } = this.props;

    const item = items[containerId];

    if (item) {
      const { recommendations } = items[containerId];

      return getContent(type.split(','), recommendations, wishlist, this.toggleWishlist, pageType, brand);
    }

    return null;
  }
}
