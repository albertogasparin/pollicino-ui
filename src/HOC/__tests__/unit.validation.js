/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import { Validation } from '..';

const any = td.matchers.anything();

describe('<Validation />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { value: '', ...td.object(['onChange', 'render']) };
      td.when(props.render(any, any, any, any, any)).thenReturn(<input />);
      let wrapper = shallow(<Validation {...props} />);
      expect(wrapper.type()).to.equal('input');
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { value: '', ...td.object(['onChange', 'render', 'validation']) };
      wrapper = shallow(<Validation {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        error: null,
        focused: false,
        touched: false,
      });
    });

    it('should call render', () => {
      expect(props.render).to.have.been.calledWith(
        '',
        td.matchers.isA(Function),
        td.matchers.isA(Function),
        td.matchers.isA(Function),
        null
      );
    });

    it('should update state on prop change', () => {
      td.when(props.validation(any)).thenReturn('Error');
      wrapper.setProps({ value: 'a', touched: true });
      expect(wrapper.state()).to.eql({
        error: 'Error',
        focused: false,
        touched: true,
      });
      expect(props.validation).to.have.been.called;
    });
  });

  describe('onChange()', () => {
    it('should pass through if not touched', () => {
      let props = {
        value: '',
        ...td.object(['onChange', 'render', 'validation']),
      };
      let onChange;
      td.when(props.render(any, any, any, any, any)).thenDo((...args) => {
        onChange = args[3];
      });
      let wrapper = shallow(<Validation {...props} />);
      onChange('a');

      expect(wrapper.state()).to.eql({
        error: null,
        focused: false,
        touched: false,
      });
      expect(props.validation).not.to.have.been.called;
      expect(props.onChange).to.have.been.calledWith('a');
    });

    it('should validate if immediate', () => {
      let props = {
        value: '',
        immediate: true,
        ...td.object(['onChange', 'render', 'validation']),
      };
      let onChange;
      td.when(props.render(any, any, any, any, any)).thenDo((...args) => {
        onChange = args[3];
      });
      let wrapper = shallow(<Validation {...props} />);
      onChange('a');

      expect(wrapper.state()).to.eql({
        error: null,
        focused: false,
        touched: true,
      });
      expect(props.validation).to.have.been.calledWith('a');
      expect(props.onChange).to.have.been.calledWith('a');
    });
  });

  describe('onBlur()', () => {
    it('should validate if not immediate', () => {
      let props = {
        value: '',
        ...td.object(['onBlur', 'render', 'validation']),
      };
      let onBlur;
      td.when(props.render(any, any, any, any, any)).thenDo((...args) => {
        onBlur = args[2];
      });
      let wrapper = shallow(<Validation {...props} />);
      onBlur();

      expect(wrapper.state()).to.eql({
        error: null,
        focused: false,
        touched: true,
      });
      expect(props.validation).to.have.been.calledWith('');
      expect(props.onBlur).to.have.been.called;
    });
  });
});
