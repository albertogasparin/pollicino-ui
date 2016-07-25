import React, { Component } from 'react';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Btn from '../Btn';
import Icon from '../Icon';
import Dropdown from '../Dropdown';

const INPUT_PROPS = ['name', 'disabled', 'placeholder', 'autoFocus'];

class FormFieldSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = this.getFieldState(props);
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
    this.getAsyncOptions = _debounce(this.getAsyncOptions, props.debounceLoad);
    this.optionsCache = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getFieldState(nextProps));
    if (this.state.touched) { // validation: punish late
      this.validate();
    }
  }

  getFieldState(props) {
    let input = (!this.state || this.state.val !== props.value) ? '' : this.state.input;
    let newState = {
      id: props.id || props.name && 'ff-text-' + props.name,
      focused: false,
      touched: false,
      errors: null,
      opts: [
        ...props.options,
      ],
      isLoading: false,
      ...this.state,
      val: props.value,
      input,
    };
    return newState;
  }

  getAsyncOptions(input) {
    return this.props.loadOptions(input)
      .then((options) => {
        this.optionsCache[input] = options;
        this.setState({ isLoading: false });
      })
      .catch(() => this.setState({ isLoading: false }));
  }

  handleInputChange(ev) {
    let input = ev.target.value;
    this.setState({ input });

    let isCached = typeof this.optionsCache[input] !== 'undefined';
    if (this.props.loadOptions && !isCached) {
      this.setState({ isLoading: true });
      this.getAsyncOptions(input);
    }
  }

  handleSelect(option) {
    let { errors, focused } = this.state;

    if (errors && focused) { // validation: reward early
      this.validate(option);
    }
    this.setState({ val: option });
    this.handleBlur();
    this.triggerOnChange(option);
  }

  handleFocus(ev) {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur(ev) {
    this.setState({ focused: false, touched: true, input: '' }, this.validate);
    this.props.onBlur(ev);
  }

  handleKeyDown(ev) { // eslint-disable-line complexity
    let { valueKey } = this.props;
    let { val } = this.state;

    if (!val) {
      return;
    }

    switch (ev.keyCode) {
      case 13: // enter
        // TODO
        break;
      case 8: // backspace
        if (!val.isNewOption) {
          this.setState({ val: null, input: '' });
        }
        break;
      default:
        if (val.isNewOption) {
          this.setState({ val: null, input: val[valueKey] });
        } else {
          ev.preventDefault();
        }
        this.triggerOnChange(null);
    }
  }

  triggerOnChange(...args) {
    this.props.onChange(...args);
  }

  /**
   * @public
   */
  validate(val = this.state.val) {
    let errors = this.props.validation(val) || null;
    this.setState({ errors });
    return errors;
  }

  renderOverlay() {
    let { loadOptions, allowAny, rows } = this.props;
    let { input, opts } = this.state;
    return (
      <Dropdown className="Dropdown--cover"
        label={false} align="left" opened
        onClose={(ev) => this.handleBlur(ev)}
      >
        {allowAny && input &&
          this.renderSelectNew()
        }
        <ul className="FormField-options"
          style={{ maxHeight: (rows * 2.26) + 'rem' }}
        >
          {loadOptions
            ? this.renderAsyncOptions()
            : this.renderOptions(opts)
          }
        </ul>
      </Dropdown>
    );
  }

  renderAsyncOptions() {
    let { noInputText } = this.props;
    let { input, val, isLoading } = this.state;

    if (val && !input) {
      return this.renderOptions([val]);
    }

    let opts = this.optionsCache[input];
    if (opts) {
      return this.renderOptions(opts);
    }

    return (
      <li className="FormField-noOptions">
        {isLoading
          ? <Icon glyph="loading" />
          : noInputText
        }
      </li>
    );
  }

  renderOptions(opts) { // eslint-disable-line complexity
    let { valueKey, labelKey, filterOptions, optionRenderer, noOptionsText } = this.props;
    let { input, val } = this.state;
    opts = filterOptions([...opts], input, val);

    if (!opts.length) {
      return (
        <li className="FormField-noOptions">
          {noOptionsText}
        </li>
      );
    }

    return opts.map((opt, i) => (
      <li key={opt[valueKey]} className={'FormField-option '
          + (val && val[valueKey] === opt[valueKey] ? ' isSelected' : '')
          + (opt.isNewOption ? ' isNew' : '')}
        onClick={() => this.handleSelect(opt)}
      >
        {optionRenderer
          ? optionRenderer(opt)
          : opt[labelKey]
        }
      </li>
    ));
  }

  renderSelectNew() {
    let { valueKey, labelKey } = this.props;
    let { input } = this.state;
    let opt = { [labelKey]: input, [valueKey]: input, isNewOption: true };
    return (
      <span className="FormField-selectNew">
        <Btn className="Btn--square"
          onClick={() => this.handleSelect(opt)}
        >
          <Icon glyph="check" />
        </Btn>
      </span>
    );
  }

  render() { // eslint-disable-line complexity
    let { className, label, disabled, size, labelKey, allowAny } = this.props;
    let { id, val, errors, focused, input } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--suggest ' + className}>
        {label !== false &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className={'FormField-control'
            + (allowAny && input ? ' FormField-control--iconR' : '')}
            style={{ width: size + 'em' }} type="text"
            value={input || (val && val[labelKey]) || ''}
            {..._pick(this.props, INPUT_PROPS)}
            autoComplete="off"
            onKeyDown={(ev) => this.handleKeyDown(ev)}
            onChange={(ev) => this.handleInputChange(ev)}
            onFocus={(ev) => this.handleFocus(ev)}
          />

          {focused &&
            this.renderOverlay()
          }

          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldSuggest.defaultProps = {
  className: '',
  label: false,
  value: '',
  name: '',
  placeholder: '',
  disabled: false,

  debounce: 200,
  debounceLoad: 1000,
  size: 100,
  rows: 7.5,
  options: [],
  valueKey: 'value',
  labelKey: 'label',
  noOptionsText: 'No results found',
  noInputText: 'Start typing to search',
  allowAny: false,

  filterOptions(options, input, selected) { return options; },
  optionRenderer: null,
  loadOptions: null,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldSuggest;
