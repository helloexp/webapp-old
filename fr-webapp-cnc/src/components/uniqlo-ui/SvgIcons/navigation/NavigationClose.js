import React, { PureComponent } from 'react';
import SvgIcon from '../index';

export default class NavigationClose extends PureComponent {
  render() {
    let pathValue = 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 ';

    pathValue += '17.59 19 19 17.59 13.41 12z';

    return (
      <SvgIcon {...this.props}>
        <path d={pathValue} />
      </SvgIcon>
    );
  }
}
