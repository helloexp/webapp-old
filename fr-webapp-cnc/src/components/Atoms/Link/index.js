import React, { PureComponent, PropTypes } from 'react';
import { Link as RouterLink } from 'react-router';
import { trackEvent } from 'utils/gtm';
import ClickHOC from 'components/Atoms/ClickHOC';
import { EXTERNAL_ADDRESS } from 'helpers/regex';

const { string, node, bool, func } = PropTypes;

@ClickHOC
export default class Link extends PureComponent {
  static propTypes = {
    // HOC props
    children: node,
    className: string,
    disabled: bool,

    // own props
    to: string.isRequired,
    onClick: func,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsValue: string,
    analyticsCategory: string,
  };

  handleOnClick = (event) => {
    const {
      onClick,

      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
    } = this.props;

    if (onClick) {
      onClick(event);
    }

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        value: analyticsValue,
        category: analyticsCategory,
      });
    }
  };

  render() {
    const {
      className,
      disabled,
      to,
      children,

      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
    } = this.props;

    const analyticsAttrs = {
      'analytics-on': analyticsOn,
      'analytics-label': analyticsLabel,
      'analytics-value': analyticsValue,
      'analytics-category': analyticsCategory,
    };

    const isExternal = EXTERNAL_ADDRESS.test(to);
    const target = isExternal ? '_blank' : undefined;

    const params = {
      className,
      disabled,
      target,
      [isExternal ? 'href' : 'to']: to,
      ...analyticsAttrs,
    };
    const ComponentTag = isExternal ? 'a' : RouterLink;

    return (
      <ComponentTag {...params}>
        {children}
      </ComponentTag>
    );
  }
}
