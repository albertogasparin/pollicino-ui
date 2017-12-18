/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldTick from '..';

describe('<FormFieldTick />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldTick {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be unchecked by default', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldTick {...props} />);
      expect(wrapper.hasClass('isChecked')).to.eql(false);
    });

    it('should be checked if checked prop', () => {
      let props = { value: '', checked: true };
      let wrapper = shallow(<FormFieldTick {...props} />);
      expect(wrapper.hasClass('isChecked')).to.eql(true);
    });

    it('should be valid by default', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldTick {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldTick {...props} />);
      wrapper.setState({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { name: 'a', value: 'a', validation: td.func('validation') };
      wrapper = shallow(<FormFieldTick {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        checked: false,
        focused: false,
        error: null,
        id: 'ff-tick-a-a',
        touched: false,
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ id: 'a', checked: true });
      expect(wrapper.state()).to.eql({
        checked: true,
        focused: false,
        error: null,
        id: 'a',
        touched: false,
      });
    });

    it('should validate on prop change if touched', () => {
      wrapper.setProps({ checked: true, touched: true });
      expect(props.validation).to.have.been.calledWith(true);
    });
  });

  describe('handleChange()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: 'a', onChange: td.func('onChange'), debounce: 0 };
    });

    it('should set checked if radio and call on change', (done) => {
      props = { ...props, type: 'radio' };
      instance = shallow(<FormFieldTick {...props} />).instance();
      instance.handleChange();

      expect(instance.state.checked).to.eql(true);
      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith('a', true);
        done();
      }, 10);
    });

    it('should toggle checked if checkbox and call on change', (done) => {
      props = { ...props, type: 'checkbox', checked: true };
      instance = shallow(<FormFieldTick {...props} />).instance();
      instance.handleChange();

      expect(instance.state.checked).to.eql(false);
      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith('a', false);
        done();
      }, 10);
    });
  });

  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { value: '', onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldTick {...props} />).instance();
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
      props = { value: '', onBlur: td.func('onBlur') };
      instance = shallow(<FormFieldTick {...props} />).instance();
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
