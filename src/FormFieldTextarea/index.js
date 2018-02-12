import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _pick from 'lodash/pick';

import { withDebounce, withValidation } from '../HOC';

// prettier-ignore
const INPUT_PROPS = [
  'name', 'disabled', 'placeholder', 'tabIndex', 'readOnly',
  'autoCorrect', 'autoFocus', 'spellCheck',
];

/**
 * @class FormFieldTextarea
 * @augments {Component<{
      [x:string]: any
      className?: string
      cols?: string | number
      disabled?: boolean
      error?: any
      id?: string
      label?
      name?: string
      readOnly?: boolean
      rows?: string | number
      style?: Object
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
    }, any>}
 */
class FormFieldTextarea extends Component {
  static propTypes = {
    className: PropTypes.string,
    cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    error: PropTypes.any,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    cols: 100,
    value: '',
    rows: 3,
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
      id: props.id || (props.name && 'ff-textarea-' + props.name),
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

  render() {
    let {
      className,
      style,
      label,
      disabled,
      readOnly,
      cols,
      rows,
      error,
    } = this.props;
    let { id, val, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div
        className={'FormField FormField--textarea ' + className}
        style={style}
      >
        {typeof label !== 'undefined' && (
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="FormField-field">
          <textarea
            id={id}
            className="FormField-control"
            style={{
              width: `calc(${cols}ch + 2em)`,
              height: Number(rows) * 1.6 + 'em',
            }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(withValidation(FormFieldTextarea));
export { FormFieldTextarea };
