import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import FilmStripItem from './FilmStripItem';
import Swipable from '../core/Swipable';
import styles from './FilmStrip.scss';
import Heading from '../Heading';

const { string, func, number, oneOfType, array, object, bool } = PropTypes;

const stylesReducer = (accumulator, currentValue) => [...accumulator, ...currentValue];

export default class FilmStrip extends PureComponent {
  static propTypes = {
    link: string,
    onTouchTap: func,
    limit: number,
    itemsSpace: number,
    children: oneOfType([array, object]),
    styleData: object,
    headingText: string,
    headingStyle: string,
    headingType: string,
    wishlist: array,
    onFavoriteClick: func,
    confirmNavigateAway: bool,
    navigationTexts: object,
  };

  static contextTypes = {
    compConfig: object,
  };

  static defaultProps = {
    itemsSpace: 0.5,
    headingType: 'h3',
  };

  getFilmStripContent = () => {
    const {
      children,
      itemsSpace,
      styleData,
      onTouchTap,
      headingText,
      headingStyle,
      headingType,
      onFavoriteClick,
      wishlist,
      confirmNavigateAway,
      navigationTexts,
    } = this.props;

    let imageDetails = null;

    if (styleData) {
      const productImages = Object.values(styleData).reduce(stylesReducer, []);

      imageDetails = productImages.map((image, index) => {
        const { styleId, styleImgUrl } = image;
        const isFavorite = !!wishlist.find(id => id === styleId);

        return (
          <FilmStripItem
            imageSource={styleImgUrl.replace('.jpg', '-l.jpg')}
            index={index}
            key={index}
            onImageTap={() => onTouchTap(styleId)}
            styleId={styleId}
            onFavoriteClick={onFavoriteClick}
            isFavorite={isFavorite}
            confirmNavigateAway={confirmNavigateAway}
            navigationTexts={navigationTexts}
          />
        );
      });
    } else {
      imageDetails = React.Children.map(children, child => React.cloneElement(child, { onTouchTap }));
    }

    return imageDetails && imageDetails.length ? (
      <div>
        { headingText && <Heading className={classNames(styles.heading, styles[headingStyle])} headingText={headingText} type={headingType} /> }
        <Swipable activeTranslation className="filmStrip" itemsSpace={itemsSpace}>{ imageDetails }</Swipable>
      </div>
    ) : null;
  };

  render() {
    return this.getFilmStripContent();
  }
}
