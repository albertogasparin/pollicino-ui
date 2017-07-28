/* eslint-env mocha */ /* eslint-disable no-unused-vars */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Icon from '..';

describe('<Icon />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { glyph: '' };
      let wrapper = shallow(<Icon {...props} />);

      expect(wrapper.type()).to.equal('svg');
    });

    it('should render loading icon', () => {
      let props = { glyph: 'loading' };
      let wrapper = shallow(<Icon {...props} />);

      expect(wrapper.type()).to.equal('i');
    });
  });
});
