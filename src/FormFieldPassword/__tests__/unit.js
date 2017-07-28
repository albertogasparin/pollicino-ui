/* eslint-env mocha */ /* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import FormFieldPassword from '..';

describe('<FormFieldPassword />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { value: '' };
      let wrapper = shallow(<FormFieldPassword {...props} />);

      expect(wrapper.type()).to.be.a('function');
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = { value: 'a', validation: td.func('validation') };
      wrapper = shallow(<FormFieldPassword {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        type: 'password',
      });
    });
  });

  describe('handleTypeToggle()', () => {
    let props, instance;

    it('should unset type if currently set', () => {
      props = { value: '' };
      instance = shallow(<FormFieldPassword {...props} />).instance();
      instance.handleTypeToggle();

      expect(instance.state.type).to.eql('');
    });

    it('should restore type if currently void', () => {
      props = { value: '' };
      instance = shallow(<FormFieldPassword {...props} />).instance();
      instance.setState({ type: '' });
      instance.handleTypeToggle();

      expect(instance.state.type).to.eql('password');
    });
  });
});
