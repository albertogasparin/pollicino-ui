import React, { Component } from 'react';
import _ from 'lodash';

import { Icon } from '../Icon';

import './style.scss';

class FormFieldPassword extends Component {
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
      type: 'password',
      ...this.state,
      val: props.value,
    };
  }

  handleTypeToggle() {
    let type = this.state.type ? '' : 'password';
    this.setState({ type });
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

  renderToggleButton(type) {
    return (
      <span className={'FormField-togglePsw ' + (!type ? 'isVisible' : '')}>
        <button className="Btn Btn--square"
          type="button" data-tip={type ? 'Show' : 'Hide'} data-tip-right
          onClick={() => this.handleTypeToggle()}
        >
          <Icon glyph="eye" />
        </button>
      </span>
    );
  }

  render() {
    let { className, label, disabled, size } = this.props;
    let { id, val, type, errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--password ' + className}>
        {label !== false &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control" type={type}
            style={{ width: size + 'em' }}
            value={val}
            {..._.pick(this.props, 'name', 'disabled', 'placeholder')}
            onChange={this.handleChange.bind(this)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          />
          {this.renderToggleButton(type)}
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldPassword.defaultProps = {
  className: '',
  label: false,
  value: '',
  name: '',
  placeholder: '',
  disabled: false,

  debounce: 500,
  size: 100,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export { FormFieldPassword };
