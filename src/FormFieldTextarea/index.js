import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

// prettier-ignore
const INPUT_PROPS = [
  'name', 'disabled', 'placeholder', 'tabIndex',
  'autoCorrect', 'autoFocus', 'spellCheck',
];

/**
 * @class FormFieldTextarea
 * @augments {Component<{
      [x:string]: any
      className?: string
      cols?: string | number
      debounce?: number
      disabled?: boolean
      id?: string
      label?
      name?: string
      rows?: string | number
      style?: Object
      touched?: boolean
      value?: string
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
    }, any>}
 */
class FormFieldTextarea extends Component {
  static propTypes = {
    className: PropTypes.string,
    cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    debounce: PropTypes.number,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    name: PropTypes.string,
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    cols: 100,
    debounce: 200,
    value: '',
    rows: 3,
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
        id: props.id || (props.name && 'ff-textarea-' + props.name),
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

  render() {
    let { className, style, label, disabled, cols, rows } = this.props;
    let { id, val, error, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
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
          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldTextarea;
