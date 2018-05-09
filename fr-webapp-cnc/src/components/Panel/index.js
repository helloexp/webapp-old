import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import Button from 'components/Atoms/Button';
import Heading from 'components/uniqlo-ui/Heading';
import If from 'components/uniqlo-ui/If';
import Icon from 'components/uniqlo-ui/core/Icon';
import noop from 'utils/noop';
import styles from './styles.scss';

const { string, bool, any, func, node, oneOfType, object } = PropTypes;

export default class Panel extends PureComponent {
  static propTypes = {
    title: oneOfType([string, node, object]),
    className: string,
    toggleable: bool,
    smallerFramePadding: bool,
    frame: bool,
    children: any,
    editable: bool,
    centerTitle: bool,
    onEdit: func,
    headerStyle: string,
    enabled: bool,
    collapsedClassName: string,
    defaultState: string,
    onToggle: func,
    confirm: bool,
    fromMember: bool,
    lighterBoxShadow: bool,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsValue: string,
    analyticsCategory: string,
  };

  static contextTypes = {
    i18n: PropTypes.object,
  };

  static defaultProps = {
    enabled: true,
    smallerFramePadding: false,
    onToggle: noop,
    lighterBoxShadow: false,
    defaultState: 'collapsed',
  };

  state = {
    collapsed: this.props.defaultState === 'collapsed',
  };

  toggle = () => {
    const { props: { onToggle }, state: { collapsed } } = this;

    onToggle(!collapsed);
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  };

  render() {
    const _this = this;
    const { common } = _this.context.i18n;
    let toggleProps = null;
    let titleElement = null;
    let visible = '';
    const {
      title,
      toggleable,
      children,
      frame,
      fromOrder,
      className,
      centerTitle,
      editable,
      onEdit,
      headerStyle,
      enabled,
      collapsedClassName,
      spacingTitle,
      confirm,
      subtitle,
      fromMember,
      downArrow,
      lighterBoxShadow,

      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
      smallerFramePadding,
    } = _this.props;

    if (toggleable) {
      toggleProps = {
        styleClass: null,

        analyticsOn,
        analyticsLabel,
        analyticsValue,
        analyticsCategory,
      };

      if (_this.state.collapsed) {
        toggleProps.styleClass = styles.chevronDown;
      } else {
        toggleProps.styleClass = styles.chevronUp;
        visible = styles.expanded;
      }
    } else {
      // if is not toggleable by default should be expanded
      visible = styles.expanded;
    }

    if (title) {
      const toggleClass = classNames(styles.toggleCell, { [styles.memberToggle]: fromMember }, { [styles.downArrow]: downArrow });

      titleElement = (
        <div
          className={classNames(styles.panelHeader, headerStyle, { [styles.spacingTitle]: spacingTitle })}
          onClick={_this.toggle}
        >
          <div className={styles.title}>
            <Heading
              className={classNames('subHeader', {
                [styles.centered]: centerTitle,
                [styles.spacingTitle]: confirm,
                [styles.subTitle]: subtitle,
                [styles.orderHeader]: fromOrder,
              })}
              headingText={title} type="h6"
            />
          </div>
          <div className={toggleClass}>
            <If
              if={toggleProps}
              {...toggleProps}
              then={Icon}
            />
            <If
              if={editable}
              then={Button}
              type={Button.type.edit}
              onClick={onEdit}
              analyticsOn={analyticsOn}
              analyticsLabel={analyticsLabel}
              analyticsValue={analyticsValue}
              analyticsCategory={analyticsCategory}
            >{common.edit}</If>
          </div>
        </div>
      );
    }

    const classes = classNames(
      styles.panel,
      className,
      {
        [styles.disabledPanel]: !enabled,
        [styles.frame]: frame,
        [styles.lighterBoxShadow]: lighterBoxShadow,
        [styles.smallerFramePadding]: smallerFramePadding,
        [collapsedClassName]: collapsedClassName && !_this.state.collapsed,
      },
    );

    return (
      <div className={classes}>
        {titleElement}
        <div className={classNames(styles.panelBody, visible)}>
          {children}
        </div>
      </div>
    );
  }
}
