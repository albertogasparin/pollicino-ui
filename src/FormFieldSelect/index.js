import React, { Component } from 'react';
import _ from 'lodash';

import './style.scss';

class FormFieldSelect extends Component {
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
      opts: [
        { label: props.placeholder, value: '' },
        ...props.options,
      ],
      ...this.state,
      val: props.value,
    };
  }

  findOption(val) {
    return _.find(this.state.opts, (o) => String(o.value) === String(val));
  }

  handleChange(ev) {
    let { opts, errors, focused } = this.state;
    let val = opts[ev.target.selectedIndex].value;

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
    let { className, label, valueRenderer, disabled } = this.props;
    let { id, opts, val, errors, focused } = this.state;
    let selectedOpts = this.findOption(val) || {};
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--select ' + className}>
        {label !== false &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <span className="FormField-value">
            {valueRenderer(selectedOpts.label)}
          </span>
          <select id={id} className="FormField-control"
            value={selectedOpts.value}
            {..._.pick(this.props, 'name', 'disabled')}
            onChange={this.handleChange.bind(this)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          >
            {_.map(opts, (o, i) => <option key={i} value={o.value}>{o.label}</option>)}
          </select>
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldSelect.defaultProps = {
  className: '',
  label: false,
  value: '',
  placeholder: '— Select —',
  disabled: false,

  options: [],
  valueRenderer: (v) => v,
  debounce: 200,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export { FormFieldSelect };
