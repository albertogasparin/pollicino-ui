import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = ['name', 'disabled', 'min', 'max', 'autoFocus', 'autoComplete'];

class FormFieldNumber extends Component {
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
      id: props.id || props.name && 'ff-number-' + props.name,
      val: Number(props.value),
    };
  }

  clamp = (val) => {
    let { min, max } = this.props;
    if (typeof min !== 'undefined' && val < min) {
      val = Number(min);
    }
    if (typeof max !== 'undefined' && val > max) {
      val = Number(max);
    }
    return val;
  }

  handleChange = (ev, val) => {
    let { errors, focused } = this.state;
    val = val || Number(ev.target.value.replace(/[^0-9]/g, ''));
    val = this.clamp(val);

    if (!focused || errors && focused) { // validation: reward early
      this.validate(val);
    }
    this.setState({ val });
    this.triggerOnChange(val);
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    this.setState({ focused: false, touched: true }, this.validate);
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
    let { className, style, label, disabled, size } = this.props;
    let { id, val, errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--number ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control" type="number" pattern="[0-9]*"
            style={{ width: size + 'em' }} autoComplete="off"
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <button className="FormField-spin FormField-spin--plus"
            type="button" disabled={disabled}
            onClick={(ev) => this.handleChange(ev, val + 1)}
          >
          </button>
          <button className="FormField-spin FormField-spin--minus"
            type="button" disabled={disabled}
            onClick={(ev) => this.handleChange(ev, val - 1)}
          >
          </button>
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldNumber.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autoComplete: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  autoFocus: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldNumber.defaultProps = {
  className: '',
  value: 0,

  debounce: 200,
  size: 100,

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldNumber;
