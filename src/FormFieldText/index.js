import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

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
      debounce?: number
      disabled?: boolean
      iconLeft?
      iconRight?
      id?: string
      label?
      name?: string
      readOnly?: boolean
      size?: string | number
      style?: Object
      touched?: boolean
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
    }, any>}
 */
class FormFieldText extends Component {
  static propTypes = {
    className: PropTypes.string,
    debounce: PropTypes.number,
    disabled: PropTypes.bool,
    iconLeft: PropTypes.node,
    iconRight: PropTypes.node,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    touched: PropTypes.bool,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validation: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    size: 100,
    type: 'text',
    value: '',
    onBlur() {},
    onChange() {},
    onFocus() {},
    validation() {},
  };

  state = {
    error: null,
    focused: false,
    touched: false,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = props => {
    let val = props.value;
    this.setState(
      ({ touched }) => ({
        val,
        id: props.id || (props.name && 'ff-text-' + props.name),
        ...(props.touched ? { touched: true } : {}),
      }),
      () => {
        if (this.state.touched) {
          this.validate();
        }
      }
    );
  };

  handleChange = ev => {
    let { error, focused } = this.state;
    let val = ev.target.value;

    this.setState({
      val,
      ...(error && focused ? this.validate(val, false) : {}),
    });
    this.triggerOnChange(val);
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
    } = this.props;
    let { id, val, error, focused } = this.state;
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
            onChange={ev => this.handleChange(ev)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {iconLeft && <div className="FormField-iconLeft">{iconLeft}</div>}
          {iconRight && <div className="FormField-iconRight">{iconRight}</div>}
          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldText;
