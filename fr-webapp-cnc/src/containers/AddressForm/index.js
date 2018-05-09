import React, { PureComponent, PropTypes } from 'react';
import errorHandler from 'containers/ErrorHandler';
import { connect } from 'react-redux';
import { getFormValidationErrors, getErrorList, shouldShowErrorList } from 'redux/modules/errorHandler/selectors';
import AddressForm from 'components/AddressForm';
import If from 'components/uniqlo-ui/If';
import styles from './styles.scss';

const { object, bool } = PropTypes;

const ErrorList = ({ errors }) => (
  <ul className={styles.errorList}>
    {Object.keys(errors).map((key, index) => (
      errors[key] && <li key={index} className={styles.errorItem}>{errors[key]}</li>
    ))}
  </ul>
);

ErrorList.propTypes = {
  errors: object,
};

@errorHandler(
  ['saveShippingAddress', 'setBillingAddress'],
)
@errorHandler(
  ['formValidation'],
  'detailedErrors'
)
@connect((state, props) => ({
  validationErrors: getFormValidationErrors(state, props),
  errorList: getErrorList(state, props),
  showErrorList: shouldShowErrorList(state, props),
}))
export default class AddressFormWithValidation extends PureComponent {
  static propTypes = {
    ...AddressForm.propTypes,
    validationErrors: object,
    errorList: object,
    showErrorList: bool,
  }

  static contextTypes = AddressForm.contextTypes;

  state = {
    errors: this.props.validationErrors,
  };

  componentWillReceiveProps(nextProps) {
    const { formValidation: oldErrors } = this.props.detailedErrors;
    const { formValidation: newErrors } = nextProps.detailedErrors;

    if (Object.keys(oldErrors).length !== Object.keys(newErrors).length) {
      this.setState({ errors: newErrors });
    }
  }

  onInputChange = (event, fieldName) => {
    if (this.state.errors[fieldName]) {
      this.setState({ errors: { ...this.state.errors, [fieldName]: '' } });
    }
  }

  render() {
    const {
      errorList,
      showErrorList,
      validationErrors,
      ...restProps
    } = this.props;

    return (
      <div>
        <If
          if={showErrorList}
          then={ErrorList}
          errors={errorList}
        />
        <AddressForm {...restProps} errors={validationErrors} onInputChange={this.onInputChange} />
      </div>
    );
  }
}
