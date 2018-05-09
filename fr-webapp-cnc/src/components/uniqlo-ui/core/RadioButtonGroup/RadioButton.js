import React, { PureComponent, PropTypes } from 'react';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import EnhancedSwitch from '../EnhancedSwitch';
import styles from './RadioButton.scss';

const {
  bool,
  string,
  oneOf,
  func,
} = PropTypes;

export default class RadioButton extends PureComponent {
  static propTypes = {
    checked: bool,
    disabled: bool,
    label: string,
    labelPosition: oneOf(['left', 'right']),
    onCheck: func,
    value: string,
    className: string,
    spaRadio: bool,
    leftLabel: string,
    rightLabel: string,
    bottomLabel: string,
    leftLabelClass: string,
    rightLabelClass: string,
    bottomLabelClass: string,
    id: string,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
  };

  static defaultProps = {
    onCheck: () => null,
  };

  handleCheck = (event) => {
    const { onCheck, value } = this.props;

    onCheck(event, value);
  };

  render() {
    const {
      label, disabled, checked, labelPosition, value, className, spaRadio, leftLabel, rightLabel, bottomLabel,
      leftLabelClass, rightLabelClass, bottomLabelClass, id, ...other
    } = this.props;

    const classNames = {
      container: mergeClasses(styles.radioButton, stylePropsParser(className, styles)),
      label: mergeClasses(styles.label, disabled ? styles.disabledLabel : ''),
      spaRadioContainer: mergeClasses(styles.radioButton, stylePropsParser(className, styles)),
      spaTopLabels: styles.spaTopLabels,
      leftLabel: mergeClasses(styles.spaLabel, styles.left, leftLabelClass, disabled ? styles.disabledLabel : ''),
      rightLabel: mergeClasses(styles.spaLabel, styles.right, rightLabelClass, disabled ? styles.disabledLabel : ''),
      bottomLabel: mergeClasses(styles.spaLabel, styles.bottom, bottomLabelClass, disabled ? styles.disabledLabel : ''),
    };

    const { switchId, labelHtmlFor } = id
      ? { switchId: { id }, labelHtmlFor: { htmlFor: id } }
      : { switchId: {}, labelHtmlFor: {} };

    const labelElement = label
      ? <label className={classNames.label} {...labelHtmlFor}>{label}</label>
      : null;

    const enhancedSwitchProps = {
      checked, disabled, value, inputType: 'radio', onSwitch: this.handleCheck,
    };

    if (spaRadio) {
      const spaRadioProps = {
        spaRadio,
      };

      return (
        <div className={classNames.spaRadioContainer}>
          <div className={classNames.spaTopLabels}>
            <EnhancedSwitch {...switchId} {...other} {...enhancedSwitchProps} {...spaRadioProps} />
            { leftLabel ? <label className={classNames.leftLabel}>
              {leftLabel}
            </label> : null
            }
            { rightLabel ? <label className={classNames.rightLabel}>
              {rightLabel}
            </label> : null
            }
            { bottomLabel ? <label className={classNames.bottomLabel}>
              {bottomLabel}
            </label> : null
            }
          </div>
        </div>
      );
    }

    const labelIsLeft = labelPosition && labelPosition.toUpperCase() === 'LEFT';

    return (
      <div className={classNames.container}>
        {labelIsLeft ? labelElement : null}
        <EnhancedSwitch {...other} {...switchId} {...enhancedSwitchProps} />
        {labelIsLeft ? null : labelElement}
      </div>
    );
  }
}
