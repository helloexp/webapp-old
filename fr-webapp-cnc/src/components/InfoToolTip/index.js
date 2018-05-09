import React, { PropTypes } from 'react';
import ToolTip from 'components/uniqlo-ui/ToolTip';
import stylePropsParser from 'components/uniqlo-ui/helpers/utils/stylePropParser';
import classNames from 'classnames';
import styles from './styles.scss';

const InfoToolTip = ({ className, heading, children, position }) => {
  const containerClass = className ? stylePropsParser(className, styles).join(' ') : '';

  return (
    <ToolTip
      className={classNames(styles.iconToolTip, containerClass)}
      iconClassName="iconInfo"
      iconStyles={styles.infoIcon}
      heading={heading}
      position={position}
    >
      {children}
    </ToolTip>
  );
};

InfoToolTip.propTypes = {
  heading: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
  position: PropTypes.oneOf(['top', 'bottom', 'auto']),
};

export default InfoToolTip;
