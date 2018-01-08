import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Btn from '../Btn';
import Icon from '../Icon';
import Dropdown from '../Dropdown';

// prettier-ignore
const INPUT_PROPS = [
  'name', 'disabled', 'placeholder', 'autoFocus', 'tabIndex', 'readOnly'
];

/**
 * @class FormFieldSuggest
 * @augments {Component<{
      [x:string]: any
      allowAny?: boolean
      className?: string
      debounceLoad?: number
      disabled?: boolean
      id?: string
      label?
      labelKey?: string
      name?: string
      noInputText?: string
      noOptionsText?: string
      options?: Array<Object>
      placeholder?: string
      readOnly?: boolean
      rows?: string | number
      size?: string | number
      style?: Object
      touched?: boolean
      value?: Object
      valueKey?: string
      filterOptions?: Function
      loadOptions?: Function
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      optionRenderer?: Function
      validation?: Function
    }, any>}
 */
class FormFieldSuggest extends Component {
  static propTypes = {
    allowAny: PropTypes.bool,
    className: PropTypes.string,
    debounceLoad: PropTypes.number,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    label: PropTypes.node,
    labelKey: PropTypes.string,
    name: PropTypes.string,
    noInputText: PropTypes.string,
    noOptionsText: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.object,
    touched: PropTypes.bool,
    value: PropTypes.object,
    valueKey: PropTypes.string,
    filterOptions: PropTypes.func,
    loadOptions: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    optionRenderer: PropTypes.func,
    validation: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    debounceLoad: 1000,
    labelKey: 'label',
    noInputText: 'Start typing to search',
    noOptionsText: 'No results found',
    options: [],
    rows: 7.5,
    size: 100,
    value: null,
    valueKey: 'value',
    filterOptions: (options, input, selected) => options,
    loadOptions: null,
    onBlur() {},
    onChange() {},
    onFocus() {},
    optionRenderer: null,
    validation() {},
  };

  state = {
    cache: {},
    changed: false,
    error: null,
    focused: false,
    input: '',
    isLoading: false,
    touched: false,
    kbdFocusIdx: -1,
  };

