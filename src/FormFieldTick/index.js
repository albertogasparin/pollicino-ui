import React, { Component, PropTypes } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Icon from '../Icon';

const INPUT_PROPS = ['name', 'disabled', 'type'];

class FormFieldTick extends Component {

  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      focused: false,
      ...this.getPropsToState(props),
    };
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.getPropsToState(nextProps);
    this.setState(newState);
  }

  getPropsToState(props) {
    let newState = {
      id: props.id || 'ff-tick-' + props.name + '-' + String(props.value).replace(/[^\w]/g,''),
      checked: props.checked,
    };
    return newState;
  }

  handleChange(ev) {
    let { type, value } = this.props;
    this.setState({
      checked: (type !== 'radio' || !this.state.checked) ? !this.state.checked : true,
    });
    this.triggerOnChange(value);
  }

  handleFocus(ev) {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur(ev) {
    this.setState({ focused: false, touched: true });
    this.props.onBlur(ev);
  }

  triggerOnChange(...args) {
    this.props.onChange(...args);
  }

  render() { // eslint-disable-line complexity
    let { className, style, label, value, type, disabled } = this.props;
    let { id, checked } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += checked ? ' isChecked' : '';
    let boxtype = type === 'radio' ? 'radiobox' : type;
    return (
      <div className={'FormField FormField--' + boxtype + ' ' + className} style={style}>
        <input id={id} className="FormField-control"
          checked={checked}
          {..._pick(this.props, INPUT_PROPS)}
          onChange={this.handleChange.bind(this)}
          onFocus={(ev) => this.handleFocus(ev)}
          onBlur={(ev) => this.handleBlur(ev)}
        />
        <label className="FormField-field" htmlFor={id}>
          <i className="FormField-tick">
            <Icon glyph={`${boxtype}-${checked ? 'marked' : 'blank'}`} />
          </i>
          <span className="FormField-value">
            {label || value}
          </span>
        </label>

      </div>
    );
  }
}

FormFieldTick.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.any.isRequired,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  type: PropTypes.oneOf(['radio', 'checkbox']),
  checked: PropTypes.bool,

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldTick.defaultProps = {
  className: '',

  debounce: 50,
  checked: false,
  type: 'radio',

  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldTick;
