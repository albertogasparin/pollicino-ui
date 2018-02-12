/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import { Debounce } from '..';

const any = td.matchers.anything();

describe('<Debounce />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { value: '', ...td.object(['onChange', 'render']) };
      td.when(props.render(any, any)).thenReturn(<input />);
      let wrapper = shallow(<Debounce {...props} />);
      expect(wrapper.type()).to.equal('input');
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { value: '', ...td.object(['onChange', 'render']) };
      wrapper = shallow(<Debounce {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({ value: '' });
    });

    it('should call render', () => {
      expect(props.render).to.have.been.calledWith(
        '',
        td.matchers.isA(Function)
      );
    });

    it('should update state on prop change', () => {
      wrapper.setProps({ value: 'a' });
      expect(wrapper.state()).to.eql({ value: 'a' });
    });
  });

  describe('handleChange()', () => {
    it('should set value and call on change', () => {
      let props = { value: '', ...td.object(['onChange', 'render']) };
      let onChange;
      td.when(props.render(any, any)).thenDo((v, onC) => {
        onChange = onC;
      });
      let wrapper = shallow(<Debounce {...props} />);
      onChange('a');

      expect(wrapper.state().value).to.eql('a');
      expect(props.onChange).to.have.been.calledWith('a');
    });

    it('should set value and call on change when debounced', (done) => {
      let props = {
        value: '',
        ...td.object(['onChange', 'render']),
        debounce: 20,
      };
      let onChange;
      td.when(props.render(any, any)).thenDo((v, onC) => {
        onChange = onC;
      });
      let wrapper = shallow(<Debounce {...props} />);
      onChange('b');

      expect(wrapper.state().value).to.eql('b');
      expect(props.onChange).not.to.have.been.called;
      setTimeout(() => {
        expect(props.onChange).to.have.been.calledWith('b');
        done();
      }, 30);
    });
  });
});
