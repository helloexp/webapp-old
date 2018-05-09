import React from 'react';
import { getTranslation } from 'i18n';
import Text from 'components/uniqlo-ui/Text';
import { EXCLUDE_LEADING_SPACES } from 'helpers/regex';
import { scrollToTop } from 'utils/scroll';

export function getFeatures(store, i18n, styles) {
  const none = undefined;
  const features = [
    store.babies ? i18n.baby : none,
    store.kids ? i18n.kids : none,
    store.xl ? i18n.extraLargeStore : none,
    store.parking ? i18n.parking : none,
    store.news ? i18n.news : none,
    store.large ? i18n.largeStore : none,
  ].filter(Boolean);

  const featuresElement = features.map((item, index) =>
    <div key={index} className={styles.featureContainer}>
      {item}
      { (index < features.length - 1) && <span className={styles.delimiter}>・</span> }
    </div>
  );

  return featuresElement;
}

export function getDistance(item, i18n, styles) {
  return item.distance ?
    <Text className={`blockText ${styles.distanceText}`}>{item.distance} {i18n.unit}</Text>
  : null;
}

export function getArrival(item) {
  if (item.arrival) {
    return <Text className="blockText">{item.arrival}</Text>;
  }

  return null;
}

export function getIrregularOpenOurs(item, variation, i18n, styles) {
  if (variation === 'storeLocator' && item.irregularOpenHours) {
    return (
      <div className={styles.timeContainer}>
        <Text className="blockText">{i18n.irregularOpenHours}：</Text>
        <Text className="blockText">{item.irregularOpenHours}</Text>
      </div>
    );
  }

  return null;
}

export function getClosedDates(item, variation, i18n, styles) {
  if (variation === 'storeLocator' && item.closedDates) {
    return (
      <div className={styles.timeContainer}>
        <Text className="blockText">{i18n.closedDates}：</Text>
        <Text className="blockText">{item.closedDates}</Text>
      </div>
    );
  }

  return null;
}

export function resetScrollPosition(element) {
  if (element && element.scrollTop !== 0) {
    scrollToTop(element, 0, 0);
  }
}

/**
 * Splits a given store name into `corporateName` and `deptName`
 * @param {String} storeName
 * @returns {{corporateName: String, deptName: String}}
 */
export function getStoreNameParts(storeName = '') {
  const { common: { uniqlo, gu, bicqlo, uniqloEn } } = getTranslation();

  const [corporateName, ...rest] = storeName.match(
    new RegExp(`(${uniqlo}|${gu}|${bicqlo}|${uniqloEn})|${EXCLUDE_LEADING_SPACES.source}`, 'g')
  ) || [];

  return {
    corporateName,
    deptName: rest.join(' '),
  };
}
