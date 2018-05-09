import React, { PropTypes } from 'react';
import Text from 'components/Atoms/Text';
import Link from 'components/Atoms/Link';
import cx from 'classnames';
import styles from './styles.scss';

/**
 * Get info icon
 * @param {String|Function} iconNavigation
 * @returns {*}
 */
function getIcon(iconNavigation) {
  switch (typeof iconNavigation) {
    case 'string':
      return <Link to={iconNavigation} className={styles.infoIcon} />;
    case 'function':
      return <span onClick={iconNavigation} className={styles.infoIcon} />;
    default:
      return null;
  }
}

/**
 * Heading with information icon
 * Icon will be shown in case iconNavigation defined
 * @param {String} text
 * @param {String|Function} iconNavigation - url or callback function
 * @param {Object} infoToolTip - <InfoToolTip> if you want to show it instead of iconNavigation, or null.
 * @param {String} className - to extend
 * @param {Boolean} isPageHeading - for page heading will be applied additional styles
 * @return {Function}
 * @constructor
 */
const HeadingInfo = ({ text, iconNavigation, className, isPageHeading, infoToolTip }) => (
  <div className={cx(styles.container, className)}>
    <Text size={isPageHeading ? 4 : 0} className={styles.heading} weight="bolder">{text}</Text>
    { infoToolTip || getIcon(iconNavigation) }
  </div>
);

HeadingInfo.propTypes = {
  text: PropTypes.string.isRequired,
  iconNavigation: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  className: PropTypes.string,
  isPageHeading: PropTypes.bool,
  infoToolTip: PropTypes.object,
};

export default HeadingInfo;
