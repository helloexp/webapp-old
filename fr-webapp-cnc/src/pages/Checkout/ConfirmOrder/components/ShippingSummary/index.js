import React, { PropTypes } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Text from 'components/uniqlo-ui/Text';
import Container from 'components/uniqlo-ui/core/Container';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import Heading from 'components/uniqlo-ui/Heading';

const ShippingSummary = (props, context) => {
  const { checkout, common } = context.i18n;
  const { titleStyle, editable, shippingPreference, goToEditPage, className } = props;
  const editButton = editable
      ? (<Button
        className="editButton"
        label={common.edit}
        onTouchTap={() => goToEditPage('checkout/delivery')}
      />)
      : null;

  return (
    <Container className={className}>
      <Grid>
        <GridCell
          colSpan={8}
          contentAlign="left"
        >
          <Heading
            className={titleStyle}
            headingText={checkout.shippingPreference}
            type="h4"
          />
        </GridCell>
        <GridCell colSpan={4}>
          { editButton }
        </GridCell>
      </Grid>
      <Text className="blockText">{shippingPreference}</Text>
    </Container>
  );
};

const { string, bool, object, func } = PropTypes;

ShippingSummary.propTypes = {
  titleStyle: string,
  editable: bool,
  shippingPreference: string,
  goToEditPage: func,
  className: string,
};

ShippingSummary.contextTypes = {
  i18n: object,
};

export default ShippingSummary;
export {
  ShippingSummary as ShippingSummaryTest,
};
