/* eslint-env mocha */ /* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldSuggest from '..';

describe('<FormFieldSuggest />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = {};
      let wrapper = shallow(<FormFieldSuggest {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = {};
      let wrapper = shallow(<FormFieldSuggest {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = {};
      let wrapper = shallow(<FormFieldSuggest {...props} />);
      wrapper.setState({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = {
        name: 'a',
        value: { id: 1 },
        validation: td.func('validation'),
      };
      wrapper = shallow(<FormFieldSuggest {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        isLoading: false,
        input: '',
        id: 'ff-suggest-a',
        opts: [],
        val: { id: 1 },
        cache: {},
        changed: false,
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', options: [{ id: 1 }] });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        isLoading: false,
        input: '',
        id: 'a',
        opts: [{ id: 1 }],
        val: { id: 1 },
        cache: {},
        changed: false,
      });
    });

    it('should reset input state on value change', () => {
      wrapper.setState({ input: 'asd' });
      wrapper.setProps({ id: 'a', value: { id: 2 }, options: [{ id: 1 }] });
      expect(wrapper.state()).to.eql({
        touched: false,
        focused: false,
        error: null,
        isLoading: false,
        input: '',
        id: 'a',
        opts: [{ id: 1 }],
        val: { id: 2 },
        cache: {},
        changed: false,
      });
    });

    it('should validate on prop change if touched', () => {
      wrapper.setProps({ value: 'b', touched: true });
      expect(props.validation).to.have.been.calledWith('b');
    });
  });

  describe('getAsyncOptions', () => {
    let props, instance;

    beforeEach(() => {
      props = { debounceLoad: 0, loadOptions: td.func('loadOptions') };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.controlEl = {};
      instance.setState({ input: 'a', isLoading: true });
    });

    describe('on success', () => {
      beforeEach(() => {
        td.when(props.loadOptions('a')).thenResolve([{ id: 'a' }]);
        instance.getAsyncOptions('a');
      });

      it('should unset loading if input has not changed', done => {
        setTimeout(() => {
          expect(instance.state.isLoading).to.eql(false);
          done();
        }, 20);
      });

      it('should not change loading if input has changed', done => {
        instance.state.input = 'b';
        setTimeout(() => {
          expect(instance.state.isLoading).to.eql(true);
          done();
        }, 20);
      });

      it('should set cache key', done => {
        setTimeout(() => {
          expect(instance.state.cache).to.eql({
            a: [{ id: 'a' }],
          });
          done();
        }, 20);
      });
    });

    describe('on error', () => {
      it('should unset loading if input has not changed', done => {
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
      props = {
        value: null,
        onBlur: td.func('onBlur'),
        validation: td.func('validation'),
      };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.handleSelect({ id: 1 });
    });

    it('should update val state', () => {
      expect(instance.state.val).to.eql({ id: 1 });
    });

    it('should update changed state', () => {
      expect(instance.state.changed).to.eql(true);
    });
  });

  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { onFocus: td.func('onFocus') };
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

    beforeEach(done => {
      props = {
        debounce: 0,
        onChange: td.func('onChange'),
        onBlur: td.func('onBlur'),
        validation: td.func('validation'),
      };
      instance = shallow(<FormFieldSuggest {...props} />).instance();
      instance.controlEl = {};
      instance.handleFocus();
      instance.handleSelect(null);
      instance.handleBlur({ persist() {} });
      setTimeout(done, 320); // some calls are async
    });

    it('should unset state props', () => {
      expect(instance.state.focused).to.eql(false);
      expect(instance.state.touched).to.eql(true);
      expect(instance.state.changed).to.eql(false);
    });

    it('should call onBlur prop', () => {
      expect(props.onBlur).to.have.been.called;
    });

    it('should validate value', () => {
      expect(props.validation).to.have.been.called;
    });

    it('should call onChange', () => {
      expect(props.onChange).to.have.been.calledWith(null);
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
      expect(instance.state.error).to.eql('Error');
    });

    it('should use state value if no arguments', () => {
      instance.validate();
      expect(props.validation).to.have.been.calledWith(null);
    });
  });
});
