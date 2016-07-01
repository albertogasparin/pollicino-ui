import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import ColorPicker from 'react-simple-colorpicker';

import { Dropdown } from '../Dropdown';

import './style.scss';

class FormFieldColor extends Component {
  constructor(props) {
    super(props);
    this.assignPropsToState(props);
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    this.assignPropsToState(nextProps);
  }

  assignPropsToState(props) {
    this.state = {
      col: props.value || props.defaultValue,
    };
  }

  handleColorChange(color) {
    this.setState({ col: color });
    this.triggerOnChange(color);
  }

  triggerOnChange(...args) {
    this.props.onChange(...args);
  }

  renderFieldValue() {
    return (
      <span className="FormField-swatch"
        style={{ backgroundColor: this.state.col }}
      />
    );
  }

  renderDropdownContent() {
    return (
      <ColorPicker
        color={this.state.col}
        onChange={this.handleColorChange.bind(this)}
        opacitySlider={this.props.opacity}
      />
    );
  }

  render() {
    let { className, label, disabled, align } = this.props;
    className += disabled ? ' isDisabled' : '';

    return (
      <div className={'FormField FormField--color ' + className}>
        {label !== false &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field" ref="field">
          <Dropdown className="Dropdown--field" ref="dropdown"
            label={this.renderFieldValue()}
            align={align} disabled={disabled}
          >
            {this.renderDropdownContent()}
          </Dropdown>
        </div>
      </div>
    );
  }
}

FormFieldColor.defaultProps = {
  className: '',
  value: '',
  label: false,
  disabled: false,

  defaultValue: 'rgba(0,0,0,1)',
  debounce: 200,
  opacity: false,
  align: 'left',

  onChange() {},
};

export { FormFieldColor };
