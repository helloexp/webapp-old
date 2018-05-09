/**
 * This is numeric Input that allows decimal numbers
 * No other characters will be registered
 */
import React from 'react';
import Input from 'components/Atoms/Input';

const alreadyHasDot = /[.]/;

const allowNumbers = (event) => {
  const charCode = (event.which) ? event.which : event.keyCode;
  const duplicateDot = (!!alreadyHasDot.exec(event.target.value) || !event.target.value) && charCode === 46;

  if (duplicateDot || charCode > 31 && (charCode !== 46 && (charCode < 48 || charCode > 57))) {
    event.stopPropagation();
    event.preventDefault();

    return false;
  }

  return true;
};

const numberField = {
  type: 'number',
  pattern: '^[0-9][.]{1}*',
  step: '0.01',
  onKeyPress: allowNumbers,
};

export default function NumericField(props) {
  return (
    <Input
      {...numberField}
      {...props}
    />
  );
}
