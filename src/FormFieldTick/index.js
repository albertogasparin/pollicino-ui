import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Icon from '../Icon';

const INPUT_PROPS = ['name', 'disabled', 'tabIndex', 'type'];

/**
 * @class FormFieldTick
 * @augments {Component<{
      [x:string]: any
      checked?: boolean
      className?: string
      debounce?: number
      disabled?: boolean
      id?: string
      label?
      name?: string
      readOnly?: boolean
      style?: any
      touched?: boolean
      type?: 'radio' | 'checkbox'
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
    }, any>}
 */
class FormFieldTick extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    debounce: PropTypes.number,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    touched: PropTypes.bool,
    type: PropTypes.oneOf(['radio', 'checkbox']),
    value: PropTypes.any,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validation: PropTypes.func,
  };

  static defaultProps = {
    checked: false,
    className: '',
    debounce: 50,
    type: 'radio',
    onBlur() {},
    onChange() {},
    onFocus() {},
    validation() {},
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
    this.setState(
      ({ touched }) => ({
        id:
          props.id ||
          'ff-tick-' + props.name + '-' + String(val).replace(/[^\w]/g, ''),
        checked: props.checked,
        ...(props.touched ? { touched: true } : {}),
      }),
      () => {
        if (this.state.touched) {
          this.validate();
        }
      }
    );
  };

  handleChange = ev => {
    let { type, value, disabled, readOnly } = this.props;
    let checked =
      type !== 'radio' || !this.state.checked ? !this.state.checked : true;
    if (disabled || readOnly) {
      return;
    }
    this.setState({ checked, ...this.validate(checked, false) });
    this.triggerOnChange(value, checked);
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
  validate = (checked = this.state.checked, updateState = true) => {
    let error = this.props.validation(checked) || null;
    if (updateState && error !== this.state.error) {
      this.setState({ error });
    }
    return { error };
  };

  // eslint-disable-next-line complexity
  render() {
    let {
      className,
      style,
      label,
      value,
      type,
      disabled,
      readOnly,
    } = this.props;
    let { id, checked, error } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += checked ? ' isChecked' : '';
    className += error ? ' isInvalid' : '';
    let boxtype = type === 'radio' ? 'radiobox' : type;
    return (
      <div
        className={'FormField FormField--' + boxtype + ' ' + className}
        style={style}
      >
        <div className="FormField-field">
          <input
            id={id}
            className="FormField-control"
            checked={checked}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <label className="FormField-label" htmlFor={id}>
            <i className="FormField-tick">
              <Icon glyph={`${boxtype}-${checked ? 'marked' : 'blank'}`} />
            </i>
            <span className="FormField-value">{label || value}</span>
          </label>
          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldTick;
