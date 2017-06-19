import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

const INPUT_PROPS = [
  'name', 'disabled', 'placeholder', 'type', 'pattern',
  'autoComplete', 'autoCapitalize', 'autoCorrect', 'autoFocus', 'spellCheck',
];

class FormFieldText extends Component {

  constructor (props) {
    super(props);
    this.state = {
      touched: false,
      focused: false,
      errors: null,
      ...this.mapPropsToState(props),
    };
  }

  componentWillReceiveProps (nextProps) {
    let newState = this.mapPropsToState(nextProps);
    this.setState(newState);
    if (this.state.touched) { // validation: punish late
      this.validate(newState.val);
    }
  }

  mapPropsToState = (props) => {
    return {
      id: props.id || props.name && 'ff-text-' + props.name,
      val: props.value,
    };
  }

  handleChange = (ev) => {
    let { errors, focused } = this.state;
    let val = ev.target.value;

    if (errors && focused) { // validation: reward early
      this.validate(val);
    }
    this.setState({ val });
    this.triggerOnChange(val);
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    this.setState({ focused: false, touched: true }, this.validate);
    this.props.onBlur(ev);
  }

  triggerOnChange = _debounce((...args) => {
    this.props.onChange(...args); // call the fresh prop
  }, this.props.debounce)

  /**
   * @public
   */
  validate = (val = this.state.val) => {
    let errors = this.props.validation(val) || null;
    this.setState({ errors });
    return errors;
  }

  render () {
    let { className, style, label, disabled, size } = this.props;
    let { id, val, errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--text ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className="FormField-control"
            style={{ width: size + 'em' }}
            value={val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={(ev) => this.handleChange(ev)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {errors &&
            <p className="FormField-error">{errors}</p>
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
  value: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  placeholder: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

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
