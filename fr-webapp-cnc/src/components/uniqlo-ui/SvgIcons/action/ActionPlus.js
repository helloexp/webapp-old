import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class ActionPlus extends PureComponent {
  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#000000" />
      </SvgIcon>
    );
  }
}
