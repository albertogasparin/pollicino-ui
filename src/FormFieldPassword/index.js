import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Btn from '../Btn';
import Icon from '../Icon';

const INPUT_PROPS = ['name', 'disabled', 'placeholder', 'autoFocus'];

class FormFieldPassword extends Component {
  constructor(props) {
    super(props);
    this.assignPropsToState(props);
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    this.assignPropsToState(nextProps);
    if (this.state.touched) { // validation: punish late
      this.validate();
    }
  }

  assignPropsToState(props) {
    this.state = {
      id: props.id || props.name && 'ff-password-' + props.name,
      touched: false,
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
    this.setState({ focused: false, touched: true }, this.validate);
    this.props.onBlur(ev);
  }

  triggerOnChange(...args) {
    this.props.onChange(...args);
  }

  /**
   * @public
   */
  validate(val = this.state.val) {
    let errors = this.props.validation(val) || null;
    this.setState({ errors });
    return errors;
  }

  renderToggleButton(type) {
    return (
      <span className={'FormField-togglePsw ' + (!type ? 'isVisible' : '')}>
        <Btn className="Btn--square"
          data-tip={type ? 'Show' : 'Hide'} data-tip-right
          onClick={() => this.handleTypeToggle()}
        >
          <Icon glyph="eye" />
        </Btn>
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
          <input id={id} className="FormField-control FormField-control--iconR" type={type}
            style={{ width: size + 'em' }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
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

export default FormFieldPassword;
