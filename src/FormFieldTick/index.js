import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _pick from 'lodash/pick';

import { withDebounce, withValidation } from '../HOC';
import Icon from '../Icon';

const INPUT_PROPS = ['name', 'disabled', 'tabIndex', 'type'];

/**
 * @class FormFieldTick
 * @augments {Component<{
      [x:string]: any
      checked?: boolean
      className?: string
      disabled?: boolean
      error?: any
      id?: string
      label?
      name?: string
      readOnly?: boolean
      style?: any
      type?: 'radio' | 'checkbox'
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
    }, any>}
 */
class FormFieldTick extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    type: PropTypes.oneOf(['radio', 'checkbox']),
    value: PropTypes.any,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    checked: false,
    className: '',
    type: 'radio',
    onBlur() {},
    onChange() {},
    onFocus() {},
  };

  state = {
    focused: false,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = props.value;
    this.setState({
      id:
        props.id ||
        'ff-tick-' + props.name + '-' + String(val).replace(/[^\w]/g, ''),
      checked: props.checked,
    });
  };

  handleChange = (ev) => {
    let { type, disabled, readOnly } = this.props;
    let checked =
      type !== 'radio' || !this.state.checked ? !this.state.checked : true;
    if (disabled || readOnly) {
      return;
    }
    this.setState({ checked });
    this.props.onChange(checked);
  };

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
    this.setState({ focused: false });
    this.props.onBlur(ev);
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
      error,
    } = this.props;
    let { id, checked } = this.state;
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
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(
  withValidation(FormFieldTick, {
    valueProp: 'checked',
    immediate: true,
  }),
  { valueProp: 'checked' }
);
export { FormFieldTick };
