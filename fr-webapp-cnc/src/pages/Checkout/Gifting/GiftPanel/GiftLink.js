import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { root } from 'utils/routing';
import Panel from 'components/Panel';
import Text from 'components/Atoms/Text';
import Link from 'components/uniqlo-ui/Link';
import styles from './styles.scss';

export default function GiftLink({ enabled, giftingUrl, title, lighterBoxShadow, className }) {
  return (
    <Panel
      className={classNames(className, styles.giftPanel, styles.giftPanelContainer, styles.giftContainer)}
      enabled={enabled}
      lighterBoxShadow={lighterBoxShadow}
      frame
    >
    <Link
      caret
      contentType="linkTab"
      to={`${root}/${giftingUrl}`}
      className={styles.giftLink}
      left
    >
      <span className={styles.icomoonGift} />
      <Text className={styles.textFont} size={1}>{title}</Text>
    </Link>
    </Panel>
  );
}

const { bool, string } = PropTypes;

GiftLink.propTypes = {
  enabled: bool,
  giftingUrl: string.isRequired,
  className: string,
  title: string,
  lighterBoxShadow: bool,
};
