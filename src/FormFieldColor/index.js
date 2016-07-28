import React, { Component, PropTypes } from 'react';
import _debounce from 'lodash/debounce';
import ColorPicker from 'react-simple-colorpicker';

import Dropdown from '../Dropdown';

class FormFieldColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      touched: false,
      ...this.getPropsToState(props),
    };
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getPropsToState(nextProps));
  }

  getPropsToState(props) {
    let newState = {
      val: props.value || props.defaultValue,
    };
    return newState;
  }

  handleChange(color) {
    this.setState({ val: color });
    this.triggerOnChange(color);
  }

  handleFocus(ev) {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur(ev) {
    let { val } = this.state;
    this.setState({ focused: false, touched: true });
    this.triggerOnChange(val);
    this.props.onBlur(ev);
  }

  triggerOnChange(...args) {
    this.props.onChange(...args);
  }

  renderFieldValue() {
    return (
      <span className="FormField-swatch"
        style={{ backgroundColor: this.state.val }}
      />
    );
  }

  renderDropdownContent() {
    return (
      <ColorPicker
        color={this.state.val}
        onChange={this.handleChange.bind(this)}
        opacitySlider={this.props.opacity}
      />
    );
  }

  render() {
    let { className, label, disabled, align } = this.props;
    className += disabled ? ' isDisabled' : '';

    return (
      <div className={'FormField FormField--color ' + className}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field" ref="field">
          <Dropdown className="Dropdown--field" ref="dropdown"
            label={this.renderFieldValue()}
            align={align} disabled={disabled}
            onOpen={(ev) => this.handleFocus(ev)}
            onClose={(ev) => this.handleBlur(ev)}
          >
            {this.renderDropdownContent()}
          </Dropdown>
        </div>
      </div>
    );
  }
}

FormFieldColor.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  defaultValue: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right']),
  opacity: PropTypes.bool,
  onChange: PropTypes.func,
};

FormFieldColor.defaultProps = {
  className: '',
  value: '',

  defaultValue: 'rgba(0,0,0,1)',
  debounce: 200,
  align: 'left',

  onChange() {},
};

export default FormFieldColor;
