/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import Modal from '..';
import Btn from '../../Btn';

describe('<Modal />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = {};
      let wrapper = shallow(<Modal {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should call onClose() on button click', () => {
      let props = {
        onClose: td.func('onClose'),
      };
      let wrapper = shallow(<Modal {...props} />);
      wrapper.find(Btn).simulate('click');

      expect(props.onClose).to.have.been.called;
    });

    it('should call onClose() after action() on custom buttons click', () => {
      let props = {
        onClose: td.func('onClose'),
        buttons: [{ label: 'OK', action: td.func('action') }],
      };
      let wrapper = shallow(<Modal {...props} />);
      wrapper.find(Btn).simulate('click');

      expect(props.buttons[0].action).to.have.been.called;
      expect(props.onClose).to.have.been.called;
    });
  });
});
