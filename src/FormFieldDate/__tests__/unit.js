/* eslint-env mocha *//* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldDate from '..';

describe('<FormFieldDate />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldDate {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldDate {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldDate {...props} />);
      wrapper.setState({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });

  });


  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = {
        value: '2000-01-01',
        placeholder: 'select',
        validation: td.func('validation'),
      };
      wrapper = shallow(<FormFieldDate {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        val: [props.value, props.value],
        opts: [{ label: 'select', value: '' }],
        month: new Date(props.value),
        showPicker: true,
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ value: ['2000-01-01', '2010-01-01'], hidePlaceholder: true });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        val: [props.value, '2010-01-01'],
        opts: [],
        month: new Date(props.value),
        showPicker: true,
      });
    });

    it('should rebuild options normalizing values', () => {
      wrapper.setProps({ options: [{ label: 'a', value: '2010-01-01' }] });
      expect(wrapper.state().opts).to.eql([
        { label: 'select', value: '' },
        { label: 'a', value: ['2010-01-01', '2010-01-01'] },
      ]);
    });

    it('should validate on prop change if touched', () => {
      wrapper.setProps({ value: 'b', touched: true });
      expect(props.validation).to.have.been.calledWith('b');
    });

  });


  describe('normalizeValue', () => {
    let props, instance;

    beforeEach(() => {
      props = {};
      instance = shallow(<FormFieldDate {...props} />).instance();
    });

    it('should return an empty array if not value', () => {
      expect(instance.normalizeValue('')).to.eql([]);
    });

    it('should return an array with double value if not array', () => {
      expect(instance.normalizeValue('2010-01-01')).to.eql(['2010-01-01', '2010-01-01']);
    });

    it('should return value if value is array', () => {
      expect(instance.normalizeValue(['2010-01-01'])).to.eql(['2010-01-01']);
    });

  });


  describe('returnValue', () => {
    let props, instance;

    it('should return a string', () => {
      props = {};
      instance = shallow(<FormFieldDate {...props} />).instance();
      expect(instance.returnValue(['2010-01-01'])).to.eql('2010-01-01', '2010-01-01');
    });

    it('should return an array if is range', () => {
      props = { isRange: true };
      instance = shallow(<FormFieldDate {...props} />).instance();
      expect(instance.returnValue(['2010-01-01'])).to.eql(['2010-01-01']);
    });

  });


  describe('formatDate', () => {
    let props, instance;

    it('should return a formatted date', () => {
      props = {};
      instance = shallow(<FormFieldDate {...props} />).instance();
      expect(instance.formatDate(new Date('2010-01-01'))).to.eql('2010-01-01');
    });

  });


  describe('formatDate', () => {
    let props, instance;

    it('should return false if no min/maxDate', () => {
      props = {};
      instance = shallow(<FormFieldDate {...props} />).instance();
      expect(instance.isDayDisabled(new Date('2010-01-05'))).not.to.be.ok;
    });

    it('should return a true if date under minDate', () => {
      props = { minDate: new Date('2010-01-05') };
      instance = shallow(<FormFieldDate {...props} />).instance();
      expect(instance.isDayDisabled(new Date('2010-01-01'))).to.eql(true);
    });

    it('should return a true if date over maxDate', () => {
      props = { maxDate: new Date('2010-01-01') };
      instance = shallow(<FormFieldDate {...props} />).instance();
      expect(instance.isDayDisabled(new Date('2010-01-05'))).to.eql(true);
    });

  });


  describe('handleChange()', () => {
    let props, instance;

    describe('on option click', () => {

      beforeEach(() => {
        props = { value: '', validation: td.func('validation') };
        instance = shallow(<FormFieldDate {...props} />).instance();
        instance.dropdownEl = td.object(['handleClose']);
        instance.handleChange(false, ['2010-01-01']);
      });

      it('should update val state', () => {
        expect(instance.state.val).to.eql(['2010-01-01']);
      });

      it('should validate if focused and with error', () => {
        expect(props.validation).to.have.been.called;
      });

      it('should trigger dropdown close', () => {
        expect(instance.dropdownEl.handleClose).to.have.been.called;
      });

    });

    describe('on custom option click', () => {

      beforeEach(() => {
        props = {};
        instance = shallow(<FormFieldDate {...props} />).instance();
        instance.dropdownEl = td.object(['handleClose']);
        instance.handleChange(true, 'custom');
      });

      it('should not replace val', () => {
        expect(instance.state.val).to.eql([]);
      });

      it('should keep dropdown open', () => {
        expect(instance.dropdownEl.handleClose).not.to.have.been.called;
      });
    });


    describe('on calendar click', () => {

      beforeEach(() => {
        props = {};
        instance = shallow(<FormFieldDate {...props} />).instance();
        instance.dropdownEl = td.object(['handleClose']);
        instance.handleChange(true, 'custom');
      });

      it('should trigger dropdown close', () => {
        instance.handleChange(true, ['2010-01-01']);
        expect(instance.dropdownEl.handleClose).to.have.been.called;
      });

    });


    describe('on range calendar click', () => {

      beforeEach(() => {
        props = { isRange: true };
        instance = shallow(<FormFieldDate {...props} />).instance();
        instance.dropdownEl = td.object(['handleClose']);
        instance.handleChange(true, 'custom');
      });

      it('should keep dropdown open', () => {
        instance.handleChange(true, ['2010-01-01', '2010-01-02']);
        expect(instance.dropdownEl.handleClose).not.to.have.been.called;
      });

    });

  });


  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldDate {...props} />).instance();
      instance.handleFocus();
    });

    it('should set focused state', () => {
      expect(instance.state.focused).to.eql(true);
    });

    it('should call onFocus prop', () => {
      expect(props.onFocus).to.have.been.called;
    });

  });


  describe('handleBlur()', () => {
    let props, instance;

    beforeEach(() => {
      props = {
        value: '',
        debounce: 0,
        onBlur: td.func('onBlur'),
        validation: td.func('validation'),
        onChange: td.func('onChange'),
      };
      instance = shallow(<FormFieldDate {...props} />).instance();
      instance.handleBlur();
    });

    it('should unset focused state', () => {
      expect(instance.state.focused).to.eql(false);
    });

    it('should set touched state', () => {
      expect(instance.state.touched).to.eql(true);
    });

    it('should call onBlur prop', () => {
      expect(props.onBlur).to.have.been.called;
    });

    it('should call onChange prop', (done) => {
      setTimeout(() => {
        expect(props.onChange).to.have.been.called;
        done();
      }, 20);
    });

    it('should validate value', () => {
      expect(props.validation).to.have.been.called;
    });

  });


  describe('validate()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', validation: td.func('validation') };
      instance = shallow(<FormFieldDate {...props} />).instance();
    });

    it('should call validation prop', () => {
      instance.validate(['2010-01-01']);
      expect(props.validation).to.have.been.calledWith('2010-01-01');
    });

    it('should set error state', () => {
      td.when(props.validation('')).thenReturn('Error');
      instance.validate();
      expect(instance.state.error).to.eql('Error');
    });

    it('should use state value if no arguments', () => {
      instance.validate();
      expect(props.validation).to.have.been.calledWith('');
    });

  });


  describe('renderFieldLabel()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', options: [{ label: 'a', value: '2000-01-01' }] };
      instance = shallow(<FormFieldDate {...props} />).instance();
    });

    it('should return option label if value matches', () => {
      let result = instance.renderFieldLabel(['2000-01-01', '2000-01-01']);
      expect(result).to.eql('a');
    });

    it('should return single date if single day', () => {
      let result = instance.renderFieldLabel(['2000-01-05', '2000-01-05']);
      expect(result).to.eql('05/01/2000');
    });

    it('should return two dates if date range', () => {
      let result = instance.renderFieldLabel(['2000-01-05', '2000-01-10']);
      expect(result).to.eql('05/01/2000 — 10/01/2000');
    });

  });


});
