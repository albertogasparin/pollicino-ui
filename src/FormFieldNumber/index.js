import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import './style.scss';

class FormFieldNumber extends Component {
  constructor(props) {
    super(props);
    this.assignPropsToState(props);
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    this.assignPropsToState(nextProps);
    if (!this.state.focused) { // validation: punish late
      this.validate();
    }
  }

  assignPropsToState(props) {
    this.state = {
      id: props.id || 'input-' + Math.random().toString(16).substr(8),
      focused: false,
      errors: null,
      ...this.state,
      val: Number(props.value),
    };
  }

  clamp(val) {
    let { min, max } = this.props;
    if (min !== false && val < min) {
      val = Number(min);
    }
    if (max !== false && val > max) {
      val = Number(max);
    }
    return val;
  }

  handleChange(ev, val) {
    let { errors, focused } = this.state;
    val = val || Number(ev.target.value.replace(/[^0-9]/g,''));
    val = this.clamp(val);

    if (!focused || errors && focused) { // validation: reward early
      this.validate(val);
    }
    this.setState({ val });
    this.triggerOnChange(val);
  }

  handleFocus(ev) {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur(ev) {
    this.setState({ focused: false });
    this.props.onBlur(ev);
  }

  triggerOnChange(...args) {
    this.props.onChange(...args);
  }

  /**
   * @public
   */
  validate(val = this.state.val) {
    let errors = this.props.validation(val);
    this.setState({ errors });
    return errors;
  }

  render() {
    let { className, label, disabled, size } = this.props;
    let { id, val, errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--number ' + className}>
        {label !== false &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control" type="number" pattern="[0-9]*"
            style={{ width: size + 'em' }}
            value={val}
            {..._pick(this.props, 'name', 'disabled', 'min', 'max')}
            onChange={this.handleChange.bind(this)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          />
          <button className="FormField-spin FormField-spin--plus"
            type="button" disabled={disabled}
            onClick={(ev) => this.handleChange(ev, val + 1)}
          >
          </button>
          <button className="FormField-spin FormField-spin--minus"
            type="button" disabled={disabled}
            onClick={(ev) => this.handleChange(ev, val - 1)}
          >
          </button>
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldNumber.defaultProps = {
  className: '',
  label: false,
  value: 0,
  name: '',
  disabled: false,

  debounce: 200,
  size: 100,
  min: false,
  max: false,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export { FormFieldNumber };
