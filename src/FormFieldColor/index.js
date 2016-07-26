import React, { Component, PropTypes } from 'react';
import _debounce from 'lodash/debounce';
import ColorPicker from 'react-simple-colorpicker';

import Dropdown from '../Dropdown';

class FormFieldColor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getPropsToState(props),
    };
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getPropsToState(nextProps));
  }

  getPropsToState(props) {
    let newState = {
      col: props.value || props.defaultValue,
    };
    return newState;
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
        {typeof label !== 'undefined' &&
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
