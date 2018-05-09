import React, { PropTypes } from 'react';
import Panel from 'components/Panel';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Heading from 'components/uniqlo-ui/Heading';
import AddressPanel from 'components/AddressPanel';
import styles from './styles.scss';

const AddConfirmation = (props, context) => {
  const { account, common } = context.i18n;
  const {
    backToAddressEntry,
    onCompletion,
    address,
    onBackToMemberInfo,
  } = props;

  return (
    <div className={styles.accountAddress}>
      <Heading className="mainHeaderHrule" headingText={account.addConfirmHeader} type="h2" />
      <Panel className={styles.addressFrame} frame>
        <Text className="blockText">{account.addConfirmText}</Text>
        <AddressPanel {...address} fromAccount />
        <Button
          className="secondary medium"
          label={common.ok}
          onTouchTap={onCompletion}
        />
        <Button
          className="default medium boldWithBorder"
          label={account.backToEntry}
          onTouchTap={backToAddressEntry}
        />
      </Panel>
      <Button
        className="default medium boldWithBorder"
        label={account.backToInfo}
        onTouchTap={onBackToMemberInfo}
      />
    </div>
  );
};

const { func, object } = PropTypes;

AddConfirmation.propTypes = {
  backToAddressEntry: func,
  onCompletion: func,
  address: object,
  onBackToMemberInfo: func,

};

AddConfirmation.contextTypes = {
  i18n: object,
  router: object,
};

export default AddConfirmation;
