import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import { Icon } from '../Icon';

import './style.scss';

class FormFieldTick extends Component {

  constructor(props) {
    super(props);
    this.assignPropsToState(props);
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    this.assignPropsToState(nextProps);
  }

  assignPropsToState(props) {
    this.state = {
      id: props.id || 'input-' + Math.random().toString(16).substr(8),
      focused: false,
      errors: null,
      ...this.state,
      checked: props.checked,
    };
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
    this.setState({ focused: false });
    this.props.onBlur(ev);
  }

  triggerOnChange(...args) {
    this.props.onChange(...args);
  }

  render() { // eslint-disable-line complexity
    let { className, label, type, disabled } = this.props;
    let { id, checked } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += checked ? ' isChecked' : '';
    let boxtype = type === 'radio' ? 'radiobox' : type;
    return (
      <div className={'FormField FormField--' + boxtype + ' ' + className}>
        <input id={id} className="FormField-control"
          checked={checked}
          {..._pick(this.props, 'name', 'type', 'disabled')}
          onChange={this.handleChange.bind(this)}
          onFocus={(ev) => this.handleFocus(ev)}
          onBlur={(ev) => this.handleBlur(ev)}
        />
        <label className="FormField-field" htmlFor={id}>
          <i className="FormField-tick">
            <Icon glyph={`${boxtype}-${checked ? 'marked' : 'blank'}`} />
          </i>
          <span className="FormField-value">
            {label}
          </span>
        </label>

      </div>
    );
  }
}

FormFieldTick.defaultProps = {
  className: '',
  label: '',
  value: '',
  name: '',
  disabled: false,

  debounce: 50,
  type: 'radio', // or 'checkbox'
  checked: false,

  onChange() {},
  onFocus() {},
  onBlur() {},
};

export { FormFieldTick };
