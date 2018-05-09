import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class NavigationChevronUp extends PureComponent {
  render() {
    return (
      <SvgIcon {...this.props}>
        <polygon points="12,8.24 5,14.27 6.34,15.76 12,10.88 17.66,15.76 19,14.27" />
      </SvgIcon>
    );
  }
}
