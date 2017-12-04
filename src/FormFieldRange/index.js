import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled', 'min', 'max', 'step', 'tabIndex'];

/**
 * @class FormFieldRange
 * @augments {Component<{
      [x:string]: any
      className?: string
      debounce?: number
      disabled?: boolean
      id?: string
      label?
      max?: string | number
      min?: string | number
      name?: string
      readOnly?: boolean
      size?: string | number
      step?: string | number
      style?: Object
      touched?: boolean
      value?: number
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
    }, any>}
 */
class FormFieldRange extends Component {
  static propTypes = {
    className: PropTypes.string,
    debounce: PropTypes.number,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    touched: PropTypes.bool,
    value: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validation: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    debounce: 200,
    size: 100,
    value: 0,
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
    let val = Number(props.value);
    this.setState(
      ({ touched }) => ({
        val,
        id: props.id || (props.name && 'ff-range-' + props.name),
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
    let { disabled, readOnly } = this.props;
    let { error, focused } = this.state;
    let val = Number(ev.target.value);
    if (disabled || readOnly) {
      return;
    }

    this.setState({
      val,
      ...(error && focused ? this.validate(val, false) : {}),
    });
    this.triggerOnChange(val);
  };

  handleFocus = ev => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = ev => {
    this.setState(({ val }) => ({
      focused: false,
      touched: true,
      ...this.validate(val, false),
    }));
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

  // eslint-disable-next-line complexity
  render() {
    let { className, style, label, disabled, readOnly, size } = this.props;
    let { id, val, error, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--range ' + className} style={style}>
        {typeof label !== 'undefined' && (
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="FormField-field">
          <input
            id={id}
            className="FormField-control"
            type="range"
            style={{ width: `calc(${size}ch + 2em)` }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldRange;
