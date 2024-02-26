import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorPicker from 'react-simple-colorpicker';

import { withDebounce, withValidation } from '../HOC';
import Dropdown from '../Dropdown';

/**
 * @class FormFieldColor
 * @augments {Component<{
      align?: 'left' | 'right'
      className?: string
      defaultValue?: string
      disabled?: boolean
      error?: any
      label?: any
      opacity?: boolean
      readOnly?: boolean
      style?: Object
      tabIndex?: number
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
    }, any>}
 */
class FormFieldColor extends Component {
  static propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    label: PropTypes.node,
    opacity: PropTypes.bool,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    align: 'left',
    className: '',
    defaultValue: 'rgba(0,0,0,1)',
    value: '',
    onBlur() {},
    onChange() {},
    onFocus() {},
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
    let val = props.value || props.defaultValue;
    this.setState({ val });
  };

  handleChange = (color) => {
    this.setState({ val: color });
    this.props.onChange(color);
  };

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
    this.setState({ focused: false });
    this.props.onBlur(ev);
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
    let {
      className,
      style,
      label,
      disabled,
      error,
      readOnly,
      align,
      tabIndex,
    } = this.props;

    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';

    return (
      <div className={'FormField FormField--color ' + className} style={style}>
        {typeof label !== 'undefined' && (
          <label className="FormField-label">{label}</label>
        )}
        <div className="FormField-field">
          <Dropdown
            className="Dropdown--field"
            label={this.renderFieldValue()}
            align={align}
            disabled={disabled || readOnly}
            tabIndex={tabIndex}
            onOpen={this.handleFocus}
            onClose={this.handleBlur}
          >
            {this.renderDropdownContent()}
          </Dropdown>
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(withValidation(FormFieldColor));
export { FormFieldColor };
