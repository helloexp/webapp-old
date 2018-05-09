import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class NavigationChevronDown extends PureComponent {
  render() {
    return (
      <SvgIcon {...this.props}>
        <polygon points="12,15.76 5,9.73 6.34,8.24 12,13.12 17.66,8.24 19,9.73" />
      </SvgIcon>
    );
  }
}
