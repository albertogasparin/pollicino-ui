import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import ColorPicker from 'react-simple-colorpicker';

import Dropdown from '../Dropdown';

class FormFieldColor extends Component {

  constructor (props) {
    super(props);
    this.state = {
      focused: false,
      touched: false,
      ...this.mapPropsToState(props),
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.mapPropsToState(nextProps));
  }

  mapPropsToState = (props) => {
    return {
      val: props.value || props.defaultValue,
    };
  }

  handleChange = (color) => {
    this.setState({ val: color });
    this.triggerOnChange(color);
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    let { val } = this.state;
    this.setState({ focused: false, touched: true });
    this.triggerOnChange(val);
    this.props.onBlur(ev);
  }

  triggerOnChange = _debounce((...args) => {
    this.props.onChange(...args); // call the fresh prop
  }, this.props.debounce)

  renderFieldValue = () => {
    return (
      <span className="FormField-swatch"
        style={{ backgroundColor: this.state.val }}
      />
    );
  }

  renderDropdownContent = () => {
    return (
      <ColorPicker
        color={this.state.val}
        onChange={this.handleChange}
        opacitySlider={this.props.opacity}
      />
    );
  }

  render () {
    let { className, style, label, disabled, align, tabIndex } = this.props;
    className += disabled ? ' isDisabled' : '';

    return (
      <div className={'FormField FormField--color ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field">
          <Dropdown className="Dropdown--field"
            label={this.renderFieldValue()}
            align={align} disabled={disabled} tabIndex={tabIndex}
            onOpen={this.handleFocus}
            onClose={this.handleBlur}
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
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

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

  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldColor;
