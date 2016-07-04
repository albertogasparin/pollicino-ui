import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled'];

class FormFieldSelect extends Component {
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
      id: props.id || props.name && 'ff-select-' + props.name,
      focused: false,
      touched: false,
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
    let option = null;
    this.state.opts.some((o) => (
      String(o.value) === String(val) ? (option = o) : false
    ));
    return option;
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
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange.bind(this)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          >
            {opts.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
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

export default FormFieldSelect;
