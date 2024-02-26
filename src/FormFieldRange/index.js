import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _pick from 'lodash/pick';

import { withDebounce, withValidation } from '../HOC';

const INPUT_PROPS = ['name', 'disabled', 'min', 'max', 'step', 'tabIndex'];

/**
 * @class FormFieldRange
 * @augments {Component<{
      [x:string]: any
      className?: string
      disabled?: boolean
      error?: any
      id?: string
      label?
      max?: string | number
      min?: string | number
      name?: string
      readOnly?: boolean
      size?: string | number
      step?: string | number
      style?: Object
      value?: number
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
    }, any>}
 */
class FormFieldRange extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    id: PropTypes.string,
    label: PropTypes.node,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    value: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    size: 100,
    value: 0,
    onBlur() {},
    onChange() {},
    onFocus() {},
  };

  state = {
    focused: false,
  };

  UNSAFE_componentWillMount() {
    this.setPropsToState(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = Number(props.value);
    this.setState({
      val,
      id: props.id || (props.name && 'ff-range-' + props.name),
    });
  };

  handleChange = (ev) => {
    let { disabled, readOnly } = this.props;
    let val = Number(ev.target.value);
    if (disabled || readOnly) {
      return;
    }

    this.setState({ val });
    this.props.onChange(val);
  };

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
    this.setState({ focused: false });
    this.props.onBlur(ev);
  };

  render() {
    let { className, style, label, disabled, error, readOnly, size } =
      this.props;
    let { id, val, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--range ' + className} style={style}>
        {typeof label !== 'undefined' && (
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="FormField-field">
          <input
            id={id}
            className="FormField-control"
            type="range"
            style={{ width: `calc(${size}ch + 2em)` }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(
  withValidation(FormFieldRange, { immediate: true })
);
export { FormFieldRange };
