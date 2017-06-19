import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Icon from '../Icon';

const INPUT_PROPS = ['name', 'disabled', 'type'];

class FormFieldTick extends Component {

  constructor (props) {
    super(props);
    this.state = {
      touched: false,
      focused: false,
      ...this.mapPropsToState(props),
    };
  }

  componentWillReceiveProps (nextProps) {
    let newState = this.mapPropsToState(nextProps);
    this.setState(newState);
  }

  mapPropsToState = (props) => {
    return {
      id: props.id || 'ff-tick-' + props.name + '-' + String(props.value).replace(/[^\w]/g,''),
      checked: props.checked,
    };
  }

  handleChange = (ev) => {
    let { type, value } = this.props;
    let checked = (type !== 'radio' || !this.state.checked) ? !this.state.checked : true;
    this.setState({ checked });
    this.triggerOnChange(value, checked);
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    this.setState({ focused: false, touched: true });
    this.props.onBlur(ev);
  }

  triggerOnChange = _debounce(this.props.onChange, this.props.debounce)

  render () { // eslint-disable-line complexity
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
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
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
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  type: PropTypes.oneOf(['radio', 'checkbox']),
  checked: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldTick.defaultProps = {
  className: '',

  debounce: 50,
  checked: false,
  type: 'radio',

  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldTick;
