import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

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
      debounce?: number
      disabled?: boolean
      id?: string
      label?
      max?: string | number
      min?: string | number
      name?: string
      readOnly?: boolean
      size?: string | number
      style?: Object
      touched?: boolean
      value?: number
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
    }, any>}
 */
class FormFieldNumber extends Component {
  static propTypes = {
    className: PropTypes.string,
    debounce: PropTypes.number,
    decimals: PropTypes.number,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.number,
    style: PropTypes.object,
    touched: PropTypes.bool,
    value: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validation: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    decimals: 0,
    debounce: 200,
    size: 100,
    step: 1,
    value: 0,
    onBlur() {},
    onChange() {},
    onFocus() {},
    validation() {},
  };

  state = {
    error: null,
    focused: false,
    touched: false,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = props => {
    let val = Number(props.value);
    this.setState(
      ({ touched }) => ({
        val,
        id: props.id || (props.name && 'ff-number-' + props.name),
        ...(props.touched ? { touched: true } : {}),
      }),
      () => {
        if (this.state.touched) {
          this.validate();
        }
      }
    );
  };

  clamp = val => {
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
    let { error, focused } = this.state;
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

    this.setState({
      val,
      ...(isValProvided ? { touched: true } : {}),
      ...(!focused || (error && focused) ? this.validate(val, false) : {}),
    });
    this.triggerOnChange(val);
  };

  handleFocus = ev => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
    let { val } = this.state;
    let clamped = this.clamp(val);
    if (clamped !== val) {
      this.triggerOnChange(clamped);
    }
    this.setState({
      focused: false,
      touched: true,
      val: clamped,
      ...this.validate(clamped, false),
    });
    this.props.onBlur(ev);
  };

  triggerOnChange = _debounce((...args) => {
    this.props.onChange(...args); // call the fresh prop
  }, this.props.debounce);

  /*
   * @public
   */
  validate = (val = this.state.val, updateState = true) => {
    let error = this.props.validation(val) || null;
    if (updateState && error !== this.state.error) {
      this.setState({ error });
    }
    return { error };
  };

  render() {
    let {
      className,
      style,
      label,
      disabled,
      readOnly,
      size,
      step,
    } = this.props;
    let { id, val, error, focused } = this.state;
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
          {!disabled &&
            !readOnly && (
              <Btn
                tagName="span"
                className="FormField-spin FormField-spin--plus"
                disabled={disabled}
                onClick={ev =>
                  this.handleChange(ev, this.preciseSum(val, step))
                }
              />
            )}
          {!disabled &&
            !readOnly && (
              <Btn
                tagName="span"
                className="FormField-spin FormField-spin--minus"
                disabled={disabled}
                onClick={ev =>
                  this.handleChange(ev, this.preciseSum(val, -step))
                }
              />
            )}
          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldNumber;
