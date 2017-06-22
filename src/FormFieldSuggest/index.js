import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _pick from 'lodash/pick';

import Btn from '../Btn';
import Icon from '../Icon';
import Dropdown from '../Dropdown';

const INPUT_PROPS = ['name', 'disabled', 'placeholder', 'autoFocus'];

class FormFieldSuggest extends Component {

  state = {
    touched: false,
    focused: false,
    error: null,
    isLoading: false,
    input: '',
    cache: {},
  }

  componentWillMount () {
    this.setPropsToState(this.props);
  }

  componentWillReceiveProps (nextProps) {
    this.setPropsToState(nextProps);
  }

  setPropsToState = (props) => {
    let val = props.value;
    let opts = [...props.options];
    this.setState(({ touched, val: prevVal }) => ({ // eslint-disable-line complexity
      val,
      opts,
      id: props.id || props.name && 'ff-suggest-' + props.name,
      ...(prevVal !== props.value ? { input: '' } : {}),
      ...(props.touched ? { touched: true } : {}),
      ...(touched || props.touched ? this.validate(val, false) : {}),
    }));
  }

  getAsyncOptions = _debounce((input) => {
    return this.props.loadOptions(input)
      .then((options) => {
        let cache = { ...this.state.cache, [input]: options };
        if (this.state.input === input) {
          this.setState({ cache, isLoading: false });
        } else {
          this.setState({ cache });
        }
      })
      .catch(() => {
        if (this.state.input === input) {
          this.setState({ isLoading: false });
        }
      });
  }, this.props.debounceLoad)

  handleInputChange = (ev) => {
    let { cache } = this.state;
    let input = ev.target.value;
    this.setState({ input });

    if (this.props.loadOptions && !cache[input]) {
      this.setState({ isLoading: true });
      this.getAsyncOptions(input);
    }
  }

  handleSelect = (option) => {
    let { labelKey, valueKey } = this.props;

    if (!option) {
      option = null;
    }
    if (typeof option === 'string') {
      option = { [labelKey]: option, [valueKey]: option, isNewOption: true };
    }

    this.setState({ val: option });
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    clearTimeout(this.blurTimeout);
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    ev.persist();
    this.blurTimeout = setTimeout(() => { // wait click
      let { val } = this.state;
      if (this.controlEl) { // still mounted
        this.setState({
          focused: false, touched: true, input: '', ...this.validate(val, false),
        });
      }
      this.props.onChange(val);
      this.props.onBlur(ev);
    }, 320);
  }

  handleKeyDown = (ev) => { // eslint-disable-line complexity
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
        if (val && !val.isNewOption || input.length === 1) {
          this.setState({ val: null, input: '' });
        }
        break;
      default:
        if (val && val.isNewOption) {
          this.setState({ val: null, input: val[valueKey] });
        }
        if (val && !val.isNewOption) {
          ev.preventDefault();
        }
    }
  }

  /*
   * @public
   */
  validate = (val = this.state.val, updateState = true) => {
    let error = this.props.validation(val) || null;
    if (updateState) {
      this.setState({ error });
    }
    return { error };
  }

  renderOverlay = () => {
    let { loadOptions, allowAny, rows } = this.props;
    let { input, opts } = this.state;
    return (
      <Dropdown className="Dropdown--cover Dropdown--field"
        align="left" opened modal={false}
      >
        {allowAny && input &&
          <span className="FormField-selectNew">
            <Btn className="Btn--square"
              onClick={() => this.handleSelect(this.state.input)}
            >
              <Icon glyph="check" />
            </Btn>
          </span>
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
        {input && isLoading
          ? <Icon glyph="loading" />
          : noInputText
        }
      </li>
    );
  }

  renderOptions = (opts) => { // eslint-disable-line complexity
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
          : <Btn className="Btn--plain Btn--line">{opt[labelKey]}</Btn>
        }
      </li>
    ));
  }

  render () { // eslint-disable-line complexity
    let { className, style, label, disabled, size, labelKey, allowAny } = this.props;
    let { id, val, error, focused, input } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';
    return (
      <div className={'FormField FormField--suggest ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label" htmlFor={id}>{label}</label>
        }
        <div className="FormField-field">
          <input id={id} className={'FormField-control'
            + (allowAny && input ? ' FormField-control--iconR' : '')}
            ref={c => this.controlEl = c}
            style={{ width: size + 'em' }} type="text"
            value={input || (val && val[labelKey]) || ''}
            {..._pick(this.props, INPUT_PROPS)}
            autoComplete="off"
            onKeyDown={this.handleKeyDown}
            onChange={this.handleInputChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />

          {focused &&
            this.renderOverlay()
          }

          {error &&
            <p className="FormField-error">{error}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldSuggest.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.any, // eslint-disable-line react/no-unused-prop-types
  placeholder: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  disabled: PropTypes.bool,
  touched: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/no-unused-prop-types
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  noOptionsText: PropTypes.string,
  noInputText: PropTypes.string,
  allowAny: PropTypes.bool,
  autoFocus: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types

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
  value: '',

  size: 100,
  rows: 7.5,
  options: [],
  valueKey: 'value',
  labelKey: 'label',
  noOptionsText: 'No results found',
  noInputText: 'Start typing to search',

  filterOptions (options, input, selected) { return options; },
  optionRenderer: null,
  debounceLoad: 1000,
  loadOptions: null,

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldSuggest;