  componentWillMount() {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
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

  getAsyncOptions = _debounce((input) => {
    return this.props
      .loadOptions(input)
      .then((options) => {
        if (this.controlEl) {
          this.setState((prevState) => ({
            cache: { ...prevState.cache, [input]: options },
            isLoading: prevState.input === input ? false : prevState.isLoading,
            opts: options,
          }));
        }
      })
      .catch(() => {
        if (this.controlEl && this.state.input === input) {
          this.setState({ isLoading: false, opts: [] });
        }
      });
  }, this.props.debounceLoad);

  handleInputChange = (ev) => {
    let { options, filterOptions } = this.props;
    let { cache, val } = this.state;
    let input = ev.target.value;

    this.setState({ input, kbdFocusIdx: -1 });
    if (this.props.loadOptions && !cache[input]) {
      this.setState({ isLoading: true });
      this.getAsyncOptions(input);
    }
    if (!this.props.loadOptions) {
      this.setState({ opts: filterOptions([...options], input, val) });
    }
  };

  handleSelect = (option) => {
    let { labelKey, valueKey } = this.props;

    if (!option) {
      option = null;
    }
    if (typeof option === 'string') {
      option = { [labelKey]: option, [valueKey]: option, isNewOption: true };
    }

    this.setState({ val: option, changed: true });
    this.controlEl.blur(); // trigger field blur
  };

  handleFocus = (ev) => {
    this.setState({ focused: true });
    clearTimeout(this.blurTimeout);
    this.props.onFocus(ev);
  };

  handleBlur = (ev) => {
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
          kbdFocusIdx: -1,
          ...(!val ? { input: '', opts: this.props.options } : {}),
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
  handleKeyDown = (ev) => {
    let { valueKey, allowAny } = this.props;
    let { val, input, kbdFocusIdx, opts } = this.state;
    switch (ev.keyCode) {
      case 13: // enter
        ev.preventDefault(); // don't submit the form
        if (opts[kbdFocusIdx]) {
          this.handleSelect(opts[kbdFocusIdx]);
        } else if (allowAny) {
          this.handleSelect(input);
        }
        break;
      case 8: // backspace
      case 46: // canc
        if (val) {
          this.setState({ val: null, changed: true });
        }
        break;
      case 38: // up
      case 40: // down
        kbdFocusIdx += ev.keyCode === 38 ? -1 : 1;
        kbdFocusIdx = Math.max(0, Math.min(kbdFocusIdx, opts.length - 1));
        this.setState({ kbdFocusIdx });
        ev.preventDefault();
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

  validate = (val = this.state.val, updateState = true) => {
    let error = this.props.validation(val) || null;
    if (updateState && error !== this.state.error) {
      this.setState({ error });
    }
    return { error };
  };

  kbdScrollIntoView = (el) => {
    let parent = el.parentNode;
    let eDim = el.getBoundingClientRect();
    let pDim = parent.getBoundingClientRect();
    let startY = parent.scrollTop;
    let endY = startY;
    let offsetY = startY + eDim.top - pDim.top;
    let topEdge = offsetY - 20;
    let bottomEdge = offsetY + eDim.height - pDim.height + 20;

    if (topEdge < startY) {
      endY = topEdge;
    }
    if (bottomEdge > startY) {
      endY = bottomEdge;
    }
    parent.scrollTop = endY;
  };

  renderOverlay = () => {
    let { loadOptions, rows, noInputText } = this.props;
    let { isLoading, input } = this.state;
    return (
      <Dropdown
        className="Dropdown--cover Dropdown--field"
        align="left"
        opened
        modal={false}
      >
        <ul
          className="FormField-options"
          style={{ maxHeight: Number(rows) * 2.26 + 'rem' }}
        >
          {loadOptions && (isLoading || !input) ? (
            <li className="FormField-noOptions">
              {isLoading ? <Icon glyph="loading" /> : noInputText}
            </li>
          ) : (
            this.renderOptions()
          )}
        </ul>
      </Dropdown>
    );
  };

  renderOptions = () => {
    let { valueKey, labelKey, optionRenderer, noOptionsText } = this.props;
    let { opts, val, kbdFocusIdx } = this.state;

    if (!opts.length) {
      return <li className="FormField-noOptions">{noOptionsText}</li>;
    }

    return opts.map((opt, i) => (
      <li
        key={opt[valueKey]}
        ref={(c) => c && kbdFocusIdx === i && this.kbdScrollIntoView(c)}
        className={
          'FormField-option ' +
          (val && val[valueKey] === opt[valueKey] ? ' isSelected' : '') +
          (opt.isNewOption ? ' isNew' : '') +
          (kbdFocusIdx === i ? ' isFocused' : '')
        }
        onClick={() => this.handleSelect(opt)}
      >
        {optionRenderer ? (
          optionRenderer(opt)
        ) : (
          <Btn
            className="Btn--plain Btn--line"
            aria-selected={kbdFocusIdx === i}
          >
            {opt[labelKey]}
          </Btn>
        )}
      </li>
    ));
  };

  // eslint-disable-next-line complexity
  render() {
    let {
      className,
      style,
      label,
      disabled,
      readOnly,
      size,
      labelKey,
      allowAny,
    } = this.props;
    let { id, val, error, focused, input } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += readOnly ? ' isReadOnly' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div
        className={'FormField FormField--suggest ' + className}
        style={style}
      >
        {typeof label !== 'undefined' && (
          <label className="FormField-label" htmlFor={id}>
            {label}
          </label>
        )}
        <div className="FormField-field">
          <input
            id={id}
            className={
              'FormField-control' +
              (allowAny && input ? ' FormField-control--iconR' : '')
            }
            ref={(c) => (this.controlEl = c)}
            style={{ width: `calc(${size}ch + 2em)` }}
            type="text"
            value={val ? val[labelKey] : input}
            {..._pick(this.props, INPUT_PROPS)}
            autoComplete="off"
            onKeyDown={this.handleKeyDown}
            onChange={this.handleInputChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />

          {focused && !readOnly && this.renderOverlay()}

          {focused &&
            !readOnly &&
            allowAny &&
            input && (
              <span className="FormField-selectNew">
                <Btn
                  className="Btn--square"
                  onClick={() => this.handleSelect(this.state.input)}
                >
                  <Icon glyph="check" />
                </Btn>
              </span>
            )}

          {error && <p className="FormField-error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormFieldSuggest;
