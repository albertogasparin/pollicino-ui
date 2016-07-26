import React, { Component, PropTypes } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled'];

class FormFieldSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      focused: false,
      errors: null,
      ...this.getPropsToState(props),
    };
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.getPropsToState(nextProps);
    this.setState(newState);
    if (this.state.touched) { // validation: punish late
      this.validate(newState.val);
    }
  }

  getPropsToState(props) {
    let newState = {
      id: props.id || props.name && 'ff-select-' + props.name,
      opts: [
        { label: props.placeholder, value: '' },
        ...props.options,
      ],
      val: props.value,
    };
    return newState;
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
    let selectedOpt = this.findOption(val) || {};
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--select ' + className}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <span className="FormField-value">
            {valueRenderer(selectedOpt.label)}
          </span>
          <select id={id} className="FormField-control"
            value={selectedOpt.value}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange.bind(this)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          >
            {opts.map((o, i) => (
              <option key={i} value={o.value}>{o.label || o.value}</option>)
            )}
          </select>
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.any,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueRenderer: PropTypes.func,

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldSelect.defaultProps = {
  className: '',
  value: '',
  placeholder: '— Select —',
  debounce: 200,

  valueRenderer: (v) => v,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldSelect;
