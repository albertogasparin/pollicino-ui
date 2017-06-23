/* eslint-env mocha *//* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldTextarea from '..';

describe('<FormFieldTextarea />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldTextarea {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldTextarea {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldTextarea {...props} />);
      wrapper.setState({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });

  });


  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { name: 'a', value: 'a', validation: td.func('validation') };
      wrapper = shallow(<FormFieldTextarea {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        id: 'ff-textarea-a',
        val: 'a',
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', value: 'b' });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        id: 'a',
        val: 'b',
      });
    });

    it('should validate on prop change if touched', () => {
      wrapper.setProps({ value: 'b', touched: true });
      expect(props.validation).to.have.been.calledWith('b');
    });

  });


  describe('handleChange()', () => {
    let props, wrapper, instance;
    let ev = { target: { value: 'a' } };

    beforeEach(() => {
      props = {
        value: '',
        debounce: 0,
        onChange: td.func('onChange'),
        validation: td.func('validation'),
      };
      wrapper = shallow(<FormFieldTextarea {...props} />);
      instance = wrapper.instance();
    });

    it('should update val state', () => {
      instance.handleChange(ev);

      expect(instance.state.val).to.eql('a');
    });

    it('should call onChange', (done) => {
      instance.handleChange(ev);

      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith('a');
        done();
      }, 10);
    });

    it('should call updated prop onChange', (done) => {
      let onChange2 = td.func('onChange');
      wrapper.setProps({ onChange: onChange2 });
      instance.handleChange(ev);

      setTimeout(() => {
        expect(onChange2).to.have.been.calledWith('a');
        done();
      }, 10);
    });

    it('should validate if focused and with error', () => {
      instance.setState({ focused: true, error: 'Error' });
      instance.handleChange(ev);

      expect(props.validation).to.have.been.called;
    });

  });


  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldTextarea {...props} />).instance();
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
      props = { value: '', onBlur: td.func('onBlur'), validation: td.func('validation') };
      instance = shallow(<FormFieldTextarea {...props} />).instance();
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

    it('should validate value', () => {
      expect(props.validation).to.have.been.called;
    });

  });


  describe('validate()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: 'a', validation: td.func('validation') };
      instance = shallow(<FormFieldTextarea {...props} />).instance();
    });

    it('should call validation prop', () => {
      instance.validate('');
      expect(props.validation).to.have.been.calledWith('');
    });

    it('should set error state', () => {
      td.when(props.validation('')).thenReturn('Error');
      instance.validate('');
      expect(instance.state.error).to.eql('Error');
    });

    it('should use state value if no arguments', () => {
      instance.validate();
      expect(props.validation).to.have.been.calledWith('a');
    });

  });


});
