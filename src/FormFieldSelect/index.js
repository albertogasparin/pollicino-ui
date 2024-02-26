import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _pick from 'lodash/pick';

import { withDebounce, withValidation } from '../HOC';

const INPUT_PROPS = ['name', 'disabled', 'tabIndex', 'readOnly'];

/**
 * @class FormFieldSelect
 * @augments {Component<{
      [x:string]: any
      className?: string
      disabled?: boolean
      error?: any
      id?: string
      label?
      name?: string
      options: Array<{ label, value }>
      placeholder?: string
      readOnly?: boolean
      style?: Object
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      valueRenderer?: Function
    }, any>}
 */
class FormFieldSelect extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
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
    placeholder: '— Select —',
    size: '',
    value: '',
    onBlur() {},
    onChange() {},
    onFocus() {},
    valueRenderer: (v) => v,
  };

  state = {
    focused: false,
  };

  UNSAFE_componentWillMount() {
    this.setPropsToState(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = props.value;
    let opts = [{ label: props.placeholder, value: '' }, ...props.options];
    this.setState({
      val,
      opts,
      id: props.id || (props.name && 'ff-select-' + props.name),
    });
  };

  findOption = (val) => {
    let option = null;
    this.state.opts.some((o) =>
      String(o.value) === String(val) ? ((option = o), true) : false
    );
    return option;
  };

  handleChange = (ev) => {
    let { opts } = this.state;
    let val = opts[ev.target.selectedIndex].value;
    this.setState({ val });
    this.props.onChange(val);
  };

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
    this.setState({ focused: false });
    this.props.onBlur(ev);
  };

  render() {
    let { className, style, label, valueRenderer, disabled, readOnly, error } =
      this.props;
    let { id, opts, val, focused } = this.state;
    let selectedOpt = this.findOption(val) || {};
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
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
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(
  withValidation(FormFieldSelect, { immediate: true })
);
export { FormFieldSelect };
