/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldNumber from '..';

describe('<FormFieldNumber />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { value: 1 };
      let wrapper = shallow(<FormFieldNumber {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { value: 1 };
      let wrapper = shallow(<FormFieldNumber {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { value: 1 };
      let wrapper = shallow(<FormFieldNumber {...props} />);
      wrapper.setState({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { name: 'a', validation: td.func('validation') };
      wrapper = shallow(<FormFieldNumber {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        id: 'ff-number-a',
        val: 0,
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', value: 2 });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        id: 'a',
        val: 2,
      });
    });

    it('should validate on prop change if touched', () => {
      wrapper.setProps({ value: 2, touched: true });
      expect(props.validation).to.have.been.calledWith(2);
    });
  });

  describe('preciseSum()', () => {
    let props, instance;
    let tests = [
      { value: 1, step: 2, result: 3 },
      { value: 1, step: 0.1, result: 1.1, decimals: 1 },
      { value: 1.001, step: 0.1, result: 1.101, decimals: 3 },
      { value: 1.101, step: 0.15, result: 1.25, decimals: 2 },
      { value: 1, step: -0.0001, result: 0.9999, decimals: 5 },
    ];

    tests.forEach(t =>
      it(`should handle ${t.value} + ${t.step} sum nicely`, () => {
        props = { value: t.value, decimals: t.decimals };
        instance = shallow(<FormFieldNumber {...props} />).instance();
        let result = instance.preciseSum(t.value, t.step);
        expect(result).to.equal(t.result);
      })
    );
  });

  describe('handleChange()', () => {
    let props, instance;
    let ev = { target: { value: '1aaa' } };

    it('should update val state, stripping non-digit values', () => {
      props = { value: 0 };
      instance = shallow(<FormFieldNumber {...props} />).instance();
      instance.handleChange(ev);

      expect(instance.state.val).to.eql(1);
    });

    it('should update val state to provided value if any', () => {
      props = { value: 0 };
      instance = shallow(<FormFieldNumber {...props} />).instance();
      instance.handleChange(ev, 2);

      expect(instance.state.val).to.eql(2);
    });

    it('should clamp provided value based on min', () => {
      props = { value: 0, min: 2 };
      instance = shallow(<FormFieldNumber {...props} />).instance();
      instance.handleChange(ev, 2);

      expect(instance.state.val).to.eql(2);
    });

    it('should clamp provided value based on max', () => {
      props = { value: 0, max: -2 };
      instance = shallow(<FormFieldNumber {...props} />).instance();
      instance.handleChange(ev, 2);

      expect(instance.state.val).to.eql(-2);
    });

    it('should call onChange', done => {
      props = { value: 1, onChange: td.func('onChange'), debounce: 0 };
      instance = shallow(<FormFieldNumber {...props} />).instance();
      instance.handleChange(ev);

      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith(1);
        done();
      }, 10);
    });

    it('should validate if focused and with error', () => {
      props = { value: 0, validation: td.func('validation') };
      instance = shallow(<FormFieldNumber {...props} />).instance();
      instance.setState({ focused: true, error: 'Error' });
      instance.handleChange(ev);

      expect(props.validation).to.have.been.called;
    });
  });

  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: 0, onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldNumber {...props} />).instance();
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
        value: 0,
        min: 1,
        onChange: td.func('onChange'),
        onBlur: td.func('onBlur'),
        validation: td.func('validation'),
        debounce: 0,
      };
      instance = shallow(<FormFieldNumber {...props} />).instance();
      instance.handleBlur();
    });

    it('should call onChange if clamped value differs', (done) => {
      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith(1);
        done();
      }, 10);
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
      props = { value: 1, validation: td.func('validation') };
      instance = shallow(<FormFieldNumber {...props} />).instance();
    });

    it('should call validation prop', () => {
      instance.validate(0);
      expect(props.validation).to.have.been.calledWith(0);
    });

    it('should set error state', () => {
      td.when(props.validation(0)).thenReturn('Error');
      instance.validate(0);
      expect(instance.state.error).to.eql('Error');
    });

    it('should use state value if no arguments', () => {
      instance.validate();
      expect(props.validation).to.have.been.calledWith(1);
    });
  });
});
