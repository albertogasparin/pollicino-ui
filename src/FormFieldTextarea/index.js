import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = [
  'name', 'disabled', 'placeholder',
  'autoCorrect', 'autoFocus', 'spellCheck',
];

class FormFieldTextarea extends Component {

  state = {
    touched: false,
    focused: false,
    error: null,
  }

  componentWillMount () {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = props.value;
    this.setState(({ touched }) => ({
      val,
      id: props.id || props.name && 'ff-textarea-' + props.name,
      ...(props.touched ? { touched: true } : {}),
      ...(touched || props.touched ? this.validate(val, false) : {}),
    }));
  }

  handleChange = (ev) => {
    let { error, focused } = this.state;
    let val = ev.target.value;

    this.setState({
      val,
      ...(error && focused ? this.validate(val, false) : {}),
    });
    this.triggerOnChange(val);
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    this.setState(({ val }) => ({
      focused: false, touched: true, ...this.validate(val, false),
    }));
    this.props.onBlur(ev);
  }

  triggerOnChange = _debounce((...args) => {
    this.props.onChange(...args); // call the fresh prop
  }, this.props.debounce)

  /*
   * @public
   */
  validate = (val = this.state.val, updateState = true) => {
    let error = this.props.validation(val) || null;
    if (updateState) {
      this.setState({ error });
    }
    return { error };
  }

  render () {
    let { className, style, label, disabled, cols, rows } = this.props;
    let { id, val, error, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--textarea ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <textarea id={id} className="FormField-control"
            style={{ width: cols + 'em', height: rows * 1.6 + 'em' }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {error &&
            <p className="FormField-error">{error}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldTextarea.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  placeholder: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  debounce: PropTypes.number,
  touched: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cols: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldTextarea.defaultProps = {
  className: '',
  value: '',
  debounce: 200,

  rows: 3,
  cols: 100,

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldTextarea;
