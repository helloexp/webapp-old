import React, { PropTypes } from 'react';
import Label from 'components/uniqlo-ui/Label';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import Heading from 'components/uniqlo-ui/Heading';
import Panel from 'components/Panel';
import { formatBirthDate } from 'utils/formatDate';
import classNames from 'classnames';
import styles from './styles.scss';

const { object, func } = PropTypes;

const FormLabel = ({ editAddress }, context) => {
  const { membershipInfo } = context.i18n;

  return (
    <div className={styles.editLabel} onClick={editAddress} >
      <Label
        className="formEditLabel"
        text={membershipInfo.edit}
      />
    </div>
  );
};

FormLabel.propTypes = {
  editAddress: func,
};

FormLabel.contextTypes = {
  i18n: object,
};

const renderField = (item, index, editAddress) => (
  <div className={styles.field} key={index}>
    <If
      if={index === 0}
      then={FormLabel}
      editAddress={editAddress}
    />
    <Heading className={styles.label} headingText={item.label} type="h5" />
    <Text className="blockText">{item.value}</Text>
  </div>
);

const MemberPanel = ({ user, defaultAddress, editAddress }, context) => {
  const { account, address, membershipInfo } = context.i18n;
  const panelClassname = classNames(styles.memberPanel, styles.memberContainer);

  const data = [
    { label: account.email, value: defaultAddress.email },
    { label: address.name, value: `${defaultAddress.lastName} ${defaultAddress.firstName}` },
    { label: membershipInfo.nameKana, value: `${defaultAddress.lastNameKatakana} ${defaultAddress.firstNameKatakana}` },
    { label: address.postalCode, value: `〒${defaultAddress.postalCode}` },
    { label: membershipInfo.prefecture, value: defaultAddress.prefecture },
    { label: address.street, value: defaultAddress.city },
    { label: address.streetNumber, value: defaultAddress.streetNumber },
    { label: membershipInfo.aptRoomNum, value: defaultAddress.apt },
    { label: address.phoneNumber, value: defaultAddress.phoneNumber },
    { label: address.cellPhoneNumber, value: defaultAddress.cellPhoneNumber },
    { label: address.gender.name, value: address.gender[defaultAddress.gender] },
    { label: membershipInfo.birthday, value: formatBirthDate(defaultAddress.birthday) },
  ];

  const renderFieldMap = data.map((item, index) => renderField(item, index, editAddress, membershipInfo));

  return (
    <Panel
      centerTitle
      subtitle
      className={panelClassname}
      fromMember
      title={membershipInfo.memberDetails}
      toggleable
      downArrow
    >
      {renderFieldMap}
    </Panel>
  );
};

MemberPanel.propTypes = {
  user: object,
  defaultAddress: object,
  editAddress: func,
};

MemberPanel.contextTypes = {
  i18n: object,
};

export default MemberPanel;
