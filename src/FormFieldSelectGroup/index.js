import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';

class FormFieldSelectGroup extends Component {

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
    let val = this.normalizeValue(props.value);
    let opts = [
      ...(props.hidePlaceholder ? [] : [{ label: props.placeholder, value: '' }]),
      ...props.options,
    ];
    this.setState(({ touched }) => ({
      val,
      opts,
      ...(props.touched ? { touched: true } : {}),
      ...(touched || props.touched ? this.validate(val, false) : {}),
    }));
  }

  normalizeValue = (value) => {
    if (!Array.isArray(value)) {
      value = typeof value !== 'undefined' ? [value] : [];
    }
    return value;
  }

  returnValue = (val) => {
    return this.props.multiple ? val : val[0];
  }

  findOptions = (val) => {
    let options = this.state.opts.filter(o => val.indexOf(o.value) !== -1);
    return options.length ? options : null;
  }

  handleChange = (value, checked) => {
    let { multiple } = this.props;
    let { val, error, focused } = this.state;

    if (multiple) {
      let idx = val.indexOf(value);
      val = [
        ...(idx === -1 ? [value] : val.slice(0, idx)),
        ...val.slice(idx + 1),
      ];
    } else {
      val = [value];
    }

    this.setState({
      val,
      ...(error && focused ? this.validate(val, false) : {}),
    });

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
    let error = this.props.validation(this.returnValue(val)) || null;
    if (updateState) {
      this.setState({ error });
    }
    return { error };
  }

  renderSelectGroup = (checkedOpts) => {
    let { opts } = this.state;
    let { inline, multiple, optionsPerRow } = this.props;

    return (
      <div className="FormField-group">
        <ul className={'FormField-groupList FormField-groupList--' + (inline || 'overflow')}>
          {opts.map((opt, i) => (
            <li key={opt.value} className="FormField-groupItem"
              style={{ width: 100 / optionsPerRow + '%' }}
            >
              <FormFieldTick type={multiple ? 'checkbox' : 'radio'}
                label={opt.label} debounce={0}
                checked={checkedOpts.indexOf(opt) !== -1}
                value={opt.value}
                {..._pick(this.props, 'name', 'disabled', 'tabIndex')}
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
    let { val, error, focused } = this.state;
    let checkedOpts = this.findOptions(val) || [{ label: placeholder, value: val }];

    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
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
          {error &&
            <p className="FormField-error">{error}</p>
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
  value: PropTypes.any,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,
  touched: PropTypes.bool,

  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueRenderer: PropTypes.func,
  hidePlaceholder: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
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
  valueRenderer: (op) => Array.isArray(op) ? op.map(o => o.label).join(', ') : op.label,
  align: 'left',
  optionsPerRow: 1,

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldSelectGroup;
