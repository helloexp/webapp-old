import React from 'react';
import SvgIcon from '../index';

let pathValue = 'M7.737,15.607A5.648,5.648,0,0,1,12,14.1a5.642,5.642,0,0,1,4.293,1.5c';

pathValue += '.03.032.051.075.08.109l1.156-1.15c-.079-.094-.153-.191-.239-.281a5.894,5.';
pathValue += '894,0,0,0-2.045-1.374,5.039,5.039,0,0,0-2.759-8.883c-.165-.016-.33-.024-.493-';
pathValue += '.024a5.05,5.05,0,0,0-3.237,8.922,5.962,5.962,0,0,0-2.014,1.355A6.685,6.685,0,0,0,5,19v1h9.';
pathValue += '125V18.4H6.6A5.294,5.294,0,0,1,7.737,15.607Zm.83-6.888A3.434,3.434,0,0,1,11.993,5.';
pathValue += '6c.113,0,.226.006.34.017a3.45,3.45,0,0,1-.327,6.883q-.168,0-.339-.017a3.45,3.45,0,0,1-3.1-3.766Z';

let pathPlus = 'M22.483,18.379h-2.27a.078.078,0,0,1-.089-.089V16a.131.131,0,0,0-.149-.148h-1.2a.13.13,0,0,0-.';

pathPlus += '148.148V18.29a.079.079,0,0,1-.089.089h-2.27a.132.132,0,0,0-.149.149v1.157a.132.132,0,0,0,';
pathPlus += '.149.149h2.27a.079.079,0,0,1,.089.089v2.285a.13.13,0,0,0,.148.148h1.2a.131.131,0,0,0,';
pathPlus += '.149-.148V19.923a.078.078,0,0,1,.089-.089h2.27a.132.132,0,0,0,';
pathPlus += '.149-.149V18.528A.132.132,0,0,0,22.483,18.379Z';

const ActionRegister = props => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d={pathValue} />
    <path d={pathPlus} />
  </SvgIcon>
);

export default ActionRegister;