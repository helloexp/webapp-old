import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class ActionMinus extends PureComponent {
  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M19,13H5V11H19V13Z" fill="#000000" />
      </SvgIcon>
    );
  }
}
