import React from 'react';
import SvgIcon from '../index';

let pathValue = 'M265,130h-15V84.999C250,38.13,211.869,0,165,0S80,38.13,80,84.';

pathValue += '999V130H65c-8.284,0-15,6.716-15,15v170   c0,8.284,6.716,';
pathValue += '15,15,15h200c8.284,0,15-6.716,15-15V145C280,136.716,273.284,130,';
pathValue += '265,130z M110,84.999   C110,54.673,134.673,30,165,30s55,';
pathValue += '24.673,55,54.999V130H110V84.999z M250,300H80V160h15h140h15V300z';

let pathLock = 'M165,190c-13.785,0-25,11.215-25,25c0,8.162,3.932,15.421,10,';

pathLock += '19.986V255c0,8.284,6.716,15,15,15   s15-6.716,15-15v-20.014c6.';
pathLock += '068-4.565,10-11.825,10-19.986C190,201.215,178.785,190,165,190z';

const ActionLock = props => (
  <SvgIcon {...props}>
    <path d={pathValue} />
    <path d={pathLock} />
  </SvgIcon>
);

export default ActionLock;
