import React, { PropTypes } from 'react';
import Label from 'components/uniqlo-ui/Label';
import CheckBox from 'components/uniqlo-ui/core/CheckBox';
import styles from './styles.scss';

function NewsLetterCheckBoxes(props) {
  const {
    newsLetter,
    me,
    state,
  } = props;
  const checkBoxStyle = `spaCheckBox ${styles.memberCheckBox}`;

  return (
    <div className={styles.newsLetterWrapper}>
      <Label className={styles.newsLetterLabel} text={newsLetter.name} />
      <CheckBox
        checked={state.isGeneral}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesGeneral"
        label={newsLetter.general}
        onCheck={me.newsLetterSelected}
        value={newsLetter.general}
      />
      <CheckBox
        checked={state.isMen}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesMen"
        label={newsLetter.men}
        onCheck={me.newsLetterSelected}
        value={newsLetter.men}
      />
      <CheckBox
        checked={state.isWomen}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesWomen"
        label={newsLetter.women}
        onCheck={me.newsLetterSelected}
        value={newsLetter.women}
      />
      <CheckBox
        checked={state.isKids}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesKids"
        label={newsLetter.kids}
        onCheck={me.newsLetterSelected}
        value={newsLetter.kids}
      />
      <CheckBox
        checked={state.isBaby}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesBaby"
        label={newsLetter.baby}
        onCheck={me.newsLetterSelected}
        value={newsLetter.baby}
      />
      <CheckBox
        checked={state.isExtendedSize}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesExtendedSize"
        label={newsLetter.extendedSize}
        onCheck={me.newsLetterSelected}
        value={newsLetter.extendedSize}
      />
      <CheckBox
        checked={state.isSmallSize}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesSmallSize"
        label={newsLetter.smallSize}
        onCheck={me.newsLetterSelected}
        value={newsLetter.smallSize}
      />
      <CheckBox
        checked={state.isOnlineOrLimitedStore}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesOnlineOrLimitedStore"
        label={newsLetter.onlineOrLimitedStore}
        onCheck={me.newsLetterSelected}
        value={newsLetter.onlineOrLimitedStore}
      />
      <CheckBox
        checked={state.subscribeAll}
        className={checkBoxStyle}
        id="NewsLetterCheckBoxesSubscribeAll"
        label={newsLetter.subscribeAll}
        onCheck={me.newsLetterSelected}
        value={newsLetter.subscribeAll}
      />
    </div>
  );
}

const { object } = PropTypes;

NewsLetterCheckBoxes.propTypes = {
  newsLetter: object,
  me: object,
  state: object,
};

export default NewsLetterCheckBoxes;
