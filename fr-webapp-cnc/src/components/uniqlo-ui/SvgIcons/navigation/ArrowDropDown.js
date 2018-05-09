import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class NavigationArrowDropDown extends PureComponent {
  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M7 10l5 5 5-5z" />
      </SvgIcon>
    );
  }
}
