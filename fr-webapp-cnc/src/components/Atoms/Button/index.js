import React, { PureComponent, PropTypes } from 'react';
import { trackEvent } from 'utils/gtm';
import ClickHOC from 'components/Atoms/ClickHOC';

const { string, node, bool, func } = PropTypes;

@ClickHOC
export default class Button extends PureComponent {
  static propTypes = {
    // HOC props
    children: node,
    className: string,
    disabled: bool,

    // own props
    onClick: func.isRequired,

    // GTM props
    analyticsOn: string,
    analyticsLabel: string,
    analyticsValue: string,
    analyticsCategory: string,
  };

  handleOnClick = (event) => {
    this.props.onClick(event);

    const {
      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
    } = this.props;

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

    return (
      <button className={className} disabled={disabled} onClick={this.handleOnClick} {...analyticsAttrs}>
        {children}
      </button>
    );
  }
}
