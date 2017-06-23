import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Icon from '../Icon';

const INPUT_PROPS = ['name', 'disabled', 'type'];

class FormFieldTick extends Component {

  state = {
    touched: false,
    focused: false,
    error: null,
  }

  componentWillMount () {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = props.value;
    this.setState(({ touched }) => ({
      id: props.id || 'ff-tick-' + props.name + '-' + String(val).replace(/[^\w]/g,''),
      checked: props.checked,
      ...(props.touched ? { touched: true } : {}),
    }), () => {
      if (this.state.touched) {
        this.validate();
      }
    });
  }

  handleChange = (ev) => {
    let { type, value } = this.props;
    let checked = (type !== 'radio' || !this.state.checked) ? !this.state.checked : true;
    this.setState({ checked, ...this.validate(checked, false) });
    this.triggerOnChange(value, checked);
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

  /*
   * @public
   */
  validate = (checked = this.state.checked, updateState = true) => {
    let error = this.props.validation(checked) || null;
    if (updateState && error !== this.state.error) {
      this.setState({ error });
    }
    return { error };
  }

  render () { // eslint-disable-line complexity
    let { className, style, label, value, type, disabled } = this.props;
    let { id, checked, error } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += checked ? ' isChecked' : '';
    className += error ? ' isInvalid' : '';
    let boxtype = type === 'radio' ? 'radiobox' : type;
    return (
      <div className={'FormField FormField--' + boxtype + ' ' + className} style={style}>
        <div className="FormField-field">
          <input id={id} className="FormField-control"
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
            <span className="FormField-value">
              {label || value}
            </span>
          </label>
          {error &&
            <p className="FormField-error">{error}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldTick.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.any.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,
  touched: PropTypes.bool,

  type: PropTypes.oneOf(['radio', 'checkbox']),
  checked: PropTypes.bool,

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldTick.defaultProps = {
  className: '',

  debounce: 50,
  checked: false,
  type: 'radio',

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldTick;
