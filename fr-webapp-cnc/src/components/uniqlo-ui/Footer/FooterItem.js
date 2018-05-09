import React, { PropTypes } from 'react';
import AccordionItem from '../Accordion/AccordionItem';

const { string, oneOfType, object, array, bool } = PropTypes;

const FooterItem = ({ children, headingText, expanded }) =>
  <AccordionItem className="footerHeadingIcon" expanded={expanded} headingText={headingText}>
    { children}
  </AccordionItem>;

FooterItem.propTypes = {
  className: string,
  headingText: string,
  children: oneOfType([array, object]),
  expanded: bool,
};

export default FooterItem;
