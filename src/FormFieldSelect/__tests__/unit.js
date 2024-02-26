/* eslint-env mocha */ /* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import { FormFieldSelect } from '..';

describe('<FormFieldSelect />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { value: '', options: [] };
      let wrapper = shallow(<FormFieldSelect {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { value: '', options: [] };
      let wrapper = shallow(<FormFieldSelect {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { value: '', options: [] };
      let wrapper = shallow(<FormFieldSelect {...props} />);
      wrapper.setProps({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = {
        name: 'a',
        placeholder: 'select',
        value: 'a',
        options: [],
      };
      wrapper = shallow(<FormFieldSelect {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        focused: false,
        id: 'ff-select-a',
        val: 'a',
        opts: [{ label: 'select', value: '' }],
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({
        id: 'a',
        value: 'b',
        options: [{ label: 'A', value: 'a' }],
      });
      expect(wrapper.state()).to.eql({
        focused: false,
        id: 'a',
        val: 'b',
        opts: [
          { label: 'select', value: '' },
          { label: 'A', value: 'a' },
        ],
      });
    });
  });

  describe('findOption()', () => {
    let props, instance;

    beforeEach(() => {
      props = {
        options: [
          { label: 'A', value: 'a' },
          { label: '1', value: 1 },
        ],
      };
      instance = shallow(<FormFieldSelect {...props} />).instance();
    });

    it('should find by string value', () => {
      let result = instance.findOption('a');
      expect(result).to.eql({ label: 'A', value: 'a' });
    });

    it('should find by number value', () => {
      let result = instance.findOption(1);
      expect(result).to.eql({ label: '1', value: 1 });
    });

    it('should return null if not found', () => {
      let result = instance.findOption('b');
      expect(result).to.eql(null);
    });
  });

  describe('handleChange()', () => {
    let props, instance;
    let ev = { target: { selectedIndex: 1 } };

    it('should update val state', () => {
      props = { value: '', options: [{ label: 'A', value: 'a' }] };
      instance = shallow(<FormFieldSelect {...props} />).instance();
      instance.handleChange(ev);

      expect(instance.state.val).to.eql('a');
    });

    it('should call onChange', () => {
      props = {
        value: '',
        options: [{ label: 'A', value: 'a' }],
        onChange: td.func('onChange'),
      };
      instance = shallow(<FormFieldSelect {...props} />).instance();
      instance.handleChange(ev);

      expect(props.onChange).to.have.been.calledWith('a');
    });
  });

  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', options: [], onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldSelect {...props} />).instance();
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
      props = { value: '', options: [], onBlur: td.func('onBlur') };
      instance = shallow(<FormFieldSelect {...props} />).instance();
      instance.handleBlur();
    });

    it('should unset focused state', () => {
      expect(instance.state.focused).to.eql(false);
    });

    it('should call onBlur prop', () => {
      expect(props.onBlur).to.have.been.called;
    });
  });
});
