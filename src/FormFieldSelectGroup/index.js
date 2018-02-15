import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _pick from 'lodash/pick';

import { withDebounce, withValidation } from '../HOC';
import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';

/**
 * @class FormFieldSelectGroup
 * @augments {Component<{
      align?: 'left' | 'right'
      className?: string
      disabled?: boolean
      error?: any
      hidePlaceholder?: boolean
      id?: string
      inline?: 'tabbed' | boolean
      label?
      multiple?: boolean
      name?: string
      options: Array<{ label, value }>
      optionsPerRow?: number
      placeholder?: string
      readOnly?: boolean,
      style?: any
      value?
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      valueRenderer?: Function
    }, any>}
 */
class FormFieldSelectGroup extends Component {
  static propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.any,
    hidePlaceholder: PropTypes.bool,
    id: PropTypes.string,
    inline: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    label: PropTypes.node,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    optionsPerRow: PropTypes.number,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    value: PropTypes.any,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    valueRenderer: PropTypes.func,
  };

  static defaultProps = {
    align: 'left',
    className: '',
    optionsPerRow: 1,
    placeholder: '— Select —',
    value: '',
    onBlur() {},
    onChange() {},
    onFocus() {},
    valueRenderer: (op) =>
      Array.isArray(op) ? op.map((o) => o.label).join(', ') : op.label,
  };

  state = {
    focused: false,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = this.normalizeValue(props.value);
    let opts = [
      ...(props.hidePlaceholder
        ? []
        : [{ label: props.placeholder, value: '' }]),
      ...props.options,
    ];
    this.setState({
      val,
      opts,
    });
  };

  normalizeValue = (value) => {
    if (!Array.isArray(value)) {
      value = typeof value !== 'undefined' ? [value] : [];
    }
    return value;
  };

  returnValue = (val) => {
    return this.props.multiple ? val : val[0];
  };

  findOptions = (val) => {
    let options = this.state.opts.filter((o) => val.indexOf(o.value) !== -1);
    return options.length ? options : null;
  };

  handleChange = (value) => {
    let { multiple } = this.props;
    let { val } = this.state;

    if (multiple) {
      let idx = val.indexOf(value);
      val = [
        ...(idx === -1 ? [value] : val.slice(0, idx)),
        ...val.slice(idx + 1),
      ];
    } else {
      val = [value];
    }

    this.setState({ val });

    if (this.dropdownEl) {
      this.dropdownEl.handleClose();
    }
    this.props.onChange(this.returnValue(val));
  };

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
    this.setState({ focused: false });
    this.props.onBlur(ev);
  };

  renderSelectGroup = (checkedOpts) => {
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
                checked={checkedOpts.indexOf(opt) !== -1}
                value={opt.value}
                {..._pick(
                  this.props,
                  'name',
                  'disabled',
                  'tabIndex',
                  'readOnly'
                )}
                onChange={() => this.handleChange(opt.value)}
                onFocus={(ev) => inline && this.handleFocus(ev)}
                onBlur={(ev) => inline && this.handleBlur(ev)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  render() {
    let {
      className,
      style,
      label,
      disabled,
      readOnly,
      valueRenderer,
      placeholder,
      align,
      multiple,
      error,
    } = this.props;
    let { val, focused } = this.state;
    let checkedOpts = this.findOptions(val) || [
      { label: placeholder, value: val },
    ];

    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div
        className={'FormField FormField--selectGroup ' + className}
        style={style}
        data-inline={String(this.props.inline)}
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
              ref={(c) => (this.dropdownEl = c)}
              label={valueRenderer(multiple ? checkedOpts : checkedOpts[0])}
              align={align}
              disabled={disabled || readOnly}
              onOpen={this.handleFocus}
              onClose={this.handleBlur}
            >
              {this.renderSelectGroup(checkedOpts)}
            </Dropdown>
          )}
          {error && <div className="FormField-error">{error}</div>}
        </div>
      </div>
    );
  }
}

export default withDebounce(
  withValidation(FormFieldSelectGroup, { immediate: true })
);
export { FormFieldSelectGroup };
