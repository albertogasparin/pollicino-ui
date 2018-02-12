/* eslint-env mocha */ /* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import { FormFieldText } from '..';

describe('<FormFieldText />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldText {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldText {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldText {...props} />);
      wrapper.setProps({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { name: 'a', value: 'a' };
      wrapper = shallow(<FormFieldText {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        focused: false,
        id: 'ff-text-a',
        val: 'a',
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', value: 'b' });
      expect(wrapper.state()).to.eql({
        focused: false,
        id: 'a',
        val: 'b',
      });
    });
  });

  describe('handleChange()', () => {
    let props, wrapper, instance;
    let ev = { target: { value: 'a' } };

    beforeEach(() => {
      props = {
        value: '',
        onChange: td.func('onChange'),
      };
      wrapper = shallow(<FormFieldText {...props} />);
      instance = wrapper.instance();
    });

    it('should update val state', () => {
      instance.handleChange(ev);
      expect(instance.state.val).to.eql('a');
    });

    it('should call onChange', () => {
      instance.handleChange(ev);
      expect(props.onChange).to.have.been.calledWith('a');
    });
  });

  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldText {...props} />).instance();
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
        onBlur: td.func('onBlur'),
      };
      instance = shallow(<FormFieldText {...props} />).instance();
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
