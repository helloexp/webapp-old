import React, { PropTypes } from 'react';
import noop from 'utils/noop';
import { trackEvent } from 'utils/gtm';
import SvgIcons from '../../SvgIcons/svgIcons';
import { mergeClasses } from '../../helpers/utils/stylePropable';
import stylePropsParser from '../../helpers/utils/stylePropParser';
import styles from './Icon.scss';

const { string, func } = PropTypes;

const handleClick = props => (event) => {
  const {
    analyticsOn,
    analyticsLabel,
    analyticsValue,
    analyticsCategory,
  } = props;

  if (analyticsOn) {
    trackEvent({
      action: analyticsOn,
      label: analyticsLabel,
      value: analyticsValue,
      category: analyticsCategory,
    });
  }

  props.onClick(event);
};

const Icon = (props) => {
  const {
    name,
    className,
    styleClass,

    analyticsOn,
    analyticsLabel,
    analyticsValue,
    analyticsCategory,
  } = props;
  const onClick = handleClick(props);
  let selectedIcon;
  const baseClassName = mergeClasses(styles[className], styles.icon,
     stylePropsParser(styleClass, styles));

  const analyticsAttrs = {
    'analytics-on': analyticsOn,
    'analytics-label': analyticsLabel,
    'analytics-value': analyticsValue,
    'analytics-category': analyticsCategory,
  };

  const svgProps = {
    name,
    className: styleClass || className,
    onClick,
  };

  if (name) {
    const IconRender = SvgIcons[name] || null;

    selectedIcon = <IconRender {...svgProps} {...analyticsAttrs} />;
  } else {
    selectedIcon = <span className={baseClassName} onClick={onClick} {...analyticsAttrs} />;
  }

  return selectedIcon;
};

Icon.propTypes = {
  name: string,
  className: string,
  styleClass: string,
  onClick: func,

  // GTM props
  analyticsOn: string,
  analyticsLabel: string,
  analyticsValue: string,
  analyticsCategory: string,
};

Icon.defaultProps = {
  onClick: noop,
};

export default Icon;
