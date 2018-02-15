import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';

function getWrappedChange(onChange, debounce) {
  return debounce ? _debounce(onChange, debounce) : onChange;
}

/**
 * @class Debounce
 * @augments {Component<{
      value?: any
      debounce?: number
      onChange: Function
      render?: Function
    }, any>}
 */
export class Debounce extends Component {
  static propTypes = {
    value: PropTypes.any,
    debounce: PropTypes.number,
    onChange: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.func,
  };

  static defaultProps = {
    onChange() {},
  };

  state = {
    value: this.props.value,
  };

  isChanging = false;

  componentWillReceiveProps(nextProps) {
    let { debounce, value } = this.props;
    if (nextProps.debounce !== debounce) {
      this.wrappedChange = getWrappedChange(this.onChange, nextProps.debounce);
    }
    if (nextProps.value !== value && !this.isChanging) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange = (value) => {
    this.isChanging = false;
    this.props.onChange(value);
  };

  wrappedChange = getWrappedChange(this.onChange, this.props.debounce);

  handleChange = (value) => {
    this.isChanging = true;
    this.setState({ value });
    this.wrappedChange(value);
  };

  render() {
    let { children, render } = this.props;
    let { value } = this.state;
    let fn = typeof children === 'function' ? children : render;
    return fn(value, this.handleChange);
  }
}

export const withDebounce = (MyComponent, { valueProp = 'value' } = {}) =>
  function WithDebounce({
    debounce = 0,
    onChange,
    [valueProp]: value,
    ...props
  }) {
    return (
      <Debounce debounce={debounce} value={value} onChange={onChange}>
        {(val, handleChange) => {
          let hocProps = {
            [valueProp]: val,
            onChange: handleChange,
          };
          return <MyComponent {...props} {...hocProps} />;
        }}
      </Debounce>
    );
  };
