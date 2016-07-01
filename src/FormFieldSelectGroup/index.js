import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import { Dropdown } from '../Dropdown';
import { FormFieldTick } from '../FormFieldTick';
import { FormFieldSearch } from '../FormFieldSearch';

import './style.scss';

class FormFieldSelectGroup extends Component {
  constructor(props) {
    super(props);
    this.assignPropsToState(props);
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    this.assignPropsToState(nextProps);
    if (!this.state.focused) { // validation: punish late
      this.validate();
    }
  }

  assignPropsToState(props) {
    let opts = [
      ...(props.hidePlaceholder ? [] : [{ label: props.placeholder, value: '' }]),
      ...props.options,
    ];

    this.state = {
      searchValue: '',
      focused: false,
      errors: null,
      opts,
      ...this.state,
      val: this.normalizeValue(props.value),
    };
  }

  normalizeValue(value) {
    if (!Array.isArray(value)) {
      value = typeof value !== 'undefined' ? [value] : [];
    }
    return value;
  }

  returnValue(val) {
    if (this.props.multiple) {
      return val;
    }
    return val[0];
  }

  findOptions(val) {
    let options = this.state.opts.filter((o) => val.indexOf(o.value) !== -1);
    return options.length ? options : null;
  }

  isOptionVisible(o) {
    let { searchValue } = this.state;
    let str = (o.label + '|' + o.value).toLowerCase();
    return !searchValue || str.indexOf(searchValue.toLowerCase()) !== -1;
  }

  handleChange(value, ev) {
    let { multiple } = this.props;
    let { val, errors, focused } = this.state;

    if (multiple) {
      let idx = val.indexOf(value);
      val = [
        ...val.slice(0, idx),
        ...(idx === -1 ? [value] : []),
        ...val.slice(idx + 1),
      ];
    } else {
      val = [value];
    }

    if (errors && focused) { // validation: reward early
      this.validate(val);
    }

    this.setState({ val });
    if (this.refs.dropdown) {
      this.refs.dropdown.handleClose();
    }
    this.triggerOnChange(this.returnValue(val));
  }

  handleSearch(value) {
    this.setState({ searchValue: value });
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

  /**
   * @public
   */
  validate(val = this.state.val) {
    let errors = this.props.validation(this.returnValue(val));
    this.setState({ errors });
    return errors;
  }

  renderSelectGroup(checkedOpts) {
    let { opts, searchValue } = this.state;
    let { withSearch, inline, multiple, optionsPerRow } = this.props;

    return (
      <div className="FormField-group">
        {withSearch && !inline &&
          <div className="FormField-groupSearch">
            <FormFieldSearch className="FormField--block"
              placeholder="Search..." debounce={200}
              value={searchValue}
              onChange={this.handleSearch.bind(this)}
            />
          </div>
        }
        <ul className={'FormField-groupList ' + (inline ? '' : 'FormField-groupList--overflow')}>
          {opts.filter((o) => this.isOptionVisible(o)).map((o, i) => (
            <li key={i} className="FormField-groupItem"
              style={{ width: 100 / optionsPerRow + '%' }}
            >
              <FormFieldTick type={multiple ? 'checkbox' : 'radio'}
                label={o.label} debounce={50}
                checked={checkedOpts.indexOf(o) !== -1}
                value={o.value}
                {..._pick(this.props, 'name', 'disabled')}
                onChange={this.handleChange.bind(this)}
                onFocus={(ev) => inline && this.handleFocus(ev)}
                onBlur={(ev) => inline && this.handleBlur(ev)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  render() { // eslint-disable-line complexity
    let { className, label, disabled, valueRenderer, placeholder, multiple } = this.props;
    let { val, errors, focused } = this.state;
    let checkedOpts = this.findOptions(val) || [{ label: placeholder, value: val }];

    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--selectGroup ' + className}>
        {label !== false &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field">
          {this.props.inline
            ? this.renderSelectGroup(checkedOpts)
            : <Dropdown className="Dropdown--field" ref="dropdown"
                label={valueRenderer(multiple ? checkedOpts : checkedOpts[0])}
                {..._pick(this.props, 'align', 'disabled')}
                onOpen={(ev) => this.handleFocus(ev)}
                onClose={(ev) => this.handleBlur(ev)}
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

FormFieldSelectGroup.defaultProps = {
  className: '',
  label: false,
  value: '',
  name: '',
  placeholder: '— Select —',
  disabled: false,

  hidePlaceholder: false,
  options: [],
  valueRenderer: (op) => Array.isArray(op) ? op.map((o) => o.label).join(', ') : op.label,
  align: 'left',
  inline: false,
  withSearch: false,
  debounce: 200,
  optionsPerRow: 1,
  multiple: false,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export { FormFieldSelectGroup };
