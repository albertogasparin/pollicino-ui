import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled', 'tabIndex'];

/**
 * @class FormFieldSelect
 * @augments {Component<{
      [x:string]: any
      className?: string
      debounce?: number
      disabled?: boolean
      id?: string
      label?
      name?: string
      options: Array<{ label, value }>
      placeholder?: string
      style?: Object
      touched?: boolean
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
      valueRenderer?: Function
    }, any>}
 */
class FormFieldSelect extends Component {
  static propTypes = {
    className: PropTypes.string,
    debounce: PropTypes.number,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    touched: PropTypes.bool,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validation: PropTypes.func,
    valueRenderer: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    debounce: 50,
    placeholder: '— Select —',
    size: '',
    value: '',
    onBlur() {},
    onChange() {},
    onFocus() {},
    validation() {},
    valueRenderer: v => v,
  };

  state = {
    error: null,
    focused: false,
    touched: false,
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
      o => (String(o.value) === String(val) ? ((option = o), true) : false)
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
        {typeof label !== 'undefined' && (
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="FormField-field">
          <span className="FormField-value">
            {valueRenderer(selectedOpt.label)}
          </span>
          <select
            id={id}
            className="FormField-control"
            value={selectedOpt.value}
            {..._pick(this.props, INPUT_PROPS)}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
          >
            {opts.map((o, i) => (
              <option key={i} value={o.value}>
                {o.label || o.value}
              </option>
            ))}
          </select>
          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldSelect;
