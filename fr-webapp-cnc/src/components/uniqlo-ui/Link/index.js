import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link as LinkTo } from 'react-router';
import { trackEvent } from 'utils/gtm';
import { EXTERNAL_ADDRESS } from 'helpers/regex';
import * as appActions from 'redux/modules/app';
import Heading from '../Heading';
import Icon from '../core/Icon';
import styles from './Link.scss';

const { string, bool, array, any, func, object } = PropTypes;

function getContent({ label, left, children, contentClassNames }) {
  let leftChildren = null;
  let rightChildren = null;

  if (left) {
    leftChildren = children;
  } else {
    rightChildren = children;
  }

  return (
    <div className={contentClassNames}>
      { leftChildren }
      <Heading
        className={styles.heading}
        headingText={label}
        type="h6"
      />
      { rightChildren }
    </div>
  );
}

getContent.propTypes = {
  label: string,
  left: bool,
  children: array,
  contentClassNames: string,
};

function getIcon(iconClassName) {
  return (
    <Icon
      className="iconChevronRightMicro"
      styleClass={classNames(styles.caret, iconClassName)}
    />
  );
}

function handleClick(event) {
  event.preventDefault();
}

function handleOnClick(to, onClick, props) {
  return (...args) => {
    const [event] = args;

    const {
      analyticsOn,
      analyticsLabel,
      analyticsValue,
      analyticsCategory,
    } = props;

    if (analyticsOn) {
      trackEvent({
        action: analyticsOn,
        label: analyticsLabel,
        value: analyticsValue,
        category: analyticsCategory,
      });
    }

    if (props.confirmNavigateAway) {
      if (event) {
        event.preventDefault();
      }

      return props.maybeNavigate(to, props.noRouter, props.onClick, props.navigationTexts);
    }

    if (!to) {
      event.preventDefault();
    }

    if (onClick) {
      return onClick(...args);
    }

    return null;
  };
}

const Link = (props) => {
  const {
    label,
    to,
    caret,
    className,
    iconClassName,
    children,
    left,
    contentType,
    external,
    target,
    onClick,
    noRouter,
    inlineLink,

    analyticsOn,
    analyticsLabel,
    analyticsValue,
    analyticsCategory,
  } = props;
  const path = to || '';
  const linkTest = EXTERNAL_ADDRESS.test(to);
  const LinkComponent = linkTest || noRouter === true ? 'a' : LinkTo;
  const params = {};

  params[(linkTest || noRouter) ? 'href' : 'to'] = path;

  if (external) {
    params.rel = 'noreferrer';
  }

  const linkClassNames = classNames(className, {
    [styles.link]: caret,
  });

  const contentClassNames = classNames(styles.content, {
    [styles[contentType] || '']: contentType,
    [styles.inlineLink]: inlineLink,
  }, 'linkContent');

  const noTo = {};

  if (!to) {
    noTo.onClick = handleClick;
  }

  if (onClick) {
    noTo.onClick = onClick;
  }

  if (target && target.length && target !== '_self') {
    params.target = target;
  }

  const analyticsAttrs = {
    'analytics-on': analyticsOn,
    'analytics-label': analyticsLabel,
    'analytics-value': analyticsValue,
    'analytics-category': analyticsCategory,
  };

  return (
    <LinkComponent
      className={linkClassNames}
      {...params}
      {...noTo}
      {...analyticsAttrs}
      onClick={handleOnClick(to, onClick, props)}
    >
      { getContent({ label, left, children, contentClassNames }) }
      { caret && getIcon(iconClassName) }
    </LinkComponent>
  );
};

Link.displayName = 'Link';
Link.propTypes = {
  label: string,
  to: string,
  caret: bool,
  className: string,
  iconClassName: string,
  children: any,
  left: any,
  contentType: string,
  external: bool,
  target: string,
  onClick: func,
  noRouter: bool,
  confirmNavigateAway: bool,
  maybeNavigate: func,
  navigationTexts: object,
  inlineLink: bool,

  // GTM props
  analyticsOn: string,
  analyticsLabel: string,
  analyticsValue: string,
  analyticsCategory: string,
};

export default connect((state, props) => ({
  confirmNavigateAway: state.app.confirmNavigateAway || props.confirmNavigateAway,
}), {
  maybeNavigate: appActions.maybeNavigate,
})(Link);
