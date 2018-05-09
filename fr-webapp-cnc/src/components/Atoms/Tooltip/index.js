import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import styles from './styles.scss';

const { string, any, oneOf, func } = PropTypes;

export default class Tooltip extends PureComponent {
  static propTypes = {
    heading: string,
    children: any,
    type: oneOf(['info', 'error']),
    position: oneOf(['top', 'bottom']),
    alignment: oneOf(['left', 'center', 'right']),
    className: string,
    onClick: func,
  };

  static defaultProps = {
    type: 'info',
    position: 'top',
    alignment: 'center',
  };

  render() {
    const { children, heading, type, position, alignment, className, onClick } = this.props;

    return (
      <div className={cx(styles.container, styles[type], styles[position], styles[alignment], className)} onClick={onClick}>
        { heading && <div className={styles.heading}>{ heading }</div> }
        { children }
      </div>
    );
  }
}
