import React, { PureComponent, PropTypes } from 'react';
import { trackEvent } from 'utils/gtm';
import Text from 'components/uniqlo-ui/Text';
import Icon from 'components/uniqlo-ui/core/Icon';
import noop from 'utils/noop';
import styles from './styles.scss';

const { string, func } = PropTypes;

export default class IconButton extends PureComponent {
  static propTypes = {
    iconName: string.isRequired,
    label: string.isRequired,
    labelStyle: string,
    className: string,
    onTouchTap: func,

    // GTM props
    analyticsOn: string,
    analyticsCategory: string,
    analyticsLabel: string,
  };

  static defaultProps = {
    onTouchTap: noop,
  };

  handleTouchTap = () => {
    const {
      analyticsOn,
      analyticsLabel,
      onTouchTap,
      analyticsCategory,
    } = this.props;

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        category: analyticsCategory,
      });
    }

    onTouchTap();
  };

  render() {
    const { iconName, label, labelStyle, className } = this.props;

    return (
      <div onClick={this.handleTouchTap} className={className}>
        <Icon name={iconName} className={styles.iconStyle} />
        <Text className={labelStyle}>{label}</Text>
      </div>
    );
  }
}
