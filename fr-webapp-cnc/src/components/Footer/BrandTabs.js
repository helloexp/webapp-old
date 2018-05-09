import React, { PureComponent, PropTypes } from 'react';
import { brandName } from 'config/site/default';
import cx from 'classnames';
import Button from 'components/uniqlo-ui/Button';
import tabJpImage from 'pages/Account/MembershipInfo/images/jp-logo.png';
import tabGuImage from 'pages/Account/MembershipInfo/images/gu-logo.png';
import styles from './style.scss';

/**
 * Footer brand tabs section
 * @export
 * @class BrandTabs
 * @extends {PureComponent}
 */
export default class BrandTabs extends PureComponent {
  static propTypes = {
    brand: PropTypes.oneOf([brandName.uq, brandName.gu]).isRequired,
    changeFooterBrand: PropTypes.func.isRequired,
  };

  static contextTypes = {
    config: PropTypes.object,
    i18n: PropTypes.object,
  };

  /**
   * Check if tab brand same as selected brand
   * @memberof BrandTabs
   * @param {string} brand
   * @returns {boolean}
   */
  isActive = brand =>
    this.props.brand === brand;

  /**
   * Switch to UQ brand action
   * @memberof BrandTabs
   */
  switchToUQ = () => {
    if (!this.isActive(brandName.uq)) {
      this.props.changeFooterBrand(brandName.uq);
    }
  };

  /**
   * Switch to GU brand action
   * @memberof BrandTabs
   */
  switchToGU = () => {
    if (!this.isActive(brandName.gu)) {
      this.props.changeFooterBrand(brandName.gu);
    }
  };

  render() {
    return (
      <div className={styles.tabs}>
        <Button
          onTouchTap={this.switchToUQ}
          className={cx(styles.tabButton, { [styles.isActive]: this.isActive(brandName.uq) })}
        >
          <img src={tabJpImage} className={styles.image} role="presentation" />
        </Button>
        <Button
          onTouchTap={this.switchToGU}
          className={cx(styles.tabButton, { [styles.isActive]: this.isActive(brandName.gu) })}
        >
          <img src={tabGuImage} className={styles.image} role="presentation" />
        </Button>
      </div>
    );
  }
}
