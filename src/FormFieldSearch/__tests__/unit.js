/* eslint-env mocha *//* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldSearch from '..';

describe('<FormFieldSearch />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldSearch {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

  });


  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { name: 'a', value: 'a', validation: td.func('validation') };
      wrapper = shallow(<FormFieldSearch {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        id: 'ff-search-a',
        val: 'a',
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', value: 'b' });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        id: 'a',
        val: 'b',
      });
    });

  });


  describe('handleChange()', () => {
    let props, instance;
    let ev = { target: { value: 'a' } };

    it('should update val state', () => {
      props = { value: '' };
      instance = shallow(<FormFieldSearch {...props} />).instance();
      instance.handleChange(ev);

      expect(instance.state.val).to.eql('a');
    });

    it('should call onChange', (done) => {
      props = { value: 'a', onChange: td.func('onChange'), debounce: 0 };
      instance = shallow(<FormFieldSearch {...props} />).instance();
      instance.handleChange(ev);

      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith('a');
        done();
      }, 10);
    });

  });


  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldSearch {...props} />).instance();
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
      instance = shallow(<FormFieldSearch {...props} />).instance();
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
