import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _pick from 'lodash/pick';

import { withDebounce, withValidation } from '../HOC';
import Btn from '../Btn';

// prettier-ignore
const INPUT_PROPS = [
  'name', 'disabled', 'min', 'max', 'placeholder', 'autoFocus', 'tabIndex', 'readOnly'
];

/**
 * @class FormFieldNumber
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
      style?: Object
      value?: number
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
    }, any>}
 */
class FormFieldNumber extends Component {
  static propTypes = {
    className: PropTypes.string,
    decimals: PropTypes.number,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    id: PropTypes.string,
    label: PropTypes.node,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.number,
    style: PropTypes.object,
    value: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    decimals: 0,
    size: 100,
    step: 1,
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
      id: props.id || (props.name && 'ff-number-' + props.name),
    });
  };

  clamp = (val) => {
    let { min, max, decimals } = this.props;
    val = Number(val.toFixed(decimals));
    if (typeof min !== 'undefined' && val < min) {
      val = Number(min);
    }
    if (typeof max !== 'undefined' && val > max) {
      val = Number(max);
    }
    return val;
  };

  preciseSum = (val1, val2) => {
    let decimals = Math.max(
      0,
      Number((String(val1).split('.')[1] || '').length),
      Number((String(val2).split('.')[1] || '').length)
    );
    decimals = Math.min(decimals, this.props.decimals);
    return Number((val1 + val2).toFixed(decimals));
  };

  handleChange = (ev, val) => {
    let isValProvided = typeof val === 'number';
    let { target } = ev;
    if (isValProvided) {
      val = this.clamp(val);
    } else {
      if (target.value === '') {
        window.requestAnimationFrame(() => (target.value = ''));
        return;
      }
      val = Number(target.value.replace(/[^\d.-]/g, ''));
    }

    this.setState({ val });
    this.props.onChange(val);
  };

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
    let { val } = this.state;
    let clamped = this.clamp(val);
    if (clamped !== val) {
      this.props.onChange(clamped);
    }
    this.setState({ focused: false, val: clamped });
    this.props.onBlur(ev);
  };

  render() {
    let { className, style, label, disabled, readOnly, size, step, error } =
      this.props;
    let { id, val, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--number ' + className} style={style}>
        {typeof label !== 'undefined' && (
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="FormField-field">
          <input
            id={id}
            className="FormField-control"
            type="number"
            pattern="[\d.-]*"
            style={{ width: `calc(${size}ch + 2em)` }}
            autoComplete="off"
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {!disabled && !readOnly && (
            <Btn
              tagName="span"
              className="FormField-spin FormField-spin--plus"
              disabled={disabled}
              onClick={(ev) =>
                this.handleChange(ev, this.preciseSum(val, step))
              }
            />
          )}
          {!disabled && !readOnly && (
            <Btn
              tagName="span"
              className="FormField-spin FormField-spin--minus"
              disabled={disabled}
              onClick={(ev) =>
                this.handleChange(ev, this.preciseSum(val, -step))
              }
            />
          )}
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(withValidation(FormFieldNumber));
export { FormFieldNumber };
