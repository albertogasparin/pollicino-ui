import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils, LocaleUtils } from 'react-day-picker';
import _debounce from 'lodash/debounce';
import _range from 'lodash/range';

import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';
import FormFieldSelect from '../FormFieldSelect';

class FormFieldDate extends Component {

  constructor (props) {
    super(props);
    this.state = {
      touched: false,
      focused: false,
      errors: null,
      showPicker: props.options.length === 0,
      ...this.mapPropsToState(props),
    };
  }

  componentWillReceiveProps (nextProps) {
    let newState = this.mapPropsToState(nextProps);
    this.setState(newState);
    if (this.state.touched) { // validation: punish late
      this.validate(newState.val);
    }
  }

  mapPropsToState = (props) => {
    let val = this.normalizeValue(props.value);
    let opts = props.options.map((o) => ({
      label: o.label,
      value: this.normalizeValue(o.value),
    }));

    if (!props.hidePlaceholder) {
      opts.unshift({ label: props.placeholder, value: '' });
    }

    return {
      month: val[0] ? new Date(val[0]) : new Date(),
      opts,
      val,
    };
  }

  normalizeValue = (value) => {
    if (!Array.isArray(value)) {
      value = value ? [value, value] : [];
    }
    return value;
  }

  returnValue = (val) => {
    if (this.props.isRange) {
      return val;
    }
    return val[0] || '';
  }

  formatDate = (day) => {
    return day.toJSON().slice(0,10);
  }

  isDayDisabled = (day) => {
    let { minDate, maxDate } = this.props;
    return (minDate && this.formatDate(day) < this.formatDate(minDate))
      || (maxDate && this.formatDate(day) > this.formatDate(maxDate));
  }

  findOption = (value) => {
    let option = null;
    this.state.opts.some((o) => (
      (o.value[0] === value[0] && o.value[1] === value[1]) ? (option = o) : false
    ));
    return option;
  }

  handleChange = (showPicker, value) => {
    let { val } = this.state;
    let isFromCustom = showPicker && value === 'custom';
    if (!isFromCustom) {
      val = value;
    }

    this.setState({ showPicker, val }, () => {
      this.validate();
      if (!isFromCustom && !this.props.isRange || !showPicker) {
        this.dropdownEl.handleClose();
      }
    });
  }

  handleDayClick = (day, modifiers, ev) => { // eslint-disable-line complexity
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

  handleYearChange = (date, y) => {
    this.setState({ month: new Date(y, date.getMonth()) });
  }

  handleFocus = (ev) => {
    this.setState({ focused: true });
    this.props.onFocus(ev);
  }

  handleBlur = (ev) => {
    let { val } = this.state;
    this.setState({ focused: false, touched: true }, this.validate);
    this.triggerOnChange(this.returnValue(val));
    this.props.onBlur(ev);
  }

  triggerOnChange = _debounce(this.props.onChange, this.props.debounce)

  /**
   * @public
   */
  validate = (val = this.state.val) => {
    let errors = this.props.validation(this.returnValue(val)) || null;
    this.setState({ errors });
    return errors;
  }

  renderFieldLabel = (val) => {
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

  renderDropdownContent = () => {
    let { val, opts, showPicker } = this.state;
    let { isRange, align, name, options } = this.props;
    let showCustomOpt = options.length > 0;
    let checkedOpt = !(showCustomOpt && showPicker) && this.findOption(val);

    return (
      <div className="FormField-options" data-align={align}>
        {opts.map((o, i) => (
          <FormFieldTick key={i} type="radio" name={name}
            label={o.label} delay={0}
            checked={o === checkedOpt}
            value={o.value}
            onChange={(v) => this.handleChange(false, v)}
          />
        ))}
        {showCustomOpt &&
          <FormFieldTick type="radio" name={name}
            label={'Custom ' + (isRange ? 'range' : '')} delay={0}
            checked={showPicker || (!checkedOpt && val.length > 0)}
            value="custom"
            onChange={(v) => this.handleChange(true, v)}
          />
        }
        {(showPicker || (!checkedOpt && val.length > 0)) &&
          this.renderDayPicker()
        }
      </div>
    );
  }

  renderDayPicker = () => {
    let { isRange, yearDropdown, minDate, maxDate, localization, firstDayOfWeek } = this.props;
    let { val, month } = this.state;
    let modifiers = {
      isSelected: (day) => {
        let d = this.formatDate(day);
        return isRange ? (d >= val[0] && d <= val[1]) : d === val[0];
      },
      isDisabled: this.isDayDisabled.bind(this),
    };

    let minYear = (minDate || new Date()).getFullYear();
    let maxYear = (maxDate || new Date()).getFullYear();
    let DayPickerHeader = ({ date, locale }) => (
      <header className="DayPicker-Caption">
        {LocaleUtils.formatMonthTitle(date, locale).split(' ')[0] + ' '}
        {yearDropdown && minYear !== maxYear
          ? <FormFieldSelect className="DayPicker-yearField"
              value={date.getFullYear()}
              options={_range(minYear, maxYear + 1).map((v) => ({ label: v, value: v }))}
              onChange={(v) => this.handleYearChange(date, v)}
            />
          : date.getFullYear()
        }
      </header>
    );

    return (
      <DayPicker className="FormField-datePicker"
        {...localization}
        firstDayOfWeek={firstDayOfWeek}
        modifiers={modifiers} enableOutsideDays
        month={month}
        captionElement={<DayPickerHeader />}
        onDayClick={this.handleDayClick}
      />
    );
  }

  render () {
    let { className, style, label, disabled, align } = this.props;
    let { val, errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--date ' + className} style={style}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field">
          <Dropdown className="Dropdown--field"
            ref={c => this.dropdownEl = c}
            label={this.renderFieldLabel(val)}
            align={align} disabled={disabled}
            onOpen={this.handleFocus}
            onClose={this.handleBlur}
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

FormFieldDate.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]), // eslint-disable-line react/no-unused-prop-types
  placeholder: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  hidePlaceholder: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  options: PropTypes.arrayOf(PropTypes.object),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  isRange: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
  yearDropdown: PropTypes.bool,

  firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
  localization: PropTypes.shape({
    months: PropTypes.arrayOf(PropTypes.string),
    weekdaysLong: PropTypes.arrayOf(PropTypes.string),
    weekdaysShort: PropTypes.arrayOf(PropTypes.string),
  }),

  validation: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

FormFieldDate.defaultProps = {
  className: '',
  value: '',
  placeholder: '— Select —',
  debounce: 200,

  options: [],
  align: 'left',
  firstDayOfWeek: 1,
  localization: {},

  validation () {},
  onChange () {},
  onFocus () {},
  onBlur () {},
};

export default FormFieldDate;
