import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Btn from '../Btn';
import Icon from '../Icon';
import Dropdown from '../Dropdown';

// prettier-ignore
const INPUT_PROPS = ['name', 'disabled', 'placeholder', 'autoFocus', 'tabIndex'];

class FormFieldSuggest extends Component {
  state = {
    touched: false,
    focused: false,
    error: null,
    isLoading: false,
    changed: false,
    input: '',
    cache: {},
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = props => {
    let val = props.value;
    let opts = [...props.options];
    this.setState(
      ({ touched, val: prevVal }) => ({
        val,
        opts,
        id: props.id || (props.name && 'ff-suggest-' + props.name),
        ...(prevVal !== props.value ? { input: '' } : {}),
        ...(props.touched ? { touched: true } : {}),
      }),
      () => {
        if (this.state.touched) {
          this.validate();
        }
      }
    );
  };

  getAsyncOptions = _debounce(input => {
    return this.props
      .loadOptions(input)
      .then(options => {
        if (this.controlEl) {
          this.setState(prevState => ({
            cache: { ...prevState.cache, [input]: options },
            isLoading: prevState.input === input ? false : prevState.isLoading,
          }));
        }
      })
      .catch(() => {
        if (this.controlEl && this.state.input === input) {
          this.setState({ isLoading: false });
        }
      });
  }, this.props.debounceLoad);

  handleInputChange = ev => {
    let { cache } = this.state;
    let input = ev.target.value;
    this.setState({ input });

    if (this.props.loadOptions && !cache[input]) {
      this.setState({ isLoading: true });
      this.getAsyncOptions(input);
    }
  };

  handleSelect = option => {
    let { labelKey, valueKey } = this.props;

    if (!option) {
      option = null;
    }
    if (typeof option === 'string') {
      option = { [labelKey]: option, [valueKey]: option, isNewOption: true };
    }

    this.setState({ val: option, changed: true });
  };

  handleFocus = ev => {
    this.setState({ focused: true });
    clearTimeout(this.blurTimeout);
    this.props.onFocus(ev);
  };

  handleBlur = ev => {
    ev.persist();
    // wait click
    this.blurTimeout = setTimeout(() => {
      let { val, changed } = this.state;
      if (this.controlEl) {
        // still mounted
        this.setState({
          focused: false,
          touched: true,
          changed: false,
          input: '',
          ...this.validate(val, false),
        });
      }

      if (changed) {
        this.props.onChange(val);
      }
      this.props.onBlur(ev);
    }, 320);
  };

  // eslint-disable-next-line complexity
  handleKeyDown = ev => {
    let { valueKey, allowAny } = this.props;
    let { val, input } = this.state;

    switch (ev.keyCode) {
      case 13: // enter
        ev.preventDefault(); // don't submit the form
        if (allowAny) {
          this.handleSelect(input);
          this.controlEl.blur(); // trigger field blur
        }
        break;
      case 8: // backspace
      case 46: // canc
        if ((val && !val.isNewOption) || input.length === 1) {
          this.setState({ val: null, input: '', changed: true });
        }
        break;
      default:
        if (val && val.isNewOption) {
          this.setState({ val: null, input: val[valueKey], changed: true });
        }
        if (val && !val.isNewOption) {
          ev.preventDefault();
        }
    }
  };

  /*
   * @public
   */
  validate = (val = this.state.val, updateState = true) => {
    let error = this.props.validation(val) || null;
    if (updateState && error !== this.state.error) {
      this.setState({ error });
    }
    return { error };
  };

  renderOverlay = () => {
    let { loadOptions, rows } = this.props;
    let { opts } = this.state;
    return (
      <Dropdown
        className="Dropdown--cover Dropdown--field"
        align="left"
        opened
        modal={false}
      >
        <ul
          className="FormField-options"
          style={{ maxHeight: rows * 2.26 + 'rem' }}
        >
          {loadOptions ? this.renderAsyncOptions() : this.renderOptions(opts)}
        </ul>
      </Dropdown>
    );
  };

  renderAsyncOptions = () => {
    let { noInputText } = this.props;
    let { input, val, isLoading, cache } = this.state;

    if (val && !input) {
      return this.renderOptions([val]);
    }

    let opts = cache[input];
    if (opts) {
      return this.renderOptions(opts);
    }

    return (
      <li className="FormField-noOptions">
        {input && isLoading ? <Icon glyph="loading" /> : noInputText}
      </li>
    );
  };

  renderOptions = opts => {
    let {
      valueKey,
      labelKey,
      filterOptions,
      optionRenderer,
      noOptionsText,
    } = this.props;
    let { input, val } = this.state;
    opts = filterOptions([...opts], input, val);

    if (!opts.length) {
      return (
        <li className="FormField-noOptions">
          {noOptionsText}
        </li>
      );
    }

    return opts.map((opt, i) =>
      <li
        key={opt[valueKey]}
        className={
          'FormField-option ' +
          (val && val[valueKey] === opt[valueKey] ? ' isSelected' : '') +
          (opt.isNewOption ? ' isNew' : '')
        }
        onClick={() => this.handleSelect(opt)}
      >
        {optionRenderer
          ? optionRenderer(opt)
          : <Btn className="Btn--plain Btn--line">
              {opt[labelKey]}
            </Btn>}
      </li>
    );
  };

  // eslint-disable-next-line complexity
  render() {
    let {
      className,
      style,
      label,
      disabled,
      size,
      labelKey,
      allowAny,
    } = this.props;
    let { id, val, error, focused, input } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div
        className={'FormField FormField--suggest ' + className}
        style={style}
      >
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>}
        <div className="FormField-field">
          <input
            id={id}
            className={
              'FormField-control' +
              (allowAny && input ? ' FormField-control--iconR' : '')
            }
            ref={c => (this.controlEl = c)}
            style={{ width: `calc(${size}ch + 2em)` }}
            type="text"
            value={input || (val && val[labelKey]) || ''}
            {..._pick(this.props, INPUT_PROPS)}
            autoComplete="off"
            onKeyDown={this.handleKeyDown}
            onChange={this.handleInputChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />

          {focused && this.renderOverlay()}

          {focused &&
            allowAny &&
            input &&
            <span className="FormField-selectNew">
              <Btn
                className="Btn--square"
                onClick={() => this.handleSelect(this.state.input)}
              >
                <Icon glyph="check" />
              </Btn>
            </span>}

          {error &&
            <p className="FormField-error">
              {error}
            </p>}
        </div>
      </div>
    );
  }
}

FormFieldSuggest.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.object,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  touched: PropTypes.bool,

  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.object),
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  noOptionsText: PropTypes.string,
  noInputText: PropTypes.string,
  allowAny: PropTypes.bool,

  filterOptions: PropTypes.func,
  optionRenderer: PropTypes.func,
  debounceLoad: PropTypes.number,
  loadOptions: PropTypes.func,

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldSuggest.defaultProps = {
  className: '',
  value: null,

  size: 100,
  rows: 7.5,
  options: [],
  valueKey: 'value',
  labelKey: 'label',
  noOptionsText: 'No results found',
  noInputText: 'Start typing to search',

  filterOptions(options, input, selected) {
    return options;
  },
  optionRenderer: null,
  debounceLoad: 1000,
  loadOptions: null,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldSuggest;
