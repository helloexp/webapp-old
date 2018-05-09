import React from 'react';
import SvgIcon from '../index';

let pathValue = 'M9.3,14.566A.8.8,0,0,0,10.434,15.7l3.131-3.131a.8.8,0,0,0,0-1.';

pathValue += '132L10.434,8.3A.8.8,0,0,0,9.3,9.434L11.069,11.2H5v1.6h6.069Z';

const ActionLogin = props => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M16.918,3H5V4.6H17.4V19.4H5V21H16.918A2.076,2.076,0,0,0,19,18.943V5.057A2.076,2.076,0,0,0,16.918,3Z" />
    <path d={pathValue} />
  </SvgIcon>
);

export default ActionLogin;
