import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled', 'min', 'max', 'step'];

class FormFieldRange extends Component {
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
      id: props.id || props.name && 'ff-range-' + props.name,
      focused: false,
      touched: false,
      errors: null,
      ...this.state,
      val: Number(props.value),
    };
  }

  handleChange(ev) {
    let { errors, focused } = this.state;
    let val = Number(ev.target.value);

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
    let { className, label, disabled, size } = this.props;
    let { id, val, errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--range ' + className}>
        {label !== false &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control" type="range"
            style={{ width: size + 'em' }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange.bind(this)}
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

FormFieldRange.defaultProps = {
  className: '',
  label: false,
  value: 0,
  disabled: false,

  debounce: 200,
  size: 100,
  min: 0,
  max: 100,
  step: 1,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldRange;
