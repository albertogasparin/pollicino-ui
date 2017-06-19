import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Icon from '../Icon';

const INPUT_PROPS = ['name', 'disabled', 'placeholder', 'autoComplete', 'autoFocus'];

class FormFieldSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      touched: false,
      ...this.getPropsToState(props),
    };
    this.getPropsToState(props);
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.getPropsToState(nextProps);
    this.setState(newState);
  }

  getPropsToState(props) {
    let newState = {
      id: props.id || props.name && 'ff-search-' + props.name,
      val: props.value,
    };
    return newState;
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
    let { className, style, disabled, size } = this.props;
    let { id, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--search ' + className} style={style}>
        <div className="FormField-field">
          <input id={id} className="FormField-control FormField-control--iconL" type="text"
            style={{ width: size + 'em' }}
            value={this.state.val}
            {..._pick(this.props, INPUT_PROPS)}
            onChange={this.handleChange.bind(this)}
            onFocus={(ev) => this.handleFocus(ev)}
            onBlur={(ev) => this.handleBlur(ev)}
          />
          <i className="FormField-icon"><Icon glyph="magnify" /></i>
        </div>
      </div>
    );
  }
}

FormFieldSearch.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  placeholder: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldSearch.defaultProps = {
  className: '',
  value: '',
  placeholder: 'Search',
  debounce: 200,

  size: 100,

  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldSearch;
