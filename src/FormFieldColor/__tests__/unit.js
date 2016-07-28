/* eslint-env mocha *//* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldColor from '..';

describe('<FormFieldColor />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldColor {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

  });


  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { value: 'rgb(0,0,0)' };
      wrapper = shallow(<FormFieldColor {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        val: 'rgb(0,0,0)',
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ value: 'rgb(255,0,0)' });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        val: 'rgb(255,0,0)',
      });
    });

  });


  describe('handleChange()', () => {
    let props, instance;
    let color = 'rgb(255,0,0)';

    beforeEach(() => {
      props = {
        value: 'rgb(0,0,0)',
        debounce: 0,
        onChange: td.func('onChange'),
      };
      instance = shallow(<FormFieldColor {...props} />).instance();
    });

    it('should update val state', () => {
      instance.handleChange(color);

      expect(instance.state.val).to.eql(color);
    });

    it('should call onChange', (done) => {
      instance.handleChange(color);

      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith(color);
        done();
      }, 10);
    });

  });


  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldColor {...props} />).instance();
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
      instance = shallow(<FormFieldColor {...props} />).instance();
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

  });


});
