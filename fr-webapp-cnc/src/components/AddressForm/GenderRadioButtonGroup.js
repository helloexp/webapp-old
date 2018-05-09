import React, { PropTypes } from 'react';
import RadioButtonGroup from 'components/uniqlo-ui/core/RadioButtonGroup';
import RadioButton from 'components/uniqlo-ui/core/RadioButtonGroup/RadioButton';
import styles from './styles.scss';

export default function GenderRadioButtonGroup(props) {
  const {
    me,
    address,
    gender,
  } = props;

  return (
    <RadioButtonGroup name="Gender" onChange={() => me.setInputValue('gender')} valueSelected={gender || 'NOT_SPECIFIED'}>
      <RadioButton
        className={styles.genderRadioButton}
        id="GenderRadioButtonMale"
        label={address.gender.male}
        value="01"
      />
      <RadioButton
        className={styles.genderRadioButton}
        id="GenderRadioButtonFemale"
        label={address.gender.female}
        value="02"
      />
      <RadioButton
        className={styles.genderRadioButton}
        id="GenderRadioButtonNotSpecified"
        label={address.gender.others}
        value="NOT_SPECIFIED"
      />
    </RadioButtonGroup>
  );
}

const { object, string } = PropTypes;

GenderRadioButtonGroup.propTypes = {
  me: object,
  address: object,
  gender: string,
};
