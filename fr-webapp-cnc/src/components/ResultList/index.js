import React, { PureComponent, PropTypes } from 'react';
import { truncate } from 'utils/format';
import noop from 'utils/noop';
import Button from 'components/uniqlo-ui/Button';
import Heading from 'components/uniqlo-ui/Heading';
import Text from 'components/uniqlo-ui/Text';
import If from 'components/uniqlo-ui/If';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { shouldViewLoadMore } from 'redux/modules/checkout/delivery/store/selectors';
import { getFeatures, getDistance, getArrival, getIrregularOpenOurs, getClosedDates } from 'utils/store';
import SelectButton from './SelectButton.js';
import styles from './styles.scss';

const { bool, func, array, string, number, object, oneOfType } = PropTypes;

const TitleElement = ({ listTitle }) => (
  <Text className={styles.listTitle}>
    { listTitle }
  </Text>
);

TitleElement.propTypes = {
  listTitle: string,
};

@connect((state, props) => ({
  viewLoadMore: shouldViewLoadMore(state, props),
}))
export default class ResultList extends PureComponent {
  static propTypes = {
    items: oneOfType([array, object]),
    status: array,
    total: number,
    onSelect: func,
    removeItem: func,
    onLoadMore: func,
    caretLoadMore: bool,
    viewLoadMore: bool,
    className: string,
    variation: string,
    listTitle: string,
  };

  static contextTypes = {
    i18n: PropTypes.object,
  };

  static defaultProps = {
    onLoadMore: noop,
    onSelect: noop,
  };

  onLoadMorePress = () => {
    const { viewLoadMore, onLoadMore } = this.props;

    if (viewLoadMore) {
      onLoadMore();
    }
  };

  render() {
    const { caretLoadMore, listTitle, items, className, viewLoadMore, variation, onSelect } = this.props;
    const { deliveryStore, common } = this.context.i18n;
    const elements = items && items.map(
        (item, index) => <div className={styles.store} key={index}>
          <div className={styles.content}>
            <Heading className={styles.heading} headingText={item.name} type="h6" />

            <div className={`blockText ${styles.timeText}`}>
              <Text className="blockText">{deliveryStore.possibleTime}：</Text>
              <Text className="blockText">{deliveryStore.weekDayOpen} {`${truncate(item.weekDayOpen)}AM～${truncate(item.weekDayClose)}PM`}</Text>
              <Text className="blockText">{deliveryStore.holidaysOpen} {`${truncate(item.weekendOpen)}AM～${truncate(item.weekendClose)}PM`}</Text>
            </div>
            {getIrregularOpenOurs(item, variation, deliveryStore, styles)}
            {getClosedDates(item, variation, deliveryStore, styles)}
            {getArrival(item)}
            {getDistance(item, deliveryStore, styles)}
            <Text className="finePrint">{getFeatures(item, deliveryStore, styles)}</Text>
          </div>
          <SelectButton value={item} onSelect={onSelect} />
        </div>
      );

    const containerClassName = classnames(styles.resultList, className, {
      [styles.smallBottomSpacing]: caretLoadMore,
    });

    return (
      <div className={containerClassName}>
        <If
          if={listTitle}
          then={TitleElement}
        />
        {elements}
        <If
          if={viewLoadMore}
          then={Button}
          className={classnames('default', styles.caretLoadMore)}
          label={common.more}
          onTouchTap={this.onLoadMorePress}
          preventMultipleClicks
        />
      </div>
    );
  }
}
