import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled'];

class FormFieldSelect extends Component {

  constructor (props) {
    super(props);
    this.state = {
      touched: false,
      focused: false,
      errors: null,
      ...this.mapPropsToState(props),
    };
  }

  componentWillReceiveProps (nextProps) {
    let newState = this.mapPropsToState(nextProps);
    this.setState(newState);
    if (this.state.touched) { // validation: punish late
      this.validate(newState.val);
    }
  }

  mapPropsToState = (props) => {
    return {
      id: props.id || props.name && 'ff-select-' + props.name,
      opts: [
        { label: props.placeholder, value: '' },
        ...props.options,
      ],
      val: props.value,
    };
  }

  findOption = (val) => {
    let option = null;
    this.state.opts.some((o) => (
      String(o.value) === String(val) ? (option = o) : false
    ));
    return option;
  }

  handleChange = (ev) => {
    let { opts } = this.state;
    let val = opts[ev.target.selectedIndex].value;

    this.validate(val);
    this.setState({ val });
    this.triggerOnChange(val);
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    this.setState({ focused: false, touched: true });
    this.props.onBlur(ev);
  }

  triggerOnChange = _debounce((...args) => {
    this.props.onChange(...args); // call the fresh prop
  }, this.props.debounce)

  /**
   * @public
   */
  validate = (val = this.state.val) => {
    let errors = this.props.validation(val) || null;
    this.setState({ errors });
    return errors;
  }

  render () {
    let { className, style, label, valueRenderer, disabled } = this.props;
    let { id, opts, val, errors, focused } = this.state;
    let selectedOpt = this.findOption(val) || {};
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--select ' + className} style={style}>
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
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
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
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.any, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  options: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line react/no-unused-prop-types
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
  debounce: 50,

  valueRenderer: (v) => v,

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldSelect;
