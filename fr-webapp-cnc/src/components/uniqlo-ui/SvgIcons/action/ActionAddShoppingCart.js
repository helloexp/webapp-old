import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class ActionAddShoppingCart extends PureComponent {
  render() {
    return (
      <SvgIcon {...this.props}>
        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
      </SvgIcon>
    );
  }
}
