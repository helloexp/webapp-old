/**
 * This component is out of scope or september. However, we might use it later,
 * please do not remove this file and please do not use this component, currently
 * it's not been used anywhere in the app.
 * https://redmine.fastretailing.com/issues/31145
 */

import React, { PropTypes } from 'react';
import Image from 'components/uniqlo-ui/Image';
import styles from './styles.scss';

const PreviewTooltip = ({ brand, message }, context) => {
  const { config: { brand: brandConfig } } = context;
  const logoProps = brand === 'uq'
    ? { source: brandConfig.logo, alternateText: brandConfig.name, className: `${styles.brand} ${styles.logo}` }
    : { source: brandConfig.guLogo, alternateText: brandConfig.guName, className: `${styles.guBrand} ${styles.logo}` };

  return (
    <div className={styles.giftToolTip}>
      <div className={styles.container}>
        <div className={styles.wrapLogo}>
          <Image {...logoProps} />
        </div>
        <div className={styles.wrapContent}>{message}</div>
      </div>
    </div>
  );
};

const { string } = PropTypes;

PreviewTooltip.propTypes = {
  brand: string,
  message: string,
};

PreviewTooltip.contextTypes = {
  config: PropTypes.object,
};

export default PreviewTooltip;
