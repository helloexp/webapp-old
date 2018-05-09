import React, { PropTypes, PureComponent } from 'react';
import Button from 'components/uniqlo-ui/Button';
import Link from 'components/uniqlo-ui/Link';
import Grid from 'components/uniqlo-ui/core/Grid';
import GridCell from 'components/uniqlo-ui/core/GridCell';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getCvsUrls } from 'redux/modules/checkout/delivery/selectors';
import styles from './styles.scss';

const { string, func, object } = PropTypes;
const footerBtnClass = classNames('default', 'small', styles.footerBtn);

@connect(state => ({
  cvsUrls: getCvsUrls(state),
}))

export default class FooterButtons extends PureComponent {

  static propTypes = {
    removeCvsAddress: func,
    cvsUrls: object,
    cvsBrand: string,
  };

  static contextTypes = {
    i18n: object,
  };

  onDeleteAddress = () => {
    this.props.removeCvsAddress(this.props.cvsBrand);
  }

  render() {
    const { cvsUrls, cvsBrand } = this.props;
    const { delivery: { selectCvs } } = this.context.i18n;

    return (
      <Grid
        cellPadding={0}
        childrenWrapperClass={styles.itemButtonWrapper}
        className={styles.footer}
      >
        <GridCell colSpan={6}>
          <Link external to={cvsUrls[cvsBrand]}>
            <Button
              className={footerBtnClass} label={selectCvs}
              labelClass={styles.footerBtnSpan}
            />
          </Link>
        </GridCell>
        <GridCell colSpan={6}>
          <Button
            className={footerBtnClass}
            onTouchTap={this.onDeleteAddress}
          >
            <span className={styles.removeBtn} />
          </Button>
        </GridCell>
      </Grid>
    );
  }
}
