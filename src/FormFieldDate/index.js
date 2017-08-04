import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils, LocaleUtils } from 'react-day-picker';
import _debounce from 'lodash/debounce';
import _range from 'lodash/range';

import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';
import FormFieldSelect from '../FormFieldSelect';

/**
 * @class FormFieldDate
 * @augments {Component<{
      align?: 'left' | 'right'
      className?: string
      debounce?: number
      disabled?: boolean
      firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
      hidePlaceholder?: boolean
      isRange?: boolean
      label?
      localization?: { months, weekdaysLong, weekdaysShort }
      maxDate?: Date
      minDate?: Date
      name?: string
      options?: Array<{ label, value }>
      placeholder?: string
      style?: Object
      tabIndex?: number
      touched?: boolean
      value?: string | string[]
      yearDropdown?: boolean
      onBlur?: Function
      onChange?: Function
      onFocus?: Function
      validation?: Function
    }, {
      error: boolean
      focused: boolean
      month?: Date
      opts?: Array<{ label, value }>
      showPicker?: boolean
      touched: boolean
      val?: string | string[]
    }>}
 */
class FormFieldDate extends Component {
  static propTypes = {
    align: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    debounce: PropTypes.number,
    disabled: PropTypes.bool,
    firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
    hidePlaceholder: PropTypes.bool,
    isRange: PropTypes.bool,
    label: PropTypes.node,
    localization: PropTypes.shape({
      months: PropTypes.arrayOf(PropTypes.string),
      weekdaysLong: PropTypes.arrayOf(PropTypes.string),
      weekdaysShort: PropTypes.arrayOf(PropTypes.string),
    }),
    maxDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    placeholder: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    touched: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    yearDropdown: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validation: PropTypes.func,
  };

