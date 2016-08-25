/* eslint-env mocha *//* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldSuggest from '..';

describe('<FormFieldSuggest />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldSuggest {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldSuggest {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show errors if any', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldSuggest {...props} />);
      wrapper.setState({ errors: 'Errors' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });

  });


  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { name: 'a', value: { id: 1 }, validation: td.func('validation') };
      wrapper = shallow(<FormFieldSuggest {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        errors: null,
        isLoading: false,
        input: '',
        id: 'ff-suggest-a',
        opts: [],
        val: { id: 1 },
        cache: {},
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', options: [{ id: 1 }] });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        errors: null,
        isLoading: false,
        input: '',
        id: 'a',
        opts: [{ id: 1 }],
        val: { id: 1 },
        cache: {},
      });
    });

    it('should reset input state on value change', () => {
      wrapper.setState({ input: 'asd' });
      wrapper.setProps({ id: 'a', value: { id: 2 }, options: [{ id: 1 }] });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        errors: null,
        isLoading: false,
        input: '',
        id: 'a',
        opts: [{ id: 1 }],
        val: { id: 2 },
        cache: {},
      });
    });

    it('should validate on prop change if touched', () => {
      wrapper.setState({ touched: true });
      wrapper.setProps({ value: 'b' });
      expect(props.validation).to.have.been.calledWith('b');
    });

  });


  describe('getAsyncOptions', () => {
    let props, instance;

    beforeEach(() => {
      props = { debounceLoad: 0, loadOptions: td.func('loadOptions') };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.setState({ input: 'a', isLoading: true });
    });

    describe('on success', () => {

      beforeEach(() => {
        td.when(props.loadOptions('a')).thenResolve([{ id: 'a' }]);
        instance.getAsyncOptions('a');
      });

      it('should unset loading if input has not changed', (done) => {
        setTimeout(() => {
          expect(instance.state.isLoading).to.eql(false);
          done();
        }, 20);
      });

      it('should not change loading if input has changed', (done) => {
        instance.state.input = 'b';
        setTimeout(() => {
          expect(instance.state.isLoading).to.eql(true);
          done();
        }, 20);
      });

      it('should set cache key', (done) => {
        setTimeout(() => {
          expect(instance.state.cache).to.eql({
            a: [{ id: 'a' }],
          });
          done();
        }, 20);
      });

    });

    describe('on error', () => {
      it('should unset loading if input has not changed', (done) => {
        td.when(props.loadOptions('a')).thenReject();
        instance.getAsyncOptions('a');
        setTimeout(() => {
          expect(instance.state.isLoading).to.eql(false);
          done();
        }, 20);
      });
    });

  });


  describe('handleInputChange()', () => {
    let props, instance;
    let ev = { target: { value: '3' } };

    it('should update input state', () => {
      props = { value: { id: 1 } };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.handleInputChange(ev);

      expect(instance.state.input).to.eql('3');
    });

    it('should set loading if async options', () => {
      props = { loadOptions: td.func('loadOptions') };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.getAsyncOptions = td.func('getAsyncOptions');
      instance.handleInputChange(ev);

      expect(instance.state.isLoading).to.eql(true);
    });

    it('should call loadOptions if async options', () => {
      props = { loadOptions: td.func('loadOptions') };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.getAsyncOptions = td.func('getAsyncOptions');
      instance.handleInputChange(ev);

      expect(instance.getAsyncOptions).to.have.been.called;
    });

  });


  describe('handleSelect()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: null, onBlur: td.func('onBlur'), validation: td.func('validation') };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.handleSelect({ id: 1 });
    });

    it('should update val state', () => {
      expect(instance.state.val).to.eql({ id: 1 });
    });

    it('should call onBlur', () => {
      expect(props.onBlur).to.have.been.called;
    });

  });


  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
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

    beforeEach((done) => {
      props = {
        value: null,
        debounce: 0,
        onChange: td.func('onChange'),
        onBlur: td.func('onBlur'),
        validation: td.func('validation'),
      };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.handleFocus();
      instance.handleBlur();
      setTimeout(done, 120); // some calls are async
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

    it('should call onChange', (done) => {
      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith(null);
        done();
      }, 10);
    });

  });


  describe('validate()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: null, validation: td.func('validation') };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
    });

    it('should call validation prop', () => {
      instance.validate({ id: 1 });
      expect(props.validation).to.have.been.calledWith({ id: 1 });
    });

    it('should set error state', () => {
      td.when(props.validation({ id: 1 })).thenReturn('Error');
      instance.validate({ id: 1 });
      expect(instance.state.errors).to.eql('Error');
    });

    it('should use state value if no arguments', () => {
      instance.validate();
      expect(props.validation).to.have.been.calledWith(null);
    });

  });


});
