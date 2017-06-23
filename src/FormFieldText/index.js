import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = [
  'name', 'disabled', 'placeholder', 'type', 'pattern', 'tabIndex',
  'autoComplete', 'autoCapitalize', 'autoCorrect', 'autoFocus', 'spellCheck',
];

class FormFieldText extends Component {

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
      id: props.id || props.name && 'ff-text-' + props.name,
      ...(props.touched ? { touched: true } : {}),
    }), () => {
      if (this.state.touched) {
        this.validate();
      }
    });
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
    if (updateState && error !== this.state.error) {
      this.setState({ error });
    }
    return { error };
  }

  render () {
    let { className, style, label, disabled, size } = this.props;
    let { id, val, error, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--text ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control"
            style={{ width: `calc(${size}ch + 2em)` }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={(ev) => this.handleChange(ev)}
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

FormFieldText.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,
  touched: PropTypes.bool,

  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldText.defaultProps = {
  className: '',
  value: '',

  size: 100,
  type: 'text',

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldText;
