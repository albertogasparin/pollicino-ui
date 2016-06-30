import React, { Component } from 'react';
import _ from 'lodash';

import './style.scss';

class FormFieldText extends Component {
  constructor(props) {
    super(props);
    this.assignPropsToState(props);
    this.triggerOnChange = _.debounce(this.triggerOnChange, props.debounce);
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
      val: props.value,
    };
  }

  handleChange(ev) {
    let { errors, focused } = this.state;
    let val = ev.target.value;

    if (errors && focused) { // validation: reward early
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
      <div className={'FormField FormField--text ' + className}>
        {label !== false &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control"
            style={{ width: size + 'em' }}
            value={val}
            {..._.pick(this.props, 'type', 'name', 'disabled', 'placeholder')}
            onChange={(ev) => this.handleChange(ev)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          />
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldText.defaultProps = {
  className: '',
  label: false,
  value: '',
  name: '',
  placeholder: '',
  disabled: false,

  type: 'text',
  debounce: 200,
  size: 100,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export { FormFieldText };
