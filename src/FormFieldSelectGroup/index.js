import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';

class FormFieldSelectGroup extends Component {

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
    let opts = [
      ...(props.hidePlaceholder ? [] : [{ label: props.placeholder, value: '' }]),
      ...props.options,
    ];

    return {
      opts,
      val: this.normalizeValue(props.value),
    };
  }

  normalizeValue = (value) => {
    if (!Array.isArray(value)) {
      value = typeof value !== 'undefined' ? [value] : [];
    }
    return value;
  }

  returnValue = (val) => {
    if (this.props.multiple) {
      return val;
    }
    return val[0];
  }

  findOptions = (val) => {
    let options = this.state.opts.filter((o) => val.indexOf(o.value) !== -1);
    return options.length ? options : null;
  }

  handleChange = (value, checked) => {
    let { multiple } = this.props;
    let { val, errors, focused } = this.state;

    if (multiple) {
      let idx = val.indexOf(value);
      val = [
        ...(idx === -1 ? [value] : val.slice(0, idx)),
        ...val.slice(idx + 1),
      ];
    } else {
      val = [value];
    }

    if (errors && focused) { // validation: reward early
      this.validate(val);
    }

    this.setState({ val });
    if (this.dropdownEl) {
      this.dropdownEl.handleClose();
    }
    this.triggerOnChange(this.returnValue(val));
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
    let errors = this.props.validation(this.returnValue(val)) || null;
    this.setState({ errors });
    return errors;
  }

  renderSelectGroup = (checkedOpts) => {
    let { opts } = this.state;
    let { inline, multiple, optionsPerRow } = this.props;

    return (
      <div className="FormField-group">
        <ul className={'FormField-groupList FormField-groupList--' + (inline || 'overflow')}>
          {opts.map((o, i) => (
            <li key={o.value} className="FormField-groupItem"
              style={{ width: 100 / optionsPerRow + '%' }}
            >
              <FormFieldTick type={multiple ? 'checkbox' : 'radio'}
                label={o.label} debounce={0}
                checked={checkedOpts.indexOf(o) !== -1}
                value={o.value}
                {..._pick(this.props, 'name', 'disabled')}
                onChange={this.handleChange}
                onFocus={(ev) => inline && this.handleFocus(ev)}
                onBlur={(ev) => inline && this.handleBlur(ev)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render () { // eslint-disable-line complexity
    let { className, style, label, disabled, valueRenderer, placeholder, multiple } = this.props;
    let { val, errors, focused } = this.state;
    let checkedOpts = this.findOptions(val) || [{ label: placeholder, value: val }];

    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--selectGroup ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field">
          {this.props.inline
            ? this.renderSelectGroup(checkedOpts)
            : <Dropdown className="Dropdown--field"
                ref={c => this.dropdownEl = c}
                label={valueRenderer(multiple ? checkedOpts : checkedOpts[0])}
                {..._pick(this.props, 'align', 'disabled')}
                onOpen={this.handleFocus}
                onClose={this.handleBlur}
              >
                {this.renderSelectGroup(checkedOpts)}
              </Dropdown>
          }
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldSelectGroup.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.any, // eslint-disable-line react/no-unused-prop-types
  placeholder: PropTypes.string,
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  options: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line react/no-unused-prop-types
  valueRenderer: PropTypes.func,
  hidePlaceholder: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  align: PropTypes.oneOf(['left', 'right']), // eslint-disable-line react/no-unused-prop-types
  inline: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  optionsPerRow: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  multiple: PropTypes.bool,

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldSelectGroup.defaultProps = {
  className: '',
  value: '',
  placeholder: '— Select —',
  debounce: 200,

  options: [],
  valueRenderer: (op) => Array.isArray(op) ? op.map((o) => o.label).join(', ') : op.label,
  align: 'left',
  optionsPerRow: 1,

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldSelectGroup;
