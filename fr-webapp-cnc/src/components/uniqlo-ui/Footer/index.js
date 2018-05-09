import React, { PropTypes } from 'react';
import Accordion from '../Accordion';
import Heading from '../Heading';

const { string, oneOfType, object, array } = PropTypes;

const Footer = ({ children, copyRightText }) => (
  <div>
    <Accordion className="footer">
      { children }
    </Accordion>
    <Heading className="footerHeading" headingText={copyRightText} type="h5" />
  </div>
);

Footer.propTypes = {
  className: string,
  children: oneOfType([array, object]),
  copyRightText: string,
};

export default Footer;
