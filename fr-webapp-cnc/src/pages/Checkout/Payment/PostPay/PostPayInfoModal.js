import React, { PropTypes } from 'react';
import Drawer from 'components/Drawer';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import Image from 'components/uniqlo-ui/Image';
import Link from 'components/uniqlo-ui/Link';
import styles from './styles.scss';
import externalLinkImage from './externalLink.png';

const { object, func, string } = PropTypes;

const PostPayInfoModal = ({ onCancel, brand }, context) => {
  const { i18n: { postPay: texts }, config: { aboutPostPay } } = context;

  return (
    <Drawer
      onCancel={onCancel}
      title={texts.infoHeading}
      variation="noFooter"
      className={styles.infoModal}
      styles={styles.infoModal}
      cartSpacing="cartSpacingTitle"
    >
      <Text className="blockText">{texts.instructions}</Text>
      <Heading className={styles.pleaseNoteHead} headingText={texts.pleaseNote} type="h4" />
      <Text className="blockText">{texts.postPayFee}</Text>
      <Text className="blockText">{texts.cvsWarning[brand]}</Text>
      <Text className="blockText">{texts.aboutPostPay}</Text>
      <Text className="blockText">{texts.postPayLimit}</Text>
      <Link className={styles.aboutPostPayLink} to={aboutPostPay} target="_blank">
        {texts.NPLinkText}
        <Image source={externalLinkImage} className={styles.linkImage} />
      </Link>
    </Drawer>
  );
};

PostPayInfoModal.propTypes = {
  onCancel: func,
  brand: string,
};

PostPayInfoModal.contextTypes = {
  i18n: object,
  config: object,
};

export default PostPayInfoModal;
