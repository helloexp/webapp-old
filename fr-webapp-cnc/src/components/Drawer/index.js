import React, { PureComponent, PropTypes } from 'react';
import noop from 'utils/noop';
import Button from 'components/uniqlo-ui/Button';
import Heading from 'components/uniqlo-ui/Heading';
import classNames from 'classnames';
import If from 'components/uniqlo-ui/If';
import styles from './styles.scss';

const { string, func, any, bool, object } = PropTypes;

function setClassNames(variation) {
  const footerClass = classNames(styles.footer, {
    [styles.fixedFooter]: ['fixedFooter', 'fixedBorderedFooter', 'fixedFooterUnselected'].includes(variation),
    [styles.fixedHeightFooter]: variation === 'fixedHeightFooter',
    [styles.fixedBorderedFooter]: variation === 'fixedBorderedFooter',
    [styles.giftingFooter]: variation === 'giftHeader',
  });

  const cancelBtnClass = classNames('default medium bold noMarginButton', styles.cancelBtn, {
    [styles.footerBtnUnselected]: variation === 'fixedFooterUnselected',
  });

  return { footerClass, cancelBtnClass };
}

export default class Drawer extends PureComponent {

  static propTypes = {
    title: string,
    cancelLabel: string,
    acceptLabel: string,
    onAccept: func,
    onCancel: func,
    children: any,
    variation: string,
    className: any,
    disableAccept: bool,
    noNavBar: bool,
    bodyClass: string,
    headerClass: string,
    noPadding: bool,
    disabled: bool,
    headerType: string,
    noMargin: bool,
    getRef: func,
    hideCloseIcon: bool,
    acceptBtnProps: object,
    cancelBtnProps: object,
    cartSpacing: string,
  };

  static defaultProps = {
    onCancel: noop,
    onAccept: noop,
    headerType: 'h1',
    hideCloseIcon: false,
  };

  componentWillMount() {
    const { variation, noMargin } = this.props;

    this.iconCloseClass = classNames('default small', {
      [styles.closeIcon]: !noMargin,
      [styles.noMarginClose]: noMargin,
    });

    this.labelClasses = classNames(styles.btnLabel, {
      [styles.btnLabelFixed]: variation === 'fixedHeightFooter',
    });

    this.variationCls = setClassNames(variation);
  }

  componentWillReceiveProps(nextProps) {
    const { variation } = nextProps;

    if (this.props.variation !== variation) {
      this.variationCls = setClassNames(variation);
    }
  }

  onCancel = () => {
    this.props.onCancel();
  };

  onAccept = () => {
    this.props.onAccept();
  };

  renderHeader() {
    const { title, headerClass, cancelBtnProps, headerType, noPadding, className, variation, hideCloseIcon, cartSpacing } = this.props;

    if (['giftHeader', 'fixedBorderedFooter', 'fixedFooterUnselected'].includes(variation)) {
      return (
        <div className={`${styles.header} ${styles.giftHeader}`}>
          <Heading
            className={`mainHeader ${styles.giftTitle}`}
            headingText={title}
            type="h1"
          />
          <Button
            className={`default small noMarginButton ${styles.closeIcon}`}
            onTouchTap={this.onCancel}
            {...cancelBtnProps}
          />
        </div>
      );
    }

    return (
      <div
        className={classNames(styles.header, {
          [headerClass]: headerClass,
          [styles.headerPadding]: noPadding,
          [styles.cartSpacingHeader]: cartSpacing,
          className,
        })}
      >
        <Heading
          className={classNames('mainHeader', styles.drawerTitle, {
            [styles[cartSpacing]]: cartSpacing,
          })}
          headingText={title}
          type={headerType}
        />
        <If
          if={!hideCloseIcon}
          then={Button}
          className={this.iconCloseClass}
          onTouchTap={this.onCancel}
          {...cancelBtnProps}
        />
      </div>
    );
  }

  renderFooter() {
    const {
      acceptLabel,
      cancelLabel,
      disableAccept,
      variation,
      disabled,

      acceptBtnProps,
      cancelBtnProps,
    } = this.props;

    if (variation === 'noFooter') {
      return null;
    }

    return (
      <div className={this.variationCls.footerClass}>
        <Button
          className={this.variationCls.cancelBtnClass}
          label={cancelLabel}
          labelClass={this.labelClasses}
          onTouchTap={this.onCancel}
          {...cancelBtnProps}
        />
        <Button
          className={`secondary medium noMarginButton ${styles.acceptBtn}`}
          disabled={disableAccept || disabled}
          label={acceptLabel}
          labelClass={this.labelClasses}
          onTouchTap={this.onAccept}
          {...acceptBtnProps}
        />
      </div>
    );
  }

  render() {
    const {
      children,
      className,
      variation,
      noNavBar,
      bodyClass,
      noPadding,
      getRef,
      cartSpacing,
    } = this.props;
    const noNavBarClass = noNavBar ? styles.noNavBar : '';
    const variationCls = variation === 'noFooter' ? styles.noFooter : '';
    const variationBody = noPadding ? '' : styles.drawerBody;
    const rootClass = styles[className] || className;

    return (
      <div
        className={classNames(rootClass, noNavBarClass, styles.drawer, {
          [styles.cartSpacingDrawer]: cartSpacing,
        })}
        ref={getRef}
      >
        <div className={`${variationBody} ${variationCls} ${bodyClass}`}>
          {this.renderHeader()}
          {children}
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}
