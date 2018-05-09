import React, { PropTypes, PureComponent } from 'react';
import style from './LoadingIndicator.scss';

const { string, bool } = PropTypes;

const Dot = ({ delay }) => <span className={style.circularDot} style={{ animationDelay: delay }} />;

Dot.propTypes = {
  delay: string,
};

export default class LoadingIndicator extends PureComponent {
  static propTypes = {
    type: string,
    show: bool,
  };

  state = {
    show: false,
  };

  componentWillMount() {
    // intentionally not this.show to prevent state change before
    // the component is mounted
    this.setState({ show: !!this.props.show });
  }

  componentWillReceiveProps(nextProps) {
    this.show(nextProps.show);
  }

  componentWillUnmount() {
    this.cancelShow();
  }

  show(shouldShow) {
    if (shouldShow) {
      this.showTimeout = setTimeout(this.doShow, 100);
    }
  }

  cancelShow() {
    clearTimeout(this.showTimeout);
  }

  doShow = () => {
    this.setState({
      show: true,
    });
  };

  showTimeout = null;

  render() {
    const shouldShow = this.state.show && this.props.show;

    return (
      <div className={`${style.dots} ${style[this.props.type] || ''} ${style[shouldShow]}`} >
        <Dot delay="0s" />
      </div>
    );
  }
}
