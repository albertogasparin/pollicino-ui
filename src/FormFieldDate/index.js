import React, { Component } from 'react';
import DayPicker, { DateUtils, LocaleUtils } from 'react-day-picker';
import _debounce from 'lodash/debounce';
import _range from 'lodash/range';

import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';
import FormFieldSelect from '../FormFieldSelect';

import './style.scss';

const DAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const FIRST_DAY = 1;

// override LocaleUtils
const localeUtils = {
  formatDay: LocaleUtils.formatDay,
  formatMonthTitle: LocaleUtils.formatMonthTitle,
  formatWeekdayShort: (i, locale) => DAYS_SHORT[i],
  formatWeekdayLong: (i, locale) => DAYS_LONG[i],
  getFirstDayOfWeek: (locale) => FIRST_DAY,
};


class FormFieldDate extends Component {

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
    let opts = props.options.map((o) => ({
      label: o.label,
      value: this.normalizeValue(o.value),
    }));
    let val = this.normalizeValue(props.value);

    this.state = {
      showPicker: props.options.length === 0,
      initialMonth: val[0] ? new Date(val[0]) : new Date(),
      opts: [
        ...(props.hidePlaceholder ? [] : [{ label: props.placeholder, value: '' }]),
        ...opts,
      ],
      ...this.state,
      val,
    };
  }

  normalizeValue(value) {
    if (!Array.isArray(value)) {
      value = value ? [value, value] : [];
    }
    return value;
  }

  returnValue(val) {
    if (this.props.isRange) {
      return val;
    }
    return val[0] || '';
  }

  formatDate(day) {
    return day.toJSON().slice(0,10);
  }

  isDayDisabled(day) {
    let { minDate, maxDate } = this.props;
    return (minDate && this.formatDate(day) < this.formatDate(minDate))
      || (maxDate && this.formatDate(day) > this.formatDate(maxDate));
  }

  findOption(value) {
    let option = null;
    this.state.opts.some((o) => (
      (o.value[0] === value[0] && o.value[1] === value[1]) ? (option = o) : false
    ));
    return option;
  }

  handleChange(showPicker, value) {
    let { val, errors, focused } = this.state;
    let isFromCustom = showPicker && value === 'custom';
    if (!isFromCustom) {
      val = value;
    }

    if (!focused || errors && focused) { // validation: reward early
      this.validate(val);
    }

    this.setState({ showPicker, val }, () => {
      if (!isFromCustom && !this.props.isRange || !showPicker) {
        this.refs.dropdown.handleClose();
      }
    });
  }

  handleDayClick(ev, day, modifiers) { // eslint-disable-line complexity
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
  }

  handleYearChange(date, y) {
    this.setState({ initialMonth: new Date(y, date.getMonth()) });
  }

  handleFocus(ev) {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur(ev) {
    let { val } = this.state;
    this.setState({ focused: false });
    this.triggerOnChange(this.returnValue(val));
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

  renderFieldLabel() {
    let { val } = this.state;
    let checkedOpt = this.findOption(val);
    if (checkedOpt) {
      return checkedOpt.label;
    }
    if (!val.length) {
      return this.props.placeholder;
    }

    let [from, to] = val;
    return from.split('-').reverse().join('/')
      + (to && to !== from
        ? ' — ' + to.split('-').reverse().join('/')
        : '');
  }

  renderDropdownContent() {
    let { val, opts, showPicker } = this.state;
    let { isRange, align, name, options } = this.props;
    let showCustomOpt = options.length > 0;
    let checkedOpt = !(showCustomOpt && showPicker) && this.findOption(val);

    return (
      <div className="FormField-options" data-align={align}>
        {opts.map((o, i) => (
          <FormFieldTick key={i} type="radio" name={name}
            label={o.label} delay={50}
            checked={o === checkedOpt}
            value={o.value}
            onChange={this.handleChange.bind(this, false)}
          />
        ))}
        {showCustomOpt &&
          <FormFieldTick type="radio" name={name}
            label={'Custom ' + (isRange ? 'range' : '')} delay={50}
            checked={showPicker || (!checkedOpt && val.length > 0)}
            value="custom"
            onChange={this.handleChange.bind(this, true)}
          />
        }
        {(showPicker || (!checkedOpt && val.length > 0)) &&
          this.renderDayPicker()
        }
      </div>
    );
  }

  renderDayPicker() {
    let { isRange, yearDropdown, minDate, maxDate } = this.props;
    let { val, initialMonth } = this.state;
    let modifiers = {
      isSelected: (day) => (!isRange
        ? this.formatDate(day) === val[0]
        : DateUtils.isDayInRange(day, {
          from: new Date(val[0]),
          to: new Date(val[1]),
        })
      ),
      isDisabled: this.isDayDisabled.bind(this),
    };

    let minYear = (minDate || new Date()).getFullYear();
    let maxYear = (maxDate || new Date()).getFullYear();
    let DayPickerHeader = ({ date, locale }) => (
      <header className="DayPicker-Caption">
        {localeUtils.formatMonthTitle(date, locale).split(' ')[0] + ' '}
        {yearDropdown && minYear !== maxYear
          ? <FormFieldSelect className="DayPicker-yearField"
              value={date.getFullYear()}
              options={_range(minYear, maxYear + 1).map((v) => ({ label: v, value: v }))}
              onChange={this.handleYearChange.bind(this, date)}
            />
          : date.getFullYear()
        }
      </header>
    );

    return (
      <DayPicker className="FormField-datePicker"
        localeUtils={localeUtils}
        modifiers={modifiers} enableOutsideDays
        initialMonth={initialMonth}
        captionElement={<DayPickerHeader />}
        onDayClick={this.handleDayClick.bind(this)}
      />
    );
  }

  render() {
    let { className, label, disabled, align } = this.props;
    let { errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--date ' + className}>
        {label !== false &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field" ref="field">
          <Dropdown className="Dropdown--field" ref="dropdown"
            align={align} disabled={disabled}
            label={this.renderFieldLabel()}
            onOpen={(ev) => this.handleFocus(ev)}
            onClose={(ev) => this.handleBlur(ev)}
          >
            {this.renderDropdownContent()}
          </Dropdown>
          {errors &&
            <p className="FormField-error">{errors}</p>
          }
        </div>
      </div>
    );
  }
}

FormFieldDate.defaultProps = {
  className: '',
  label: false,
  value: '',
  placeholder: '— Select —',
  disabled: false,

  hidePlaceholder: false,
  debounce: 200,
  options: [],
  minDate: null,
  maxDate: null,
  isRange: false,
  align: 'left',
  yearDropdown: false,

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldDate;
