/* eslint-env mocha *//* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Btn from '..';

describe('<Btn />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let props = {};
      let wrapper = shallow(<Btn {...props} />);

      expect(wrapper.type()).to.equal('button');
    });

  });
});
