import React, { PropTypes } from 'react';
import classnames from 'classnames';
import noop from 'utils/noop';
import favOn from 'images/favorite-on.svg';
import favOff from 'images/favorite-off.svg';
import Image from 'components/uniqlo-ui/Image';
import styles from './styles.scss';

const { bool, func, string } = PropTypes;

const FavoriteButton = props => (
  <Image
    source={props.isActive ? favOn : favOff}
    className={classnames(
      styles.favoriteIcon,
      props.className,
    )}
    onClick={props.onClick}
  />
);

FavoriteButton.defaultProps = {
  onClick: noop,
};

FavoriteButton.propTypes = {
  isActive: bool,
  onClick: func,
  className: string,
};

export default FavoriteButton;
