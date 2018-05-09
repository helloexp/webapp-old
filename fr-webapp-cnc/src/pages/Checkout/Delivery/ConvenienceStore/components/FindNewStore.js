/* @TODO: Remove the component if unneccessary. To be decided after UAT(march-release).
 * PT story: https://www.pivotaltracker.com/n/projects/2003565/stories/153663510
 */
import React, { PropTypes, PureComponent } from 'react';
import Button from 'components/uniqlo-ui/Button';
import styles from './styles.scss';

const { object, func } = PropTypes;

export default class FindNewStore extends PureComponent {
  static propTypes = {
    showCVSMenu: func,
  };

  static contextTypes = {
    i18n: object,
  };

  render() {
    const { delivery } = this.context.i18n;
    const { showCVSMenu } = this.props;

    return (
      <Button
        className={`default medium boldWithBorder ${styles.confirmButton}`}
        label={delivery.findNewStore}
        onTouchTap={showCVSMenu}
      />
    );
  }
}
