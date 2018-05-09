import React, { PureComponent, PropTypes } from 'react';

const { any, node, oneOfType, string, array } = PropTypes;

/**
 * Logic-only component for simplified conditional statements
 * By default renders a <div> and passes all supplied properties to it,
 * including children
 * Change the default element by supplying
 *   then={React.Component} - component to render if condition true
 *   else={React.Component} - component to render if condition false
 *   if else is a component then component to render will be the one assigned to else={MyComponent}
 *   if else is true eg <If if={} then={} else><ComponentInner></If> the component to render will be only the inner comp
 *
 *
 * Examples
 *    <If if={true}>It is truthful</If>
 *    <If if={true} className={styles.success}>It is truthful</If>
 *    <If if={true} then={Text}>It is truthful</If>
 *    <If if={true} then={SuccessComponent} else={FailureComponent} />
 *    <If if={true} then={ProductGrid} data={{ foo: 1 }} />
 *    <If if={true} then={ProductGrid} else={ProductGridDifferent} data={{ foo: 1 }} />
 *    <If if={true} then={ProductGrid} else data={{ foo: 1 }}><ProductGridInner /></If>
 */
export default class If extends PureComponent {
  render() {
    const { children, ...other } = this.props;
    const Component = this.props.then || 'div';
    const ElseComponent = this.props.else;

    delete other.if;
    delete other.then;
    delete other.else;

    let elseReturn = null;

    if (ElseComponent) {
      elseReturn = ElseComponent === true ? children : <ElseComponent {...other}>{children}</ElseComponent>;
    }

    const thenReturn = children ? <Component {...other}>{children}</Component> : <Component {...other} />;

    return this.props.if ? thenReturn : elseReturn;
  }
}

// Using reserved names as properties so we are quoting them
// jscs:disable disallowQuotedKeysInObjects
/* eslint-disable quote-props */
If.propTypes = {
  'if': any,
  'then': any,
  'else': any,
  'children': oneOfType([node, string, array]),
};

// jscs:enable disallowQuotedKeysInObjects
/* eslint-enable quote-props */
