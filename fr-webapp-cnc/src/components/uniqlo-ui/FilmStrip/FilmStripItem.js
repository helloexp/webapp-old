import React, { PropTypes, PureComponent } from 'react';
import noop from 'utils/noop';
import Link from 'components/uniqlo-ui/Link';
import { getCurrentHost } from 'utils/routing';
import Image from '../Image';
import FavoriteButton from '../FavoriteButton';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import styles from './FilmStripItem.scss';

const { string, bool, func, number, oneOfType, object } = PropTypes;

class FilmStripItem extends PureComponent {

  onFavoriteClick = () => {
    const { onFavoriteClick, styleId } = this.props;

    onFavoriteClick(styleId);
  };

  render() {
    const {
      imageSource,
      stripClassName,
      imageClassName,
      styleId,
      isFavorite,
      confirmNavigateAway,
      navigationTexts,
    } = this.props;
    const classNames = {
      container: mergeClasses(styles.filmStripItem, stylePropsParser(stripClassName, styles)),
      imageClass: stylePropsParser(imageClassName, styles),
    };
    const styleURL = this.context.config.STYLE_LIST_URL.replace('{%hostname}', getCurrentHost(false)).replace('{%id}', styleId);

    return (
      <div className={classNames.container}>
        <FavoriteButton isActive={isFavorite} className={styles.filmStripFavIcon} onClick={this.onFavoriteClick} />
        <Link
          to={styleURL}
          confirmNavigateAway={confirmNavigateAway}
          navigationTexts={navigationTexts}
        >
          <Image className={classNames.imageClass} source={imageSource} />
        </Link>
      </div>
    );
  }
}

FilmStripItem.propTypes = {
  imageSource: string,
  imageClassName: string,
  link: string,
  stripClassName: string,
  targetwindow: string,
  onTouchTap: func,
  active: bool,
  index: number,
  styleId: oneOfType([number, string]),
  isFavorite: bool,
  onFavoriteClick: func,
  confirmNavigateAway: bool,
  navigationTexts: object,
};

FilmStripItem.contextTypes = {
  config: object,
};

FilmStripItem.defaultProps = { onTouchTap: noop };

export default FilmStripItem;
