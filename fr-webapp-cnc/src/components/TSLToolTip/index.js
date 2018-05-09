import React, { PropTypes } from 'react';
import ToolTip from 'components/uniqlo-ui/ToolTip';
import Text from 'components/uniqlo-ui/Text';
import Link from 'components/uniqlo-ui/Link';
import { checkUQNativeApp, checkGUNativeApp } from 'helpers/NativeAppHelper';
import styles from './styles.scss';

const { object } = PropTypes;

/**
 * Wrapper component for Lock Icon TLS Tooltip
 */
const TSLToolTip = (props, context) => {
  const { i18n: { common: { tslTooltip: { tooltipText, toolTipLinkText } } }, config: { ABOUT_TLS_URL, applePay } } = context;
  let aboutTLSLink = ABOUT_TLS_URL;

  if (checkUQNativeApp()) {
    aboutTLSLink = `${aboutTLSLink}?${applePay.browserFlag.uq}`;
  } else if (checkGUNativeApp()) {
    aboutTLSLink = `${aboutTLSLink}?${applePay.browserFlag.gu}`;
  }

  return (
    <ToolTip iconStyles={styles.lockIcon}>
      <Text className={styles.tooltipText}>{tooltipText}</Text>
      <Link to={aboutTLSLink} target="_blank" className={styles.tooltipLink}>{toolTipLinkText}</Link>
    </ToolTip>
  );
};

TSLToolTip.contextTypes = {
  i18n: object,
  config: object,
};

export default TSLToolTip;
