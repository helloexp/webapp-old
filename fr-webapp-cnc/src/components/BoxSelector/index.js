import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import Container from 'components/uniqlo-ui/core/Container';
import Text from 'components/uniqlo-ui/Text';
import Radio from 'components/Atoms/Radio';
import CheckBox from 'components/Atoms/CheckBox';
import TSLToolTip from 'components/TSLToolTip';
import If from 'components/uniqlo-ui/If';
import InfoToolTip from 'components/InfoToolTip';
import noop from 'utils/noop';
import { isFreeShippingText } from 'utils/deliveryUtils';
import styles from './styles.scss';

function renderInfoToolTip({ toolTipHeader, toolTiptext }) {
  return (
    <If if={toolTiptext}>
      <InfoToolTip childNode className={styles.toolTip} heading={toolTipHeader}>
        <Text>{toolTiptext}</Text>
      </InfoToolTip>
    </If>
  );
}

renderInfoToolTip.propTypes = {
  toolTipHeader: PropTypes.string,
  toolTiptext: PropTypes.string,
};

const { string, bool, func, node, any } = PropTypes;

export default class BoxSelector extends PureComponent {
  static propTypes = {
    changeByProps: bool,
    checked: bool,
    children: node,
    description: string,
    descriptionStyle: string,
    enabled: bool,
    label: string,
    labelStyle: string,
    name: string,
    onChange: func,
    price: string,
    applyNoPriceStyle: bool,
    priceStyle: string,
    rightIcon: string,
    containerStyle: string,
    toolTiptext: string,
    shadow: bool,
    value: any,
    variation: string,
    className: string,
    boxType: string,
    id: string,
    showLockToolTip: bool,
    toolTipHeader: string,
    disableCheck: bool,
    onRightIconClick: func,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsCategory: string,
    shippingFee: string,
  };

  static defaultProps = {
    onChange: noop,
    enabled: true,
    toolTiptext: null,
    descriptionStyle: '',
    applyNoPriceStyle: false,
  };

  setValue = () => {
    const { value } = this.props;

    this.props.onChange(value);
  };

  render() {
    const {
      id, label, description, name, value, checked, price, children, variation, enabled, labelStyle,
      applyNoPriceStyle, priceStyle, rightIcon, containerStyle, toolTiptext, shadow, className, boxType,
      showLockToolTip, toolTipHeader, changeByProps, disableCheck, descriptionStyle, shippingFee,
      analyticsOn, analyticsLabel, analyticsCategory, onRightIconClick,
    } = this.props;

    const display = checked ? '' : styles.hidden;

    const priceStyleClass = classNames(
      styles.price,
      {
        [priceStyle]: !!priceStyle,
        [styles.free]: applyNoPriceStyle && isFreeShippingText(price),
      },
    );
    const priceElement = price ? <span className={priceStyleClass}>{price}</span> : null;
    const labelText = labelStyle ? <span className={labelStyle}>{label}</span> : label;
    const shippingFeeElement = shippingFee ? <span className={labelStyle}>{shippingFee}</span> : '';
    const icon = rightIcon ? <span className={styles[rightIcon]} onClick={onRightIconClick} /> : null;

    const classes = classNames(
      { z1: shadow, frame: !shadow, [styles.disabledSelector]: !enabled },
      styles.container, containerStyle,
      styles[className] || className,
    );
    const descriptionClasses = classNames(styles.displayBlock, styles[descriptionStyle] || descriptionStyle);
    const tooltip = renderInfoToolTip({ toolTipHeader, toolTiptext });

    return (
      <Container className={classes}>
        <Text className={styles.inputContainer}>
          { boxType === 'paymentTile' ? (
              <Container className={styles.title}>
                <Text className={`${styles.displayBlock} ${styles.giftTitle}`}>
                  <CheckBox
                    checked={checked}
                    disabled={!enabled || disableCheck}
                    id={`BoxSelectorPaymentTile${id}`}
                    label={label}
                    className={styles.paymentLabel}
                    onChange={this.setValue}
                    changeByProps={changeByProps}
                    analyticsOn={analyticsOn}
                    analyticsCategory={analyticsCategory}
                    analyticsLabel={analyticsLabel}
                  />
                  {icon}
                  <If
                    if={showLockToolTip}
                    then={TSLToolTip}
                  />
                </Text>
              </Container>
            ) : (
              <div className={styles.inputContainer}>
                <If
                  if={variation === 'checkbox'}
                  then={CheckBox}
                  else={Radio}
                  checked={checked}
                  className={styles.radio}
                  name={name}
                  onChange={this.setValue}
                  value={value}
                  analyticsOn={analyticsOn}
                  analyticsCategory={analyticsCategory}
                  analyticsLabel={analyticsLabel}
                />
                <Container className={styles.title}>
                  <Text className={`${styles.displayFlex} ${styles.giftTitle}`}>
                    <Container>
                      {labelText}
                      <div>
                        {shippingFeeElement}
                        {priceElement}
                      </div>
                      {icon}
                    </Container>
                    {tooltip}
                    <If
                      if={showLockToolTip}
                      then={TSLToolTip}
                    />
                  </Text>
                  <If
                    if={description}
                    then={Text}
                    className={descriptionClasses}
                    content={description}
                  />
                </Container>
              </div>
            )
          }
        </Text>
        <Container className={display}>
          { checked && children }
        </Container>
      </Container>
    );
  }
}
