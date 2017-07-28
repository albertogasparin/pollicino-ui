import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import ColorPicker from 'react-simple-colorpicker';

import Dropdown from '../Dropdown';

class FormFieldColor extends Component {
  state = {
    focused: false,
    touched: false,
    error: null,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = props => {
    let val = props.value || props.defaultValue;
    this.setState(
      ({ touched }) => ({
        val,
        ...(props.touched ? { touched: true } : {}),
      }),
      () => {
        if (this.state.touched) {
          this.validate();
        }
      }
    );
  };

  handleChange = color => {
    this.setState({ val: color, ...this.validate(color, false) });
    this.triggerOnChange(color);
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

  renderFieldValue = () => {
    return (
      <span
        className="FormField-swatch"
        style={{ backgroundColor: this.state.val }}
      />
    );
  };

  renderDropdownContent = () => {
    return (
      <ColorPicker
        color={this.state.val}
        onChange={this.handleChange}
        opacitySlider={this.props.opacity}
      />
    );
  };

  render() {
    let { className, style, label, disabled, align, tabIndex } = this.props;
    let { error } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';

    return (
      <div className={'FormField FormField--color ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label">
            {label}
          </label>}
        <div className="FormField-field">
          <Dropdown
            className="Dropdown--field"
            label={this.renderFieldValue()}
            align={align}
            disabled={disabled}
            tabIndex={tabIndex}
            onOpen={this.handleFocus}
            onClose={this.handleBlur}
          >
            {this.renderDropdownContent()}
          </Dropdown>
          {error &&
            <p className="FormField-error">
              {error}
            </p>}
        </div>
      </div>
    );
  }
}

FormFieldColor.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,
  touched: PropTypes.bool,

  defaultValue: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right']),
  opacity: PropTypes.bool,

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldColor.defaultProps = {
  className: '',
  value: '',

  defaultValue: 'rgba(0,0,0,1)',
  debounce: 200,
  align: 'left',

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldColor;
