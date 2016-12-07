import React, { Component, PropTypes } from 'react';
import DayPicker, { DateUtils, LocaleUtils } from 'react-day-picker';
import _debounce from 'lodash/debounce';
import _range from 'lodash/range';

import Dropdown from '../Dropdown';
import FormFieldTick from '../FormFieldTick';
import FormFieldSelect from '../FormFieldSelect';

class FormFieldDate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      touched: false,
      focused: false,
      errors: null,
      showPicker: props.options.length === 0,
      ...this.getPropsToState(props),
    };
    this.triggerOnChange = _debounce(this.triggerOnChange, props.debounce);
  }

  componentWillReceiveProps(nextProps) {
    let newState = this.getPropsToState(nextProps);
    this.setState(newState);
    if (this.state.touched) { // validation: punish late
      this.validate(newState.val);
    }
  }

  getPropsToState(props) {
    let val = this.normalizeValue(props.value);
    let opts = props.options.map((o) => ({
      label: o.label,
      value: this.normalizeValue(o.value),
    }));

    if (!props.hidePlaceholder) {
      opts.unshift({ label: props.placeholder, value: '' });
    }

    let newState = {
      initialMonth: val[0] ? new Date(val[0]) : new Date(),
      opts,
      val,
    };
    return newState;
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
    let { val } = this.state;
    let isFromCustom = showPicker && value === 'custom';
    if (!isFromCustom) {
      val = value;
    }

    this.setState({ showPicker, val }, () => {
      this.validate();
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
    this.setState({ focused: false, touched: true }, this.validate);
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
    let errors = this.props.validation(this.returnValue(val)) || null;
    this.setState({ errors });
    return errors;
  }

  renderFieldLabel(val) {
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
            label={o.label} delay={0}
            checked={o === checkedOpt}
            value={o.value}
            onChange={this.handleChange.bind(this, false)}
          />
        ))}
        {showCustomOpt &&
          <FormFieldTick type="radio" name={name}
            label={'Custom ' + (isRange ? 'range' : '')} delay={0}
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
    let { isRange, yearDropdown, minDate, maxDate, localization, firstDayOfWeek } = this.props;
    let { val, initialMonth } = this.state;
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
          ? <FormFieldSelect className="DayPicker-yearField" name={name}
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
        {...localization}
        firstDayOfWeek={firstDayOfWeek}
        modifiers={modifiers} enableOutsideDays
        initialMonth={initialMonth}
        captionElement={<DayPickerHeader />}
        onDayClick={this.handleDayClick.bind(this)}
      />
    );
  }

  render() {
    let { className, label, disabled, align } = this.props;
    let { val, errors, focused } = this.state;
    className += disabled ? ' isDisabled' : '';
    className += errors ? ' isInvalid' : '';
    className += focused ? ' isFocused' : '';

    return (
      <div className={'FormField FormField--date ' + className}>
        {typeof label !== 'undefined' &&
          <label className="FormField-label">{label}</label>
        }
        <div className="FormField-field" ref="field">
          <Dropdown className="Dropdown--field" ref="dropdown"
            label={this.renderFieldLabel(val)}
            align={align} disabled={disabled}
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

FormFieldDate.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  placeholder: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  debounce: PropTypes.number,

  hidePlaceholder: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  isRange: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right']),
  yearDropdown: PropTypes.bool,

  firstDayOfWeek: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
  localization: PropTypes.shape({
    months: PropTypes.arrayOf(React.PropTypes.string),
    weekdaysLong: PropTypes.arrayOf(React.PropTypes.string),
    weekdaysShort: PropTypes.arrayOf(React.PropTypes.string),
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

  validation() {},
  onChange() {},
  onFocus() {},
  onBlur() {},
};

export default FormFieldDate;
