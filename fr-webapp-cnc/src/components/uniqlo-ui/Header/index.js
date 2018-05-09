import React from 'react';
import Icon from '../core/Icon';
import styles from './Header.scss';

const Header = () => {
  const classNames = {
    iconContainer: styles.iconContainer,
  };

  return (
    <div className={classNames.iconContainer}>
      <Icon className="iconUniqloLogo" />
    </div>
  );
};

export default Header;
