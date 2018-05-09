import React from 'react';
import SvgIcon from '../index';

let pathValue = 'M14,15.7a.8.8,0,0,0,1.131,0l3.132-3.131a.8.8,0,0,0,0-1.';

pathValue += '132L15.134,8.3A.8.8,0,0,0,14,9.434L15.769,11.2H9.7v1.6h6.069L14,14.566A.8.8,0,0,0,14,15.7Z';

const ActionLogout = props => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M6.582,3A2.076,2.076,0,0,0,4.5,5.057V18.943A2.076,2.076,0,0,0,6.582,21H18.5V19.4H6.1V4.6H18.5V3Z" />
    <path d={pathValue} />
  </SvgIcon>
);

export default ActionLogout;
