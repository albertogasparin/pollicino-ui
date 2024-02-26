import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Validation
 * @augments {Component<{
      value: any
      immediate?: boolean
      touched?: boolean
      onChange?: Function
      onFocus?: Function
      onBlur?: Function
      validation?: Function
      render?: Function
    }, any>}
 */
export class Validation extends Component {
  static propTypes = {
    value: PropTypes.any,
    immediate: PropTypes.bool,
    touched: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    render: PropTypes.func,
    validation: PropTypes.func,
    children: PropTypes.func,
  };

  static defaultProps = {
    onBlur() {},
    onChange() {},
    onFocus() {},
    validation() {},
  };

  state = {
    focused: false,
    touched: false,
    error: null,
  };

  UNSAFE_componentWillMount() {
    this.setPropsToState(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState(props) {
    let { touched, focused } = this.state;
    let newState = { touched };
    if (typeof props.touched === 'boolean' && touched !== props.touched) {
      newState.touched = props.touched;
    }
    if (newState.touched && !focused) {
      newState.error = this.validate(props.value);
    }
    this.setState(newState);
  }

  handleFocus = (...args) => {
    this.setState({ focused: true });
    this.props.onFocus(...args);
  };

  handleBlur = (...args) => {
    let { immediate } = this.props;
    this.setState({
      focused: false,
      touched: true,
      ...(!immediate ? { error: this.validate(this.props.value) } : {}),
    });
    this.props.onBlur(...args);
  };

  handleChange = (value) => {
    let { immediate } = this.props;
    let { focused, error } = this.state;
    if (immediate || (focused && error)) {
      this.setState({
        touched: true,
        error: this.validate(value),
      });
    }
    this.props.onChange(value);
  };

  validate = (value) => {
    return this.props.validation(value) || null;
  };

  render() {
    let { value, children, render } = this.props;
    let { error } = this.state;
    let fn = typeof children === 'function' ? children : render;
    return fn(
      value,
      this.handleFocus,
      this.handleBlur,
      this.handleChange,
      error
    );
  }
}

export const withValidation = (
  MyComponent,
  { immediate = false, valueProp = 'value' } = {}
) =>
  function WithValidation({
    [valueProp]: value,
    touched,
    onFocus,
    onBlur,
    onChange,
    validation,
    ...props
  }) {
    return (
      <Validation
        value={value}
        touched={touched}
        immediate={immediate}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        validation={validation}
      >
        {(val, handleFocus, handleBlur, handleChange, error) => {
          let hocProps = {
            [valueProp]: val,
            error,
            onFocus: handleFocus,
            onBlur: handleBlur,
            onChange: handleChange,
          };
          return <MyComponent {...props} {...hocProps} />;
        }}
      </Validation>
    );
  };
