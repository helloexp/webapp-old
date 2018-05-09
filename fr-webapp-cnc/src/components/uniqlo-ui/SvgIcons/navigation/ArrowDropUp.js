import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class NavigationArrowDropUp extends PureComponent {
  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M7 14l5-5 5 5z" />
      </SvgIcon>
    );
  }
}
