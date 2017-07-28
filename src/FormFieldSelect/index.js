import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled', 'tabIndex'];

class FormFieldSelect extends Component {
  state = {
    touched: false,
    focused: false,
    error: null,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = props => {
    let val = props.value;
    let opts = [{ label: props.placeholder, value: '' }, ...props.options];
    this.setState(
      ({ touched }) => ({
        val,
        opts,
        id: props.id || (props.name && 'ff-select-' + props.name),
        ...(props.touched ? { touched: true } : {}),
      }),
      () => {
        if (this.state.touched) {
          this.validate();
        }
      }
    );
  };

  findOption = val => {
    let option = null;
    this.state.opts.some(
      o => (String(o.value) === String(val) ? (option = o) : false)
    );
    return option;
  };

  handleChange = ev => {
    let { opts } = this.state;
    let val = opts[ev.target.selectedIndex].value;

    this.setState({ val, ...this.validate(val, false) });
    this.triggerOnChange(val);
  };

  handleFocus = ev => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = ev => {
    this.setState({ focused: false, touched: true });
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
    let { className, style, label, valueRenderer, disabled } = this.props;
    let { id, opts, val, error, focused } = this.state;
    let selectedOpt = this.findOption(val) || {};
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--select ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>}
        <div className="FormField-field">
          <span className="FormField-value">
            {valueRenderer(selectedOpt.label)}
          </span>
          <select
            id={id}
            className="FormField-control"
            value={selectedOpt.value}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          >
            {opts.map((o, i) =>
              <option key={i} value={o.value}>
                {o.label || o.value}
              </option>
            )}
          </select>
          {error &&
            <p className="FormField-error">
              {error}
            </p>}
        </div>
      </div>
    );
  }
}

FormFieldSelect.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.any,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,
  touched: PropTypes.bool,

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
  debounce: 50,

  valueRenderer: v => v,
  size: '',

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldSelect;
