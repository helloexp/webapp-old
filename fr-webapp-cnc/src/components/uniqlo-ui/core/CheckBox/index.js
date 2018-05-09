import React, { PureComponent, PropTypes } from 'react';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import EnhancedSwitch from '../EnhancedSwitch';
import styles from './CheckBox.scss';

const { bool, string, oneOf, func } = PropTypes;

export default class CheckBox extends PureComponent {
  static propTypes = {
    checked: bool,
    disabled: bool,
    label: string,
    labelClass: string,
    labelPosition: oneOf(['left', 'right']),
    onCheck: func,
    value: string,
    className: string,
    id: string,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    onCheck: () => null,
    labelPosition: 'right',
  };

  handleCheck = (event) => {
    const { onCheck, value } = this.props;

    onCheck(event, value);
  };

  render() {
    const {
      label, disabled, checked, labelPosition, value, className, labelClass, id, ...other
    } = this.props;

    const containerClassNames = mergeClasses(styles.checkBox, stylePropsParser(className, styles));

    const { switchId, labelHtmlFor } = id
      ? { switchId: { id }, labelHtmlFor: { htmlFor: id } }
      : { switchId: {}, labelHtmlFor: {} };

    const labelElement = label
      ? <label className={`${styles.label} ${labelClass}`} {...labelHtmlFor}>{label}</label>
      : null;

    const enhancedSwitchProps = {
      checked, disabled, value, inputType: 'checkbox', onSwitch: this.handleCheck,
    };

    const isLabelLeft = labelPosition.toUpperCase() === 'LEFT';

    return (
      <div className={containerClassNames}>
        {isLabelLeft ? labelElement : null}
        <EnhancedSwitch {...switchId} {...other} {...enhancedSwitchProps} />
        {isLabelLeft ? null : labelElement}
      </div>
    );
  }
}
