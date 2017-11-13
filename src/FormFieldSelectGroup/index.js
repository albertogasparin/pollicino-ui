import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';

/**
 * @class FormFieldSelectGroup
 * @augments {Component<{
      align?: 'left' | 'right'
      className?: string
      debounce?: number
      disabled?: boolean
      hidePlaceholder?: boolean
      id?: string
      inline?: 'tabbed' | boolean
      label?
      multiple?: boolean
      name?: string
      options: Array<{ label, value }>
      optionsPerRow?: number
      placeholder?: string
      style?: any
      touched?: boolean
      value?
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
      valueRenderer?: Function
    }, any>}
 */
class FormFieldSelectGroup extends Component {
  static propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    debounce: PropTypes.number,
    disabled: PropTypes.bool,
    hidePlaceholder: PropTypes.bool,
    id: PropTypes.string,
    inline: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    label: PropTypes.node,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    optionsPerRow: PropTypes.number,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    touched: PropTypes.bool,
    value: PropTypes.any,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validation: PropTypes.func,
    valueRenderer: PropTypes.func,
  };

  static defaultProps = {
    align: 'left',
    className: '',
    debounce: 200,
    optionsPerRow: 1,
    placeholder: '— Select —',
    value: '',
    onBlur() {},
    onChange() {},
    onFocus() {},
    validation() {},
    valueRenderer: op =>
      Array.isArray(op) ? op.map(o => o.label).join(', ') : op.label,
  };

  state = {
    error: null,
    focused: false,
    touched: false,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = props => {
    let val = this.normalizeValue(props.value);
    let opts = [
      ...(props.hidePlaceholder
        ? []
        : [{ label: props.placeholder, value: '' }]),
      ...props.options,
    ];
    this.setState(
      ({ touched }) => ({
        val,
        opts,
        ...(props.touched ? { touched: true } : {}),
      }),
      () => {
        if (this.state.touched) {
          this.validate();
        }
      }
    );
  };

  normalizeValue = value => {
    if (!Array.isArray(value)) {
      value = typeof value !== 'undefined' ? [value] : [];
    }
    return value;
  };

  returnValue = val => {
    return this.props.multiple ? val : val[0];
  };

  findOptions = val => {
    let options = this.state.opts.filter(o => val.indexOf(o.value) !== -1);
    return options.length ? options : null;
  };

  handleChange = (value, checked) => {
    let { multiple } = this.props;
    let { val, error } = this.state;

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
      ...(error ? this.validate(val, false) : {}),
    });

    if (this.dropdownEl) {
      this.dropdownEl.handleClose();
    }
    this.triggerOnChange(this.returnValue(val));
  };

  handleFocus = ev => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = ev => {
    this.setState(({ val }) => ({
      focused: false,
      touched: true,
      ...this.validate(val, false),
    }));
    this.props.onBlur(ev);
  };

  triggerOnChange = _debounce((...args) => {
    this.props.onChange(...args); // call the fresh prop
  }, this.props.debounce);

  /*
   * @public
   */
  validate = (val = this.state.val, updateState = true) => {
    let error = this.props.validation(this.returnValue(val)) || null;
    if (updateState && error !== this.state.error) {
      this.setState({ error });
    }
    return { error };
  };

  renderSelectGroup = checkedOpts => {
    let { opts } = this.state;
    let { inline, multiple, optionsPerRow } = this.props;

    return (
      <div className="FormField-group">
        <ul
          className={
            'FormField-groupList FormField-groupList--' + (inline || 'overflow')
          }
        >
          {opts.map((opt, i) => (
            <li
              key={opt.value}
              className="FormField-groupItem"
              style={{ width: 100 / optionsPerRow + '%' }}
            >
              <FormFieldTick
                type={multiple ? 'checkbox' : 'radio'}
                label={opt.label}
                debounce={0}
                checked={checkedOpts.indexOf(opt) !== -1}
                value={opt.value}
                {..._pick(this.props, 'name', 'disabled', 'tabIndex')}
                onChange={this.handleChange}
                onFocus={ev => inline && this.handleFocus(ev)}
                onBlur={ev => inline && this.handleBlur(ev)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // eslint-disable-next-line complexity
  render() {
    let {
      className,
      style,
      label,
      disabled,
      valueRenderer,
      placeholder,
      multiple,
    } = this.props;
    let { val, error, focused } = this.state;
    let checkedOpts = this.findOptions(val) || [
      { label: placeholder, value: val },
    ];

    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div
        className={'FormField FormField--selectGroup ' + className}
        style={style}
      >
        {typeof label !== 'undefined' && (
          <label className="FormField-label">{label}</label>
        )}
        <div className="FormField-field">
          {this.props.inline ? (
            this.renderSelectGroup(checkedOpts)
          ) : (
            <Dropdown
              className="Dropdown--field"
              ref={c => (this.dropdownEl = c)}
              label={valueRenderer(multiple ? checkedOpts : checkedOpts[0])}
              {..._pick(this.props, 'align', 'disabled')}
              onOpen={this.handleFocus}
              onClose={this.handleBlur}
            >
              {this.renderSelectGroup(checkedOpts)}
            </Dropdown>
          )}
          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldSelectGroup;
