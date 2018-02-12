/* eslint-env mocha */ /* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import { FormFieldRange } from '..';

describe('<FormFieldRange />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = {};
      let wrapper = shallow(<FormFieldRange {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { value: 0 };
      let wrapper = shallow(<FormFieldRange {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { value: 0 };
      let wrapper = shallow(<FormFieldRange {...props} />);
      wrapper.setProps({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { name: 'a', value: 0 };
      wrapper = shallow(<FormFieldRange {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        focused: false,
        id: 'ff-range-a',
        val: 0,
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', value: 1 });
      expect(wrapper.state()).to.eql({
        focused: false,
        id: 'a',
        val: 1,
      });
    });
  });

  describe('handleChange()', () => {
    let props, instance;
    let ev = { target: { value: '1' } };

    it('should update val state', () => {
      props = { value: 0 };
      instance = shallow(<FormFieldRange {...props} />).instance();
      instance.handleChange(ev);

      expect(instance.state.val).to.eql(1);
    });

    it('should call onChange', () => {
      props = { value: 0, onChange: td.func('onChange') };
      instance = shallow(<FormFieldRange {...props} />).instance();
      instance.handleChange(ev);
      expect(props.onChange).to.have.been.calledWith(1);
    });
  });

  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: 0, onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldRange {...props} />).instance();
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
        onBlur: td.func('onBlur'),
      };
      instance = shallow(<FormFieldRange {...props} />).instance();
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
