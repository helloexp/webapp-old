import React, { PureComponent, PropTypes } from 'react';
import { toDoubleDigit } from 'utils/formatDate';
import Select from 'components/Atoms/Select';
import styles from './dateSelector.scss';

function getYears() {
  const years = [];
  const presentYear = new Date().getFullYear();

  for (let year = presentYear; year > 1916; year--) {
    years.push(year);
  }

  return years;
}

function getMonths() {
  const months = [];

  for (let month = 1; month < 13; month++) {
    months.push(toDoubleDigit(month));
  }

  return months;
}

function getDays() {
  const days = [];

  for (let day = 1; day < 32; day++) {
    days.push(toDoubleDigit(day));
  }

  return days;
}

const { object, string } = PropTypes;

export default class DateSelector extends PureComponent {
  static propTypes = {
    address: object,
    me: object,
    year: string,
    month: string,
    day: string,
  };

  constructor(props) {
    super(props);
    const { me } = this.props;

    this.setYear = me.setInputValue.bind(me, 'year');
    this.setMonth = me.setInputValue.bind(me, 'month');
    this.setDay = me.setInputValue.bind(me, 'day');
  }

  render() {
    const { address } = this.props;

    return (
      <div className={styles.selects}>
        <Select
          value={this.props.year}
          values={getYears()}
          label={address.birthday}
          onChange={this.setYear}
          className={styles.year}
        />
        <Select
          value={this.props.month}
          values={getMonths()}
          onChange={this.setMonth}
          className={styles.month}
        />
        <Select
          value={this.props.day}
          values={getDays()}
          onChange={this.setDay}
          className={styles.day}
        />
      </div>
    );
  }
}
