import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class SlashIcon extends PureComponent {
  render() {
    const str = String.raw`M19,6.41L17.59,5L12,10.59L5,17.59L6.41,
      19L12,13.41L13.41,12Z`;

    return (
      <SvgIcon {...this.props}>
        <path d={str} />
      </SvgIcon>
    );
  }
}
