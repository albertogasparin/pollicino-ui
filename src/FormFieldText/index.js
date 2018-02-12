import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _pick from 'lodash/pick';

import { withDebounce, withValidation } from '../HOC';

// prettier-ignore
const INPUT_PROPS = [
  'name', 'disabled', 'placeholder', 'type', 'pattern', 'tabIndex', 'readOnly',
  'autoComplete', 'autoCapitalize', 'autoCorrect', 'autoFocus', 'spellCheck',
];

/**
 * @class FormFieldText
 * @augments {Component<{
      [x:string]: any
      className?: string
      disabled?: boolean
      error?: any
      iconLeft?
      iconRight?
      id?: string
      label?
      name?: string
      readOnly?: boolean
      size?: string | number
      style?: Object
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
    }, any>}
 */
class FormFieldText extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    iconLeft: PropTypes.node,
    iconRight: PropTypes.node,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    size: 100,
    type: 'text',
    value: '',
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
      val,
      id: props.id || (props.name && 'ff-text-' + props.name),
    });
  };

  handleChange = (ev) => {
    let val = ev.target.value;
    this.setState({ val });
    this.props.onChange(val);
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
      disabled,
      readOnly,
      size,
      iconLeft,
      iconRight,
      error,
    } = this.props;
    let { id, val, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    let controlCN =
      (iconLeft ? 'FormField-control--iconLeft ' : '') +
      (iconRight ? 'FormField-control--iconRight ' : '');
    return (
      <div className={'FormField FormField--text ' + className} style={style}>
        {typeof label !== 'undefined' && (
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="FormField-field">
          <input
            id={id}
            className={'FormField-control ' + controlCN}
            style={{ width: `calc(${size}ch + 2em)` }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={(ev) => this.handleChange(ev)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {iconLeft && <div className="FormField-iconLeft">{iconLeft}</div>}
          {iconRight && <div className="FormField-iconRight">{iconRight}</div>}
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(withValidation(FormFieldText));
export { FormFieldText };
