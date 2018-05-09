import React from 'react';
import SvgIcon from '../index';

let pathValue = 'm.3,14c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.';

pathValue += '4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.';
pathValue += '9h0.1v-8.88178e-16c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.4 0.4,1 ';
pathValue += '0,1.4l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,';
pathValue += '0-0.5-0.1-0.7-0.3l-7.8-8.4-.2-.3z';

const ActionChecked = props => (
  <SvgIcon {...props}>
    <path d={pathValue} />
  </SvgIcon>
);

export default ActionChecked;
