import React, { PropTypes } from 'react';
import Container from 'components/uniqlo-ui/core/Container';
import Link from 'components/uniqlo-ui/Link';
import Recommendations from 'pages/Cart/Recommendations';
import RecentlyViewed from 'pages/Cart/RecentlyViewed';
import If from 'components/uniqlo-ui/If';
import styles from './styles.scss';

const { string, object, bool, func } = PropTypes;

const RecommendationsContainer = ({ isDefaultDetailsComplete, isUniqloBrand, brand, goToMemberEdit }, { i18n: { orderConfirmation } }) => (
  <Container className={styles.recommendationsContainer}>
    <If if={!isDefaultDetailsComplete}>
      <Container className={styles.memberEditLinkWrapper}>
        <Link
          caret
          className={styles.linkWrapper}
          contentType="linkTab"
          label={orderConfirmation.goToMemberEdit}
          onClick={goToMemberEdit}
        />
      </Container>
    </If>
    <If
      if={isUniqloBrand}
      then={Recommendations}
      brand={brand}
    />
    <RecentlyViewed brand={brand} />
  </Container>
);

RecommendationsContainer.propTypes = {
  isDefaultDetailsComplete: bool,
  isUniqloBrand: bool,
  brand: string,
  goToMemberEdit: func,
};

RecommendationsContainer.contextTypes = {
  i18n: object,
};

export default RecommendationsContainer;
