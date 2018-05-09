import React, { PropTypes } from 'react';
import { getSpecTypes } from 'redux/modules/silveregg';
import Silveregg from 'components/Silveregg';

const { object } = PropTypes;

const GuProductRecommendations = ({ guCart }) => {
  const elements = getSpecTypes(guCart).map(id => <Silveregg specType={id} key={id} />);

  return <div>{elements}</div>;
};

GuProductRecommendations.propTypes = {
  guCart: object,
};

export default GuProductRecommendations;
