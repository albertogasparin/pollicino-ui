import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Icon from '../Icon';

class FormFieldSearch extends Component {
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
      id: props.id || props.name && 'ff-search-' + props.name,
      focused: false,
      touched: false,
      ...this.state,
      val: props.value,
    };
  }

  handleChange(ev) {
    let val = ev.target.value;
    this.setState({ val });
    this.triggerOnChange(val);
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

  render() {
    let { className, disabled, size } = this.props;
    let { id, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--search ' + className}>
        <div className="FormField-field">
          <Icon className="FormField-icon" glyph="magnify" />
          <input id={id} className="FormField-control" type="text"
            style={{ width: size + 'em' }}
            value={this.state.val}
            {..._pick(this.props, 'id', 'name', 'disabled', 'placeholder')}
            onChange={this.handleChange.bind(this)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          />
        </div>
      </div>
    );
  }
}

FormFieldSearch.defaultProps = {
  className: '',
  value: '',
  placeholder: 'Search',
  disabled: false,

  debounce: 200,
  size: 100,

  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldSearch;
