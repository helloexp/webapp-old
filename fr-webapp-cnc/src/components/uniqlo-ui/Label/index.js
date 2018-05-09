import React, { PureComponent, PropTypes } from 'react';
import { mergeClasses } from '../helpers/utils/stylePropable';
import stylePropsParser from '../helpers/utils/stylePropParser.js';
import styles from './Label.scss';

const { string } = PropTypes;

export default class Label extends PureComponent {

  static propTypes = {
    className: string,
    id: string,
    text: string.isRequired,
  };

  render() {
    const {
      className,
      text,
      } = this.props;

    const classNames = mergeClasses(styles.label, stylePropsParser(className, styles));

    return (
      <div className={classNames}>
        {text}
      </div>
    );
  }

}
