import React, { PropTypes } from 'react';
import noop from 'utils/noop';
import Panel from 'components/Panel';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Icon from 'components/uniqlo-ui/core/Icon';
import Image from 'components/uniqlo-ui/Image';
import Container from 'components/uniqlo-ui/core/Container';
import Link from 'components/uniqlo-ui/Link';
import Heading from 'components/uniqlo-ui/Heading';
import styles from './completion.scss';

const Completion = (props, context) => {
  const { account } = context.i18n;
  const {
    isHeaderLabel,
    backToAddressList,
    description,
    isNewAddress,
    subDescription,
    toUniqloTop,
    toggleMySizeScreen,
  } = props;

  const completionHeader = isHeaderLabel ? account.completionHeaderEdit : account.completionHeaderDelete;
  const completionView = isNewAddress
    ? (<div className={styles.newAddressCompletion}>
      <Text className={`blockText ${styles.completionText}`}>{description}</Text>
      <Panel className={styles.zeroBottom} frame>
        <Container className={styles.completionContainer}>
          <Text className="blockText">{subDescription}</Text>
          <Button
            className="default medium boldWithBorder"
            label={account.uniqloTop}
            onTouchTap={toUniqloTop}
          />
        </Container>
        <div className={styles.sizeHeading} onClick={toggleMySizeScreen}>
          <Text className={styles.sizeTitle}>
            {account.createMySize}
          </Text>
          <Icon
            className="iconChevronRightSmall"
            styleClass={styles.sizeArrow}
          />
        </div>
      </Panel>
      <Container className="z3">
        <Link to="">
          <Image className={styles.completionBanner} source="" />
        </Link>
      </Container>
    </div>)
    : (<div className={styles.addressCompletion}>
      <Container className={styles.addressCompletionDescription}>
        <Text className="blockText">{description}</Text>
      </Container>
      <Container className={styles.backToAddress}>
        <Button
          className="default medium boldWithBorder"
          label={account.backToAddress}
          labelClass={styles.buttonLabel}
          onTouchTap={backToAddressList}
        />
      </Container>
    </div>);

  return (
    <Container className={styles.completion}>
      <Container className={styles.completionHeadWrapper}>
        <Heading
          className={`mainHeaderHrule ${styles.completionHeader}`}
          headingText={completionHeader}
          type="h2"
        />
        {
          isNewAddress
          ? <Button className={styles.completionInfoButton}>
            <Icon className="iconInfo" styleClass={styles.completionInfo} />
          </Button>
          : null
        }
      </Container>
      {completionView}
    </Container>
  );
};

const { string, func, object, bool } = PropTypes;

Completion.propTypes = {
  description: string,
  backToAddressList: func,
  isNewAddress: bool,
  subDescription: string,
  toUniqloTop: func,
  toggleMySizeScreen: func,
  handleSizeNameChange: func,
  disabledAccept: bool,
  isHeaderLabel: bool,
};

Completion.defaultProps = {
  backToAddressList: noop,
  toUniqloTop: noop,
};

Completion.contextTypes = {
  i18n: object,
  router: object,
};

export default Completion;