  static defaultProps = {
    align: 'left',
    className: '',
    debounce: 200,
    firstDayOfWeek: 1,
    localization: {},
    options: [],
    placeholder: '— Select —',
    value: '',
    onBlur() {},
    onChange() {},
    onFocus() {},
    validation() {},
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
      ...props.options.map(o => ({
        label: o.label,
        value: this.normalizeValue(o.value),
      })),
    ];
    this.setState(
      ({ touched, showPicker }) => ({
        val,
        opts,
        month: val[0] ? new Date(val[0]) : new Date(),
        showPicker:
          typeof showPicker === 'undefined'
            ? props.options.length === 0
            : showPicker,
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
      value = value ? [value, value] : [];
    }
    return value;
  };

  returnValue = (val = this.state.val) => {
    return this.props.isRange ? val : val[0] || '';
  };

  formatDate = day => {
    return (
      day.getFullYear() +
      '-' +
      ('0' + (day.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + day.getDate()).slice(-2)
    );
  };

  isDayDisabled = day => {
    let { minDate, maxDate } = this.props;
    return (
      (minDate && this.formatDate(day) < this.formatDate(minDate)) ||
      (maxDate && this.formatDate(day) > this.formatDate(maxDate))
    );
  };

  findOption = value => {
    let option = null;
    this.state.opts.some(
      o =>
        o.value[0] === value[0] && o.value[1] === value[1]
          ? (option = o)
          : false
    );
    return option;
  };

  handleChange = (showPicker, value) => {
    let { val } = this.state;
    let isFromCustom = showPicker && value === 'custom';
    if (!isFromCustom) {
      val = value;
    }

    this.setState(
      {
        showPicker,
        val,
        month: val[0] ? new Date(val[0]) : new Date(),
        ...this.validate(val, false),
      },
      () => {
        if ((!isFromCustom && !this.props.isRange) || !showPicker) {
          this.dropdownEl.handleClose();
        }
      }
    );
  };

  // eslint-disable-next-line complexity
  handleDayClick = (day, modifiers, ev) => {
    let { val } = this.state;

    if (modifiers.isDisabled) {
      return;
    }

    if (!this.props.isRange) {
      return this.handleChange(true, [
        this.formatDate(day),
        this.formatDate(day),
      ]);
    }

    let range = DateUtils.addDayToRange(day, {
      from: new Date(val[0] || day),
      to: new Date(val[1] || day),
    });

    this.handleChange(true, [
      this.formatDate(range.from || day),
      this.formatDate(range.to || day),
    ]);
  };

  handleYearChange = (date, y) => {
    this.setState({ month: new Date(y, date.getMonth()) });
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
    this.triggerOnChange(this.returnValue());
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

  renderFieldLabel = val => {
    let checkedOpt = this.findOption(val);
    if (checkedOpt) {
      return checkedOpt.label;
    }
    if (!val.length) {
      return this.props.placeholder;
    }

    let [from, to] = val;
    return (
      from.split('-').reverse().join('/') +
      (to && to !== from ? ' — ' + to.split('-').reverse().join('/') : '')
    );
  };

  renderDropdownContent = () => {
    let { val, opts, showPicker } = this.state;
    let { isRange, align, name, options } = this.props;
    let showCustomOpt = options.length > 0;
    let checkedOpt = !(showCustomOpt && showPicker) && this.findOption(val);

    return (
      <div className="FormField-options" data-align={align}>
        {opts.map((o, i) =>
          <FormFieldTick
            key={i}
            type="radio"
            name={name}
            label={o.label}
            delay={0}
            checked={o === checkedOpt}
            value={o.value}
            onChange={v => this.handleChange(false, v)}
          />
        )}
        {showCustomOpt &&
          <FormFieldTick
            type="radio"
            name={name}
            label={'Custom ' + (isRange ? 'range' : '')}
            delay={0}
            checked={showPicker || (!checkedOpt && val.length > 0)}
            value="custom"
            onChange={v => this.handleChange(true, v)}
          />}
        {(showPicker || !showCustomOpt || (!checkedOpt && val.length > 0)) &&
          this.renderDayPicker()}
      </div>
    );
  };

  renderDayPicker = () => {
    let {
      isRange,
      yearDropdown,
      minDate,
      maxDate,
      localization,
      firstDayOfWeek,
    } = this.props;
    let { val, month } = this.state;
    let modifiers = {
      isSelected: day => {
        let d = this.formatDate(day);
        return isRange ? d >= val[0] && d <= val[1] : d === val[0];
      },
      isDisabled: this.isDayDisabled.bind(this),
    };

    let minYear = (minDate || new Date()).getFullYear();
    let maxYear = (maxDate || new Date()).getFullYear();
    let DayPickerHeader = ({ date, locale }) =>
      <header className="DayPicker-Caption">
        {LocaleUtils.formatMonthTitle(date, locale).split(' ')[0] + ' '}
        {yearDropdown && minYear !== maxYear
          ? <FormFieldSelect
              className="DayPicker-yearField"
              value={date.getFullYear()}
              options={_range(minYear, maxYear + 1).map(v => ({
                label: v,
                value: v,
              }))}
              onChange={v => this.handleYearChange(date, v)}
            />
          : date.getFullYear()}
      </header>;

    return (
      <DayPicker
        className="FormField-datePicker"
        {...localization}
        firstDayOfWeek={firstDayOfWeek}
        modifiers={modifiers}
        enableOutsideDays
        month={month}
        captionElement={DayPickerHeader}
        onDayClick={this.handleDayClick}
      />
    );
  };

  render() {
    let { className, style, label, disabled, align, tabIndex } = this.props;
    let { val, error, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += error ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--date ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label">
            {label}
          </label>}
        <div className="FormField-field">
          <Dropdown
            className="Dropdown--field"
            ref={c => (this.dropdownEl = c)}
            label={this.renderFieldLabel(val)}
            align={align}
            disabled={disabled}
            tabIndex={tabIndex}
            onOpen={this.handleFocus}
            onClose={this.handleBlur}
          >
            {this.renderDropdownContent()}
          </Dropdown>
          {error &&
            <p className="FormField-error">
              {error}
            </p>}
        </div>
      </div>
    );
  }
}

export default FormFieldDate;
