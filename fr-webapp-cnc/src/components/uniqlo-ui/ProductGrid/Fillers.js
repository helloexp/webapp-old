import React, { PropTypes } from 'react';

const { string, node, number } = PropTypes;

const Fillers = props =>
  <div> {props.children} </div>;

Fillers.propTypes = {
  children: node,
  display: string,
  row: number,
};

Fillers.defaultProps = {
  display: 'Always',
};
export default Fillers;
