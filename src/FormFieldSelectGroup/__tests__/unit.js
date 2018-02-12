/* eslint-env mocha */ /* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import { FormFieldSelectGroup } from '..';

describe('<FormFieldSelectGroup />', () => {
  describe('DOM', () => {
    it('should render', () => {
      let props = { options: [] };
      let wrapper = shallow(<FormFieldSelectGroup {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be valid by default', () => {
      let props = { options: [], value: '' };
      let wrapper = shallow(<FormFieldSelectGroup {...props} />);
      expect(wrapper.hasClass('isInvalid')).to.eql(false);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(0);
    });

    it('should show error if any', () => {
      let props = { options: [], value: '' };
      let wrapper = shallow(<FormFieldSelectGroup {...props} />);
      wrapper.setProps({ error: 'Error' });
      expect(wrapper.hasClass('isInvalid')).to.eql(true);
      expect(wrapper.find('.FormField-error')).to.have.lengthOf(1);
    });

    it('should show a dropdown by default', () => {
      let props = { options: [], value: '' };
      let wrapper = shallow(<FormFieldSelectGroup {...props} />);
      expect(wrapper.find('.Dropdown--field')).to.have.lengthOf(1);
    });

    it('should show options inline if inline prop', () => {
      let props = { options: [], value: '', inline: true };
      let wrapper = shallow(<FormFieldSelectGroup {...props} />);
      expect(wrapper.find('.FormField-group')).to.have.lengthOf(1);
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    beforeEach(() => {
      props = {
        name: 'a',
        value: 'a',
        options: [],
        placeholder: 'select',
      };
      wrapper = shallow(<FormFieldSelectGroup {...props} />);
    });

    it('should set state', () => {
      expect(wrapper.state()).to.eql({
        focused: false,
        val: ['a'],
        opts: [{ label: 'select', value: '' }],
      });
    });

    it('should update state on prop change', () => {
      wrapper.setProps({
        id: 'a',
        options: [{ value: 'a' }],
        hidePlaceholder: true,
      });
      expect(wrapper.state()).to.eql({
        focused: false,
        val: ['a'],
        opts: [{ value: 'a' }],
      });
    });
  });

  describe('normalizeValue', () => {
    let props, instance;

    beforeEach(() => {
      props = { options: [] };
      instance = shallow(<FormFieldSelectGroup {...props} />).instance();
    });

    it('should return an empty array if value undefined', () => {
      expect(instance.normalizeValue()).to.eql([]);
    });

    it('should return an array if value not array', () => {
      expect(instance.normalizeValue('')).to.eql(['']);
    });

    it('should return value if value is array', () => {
      expect(instance.normalizeValue(['a'])).to.eql(['a']);
    });
  });

  describe('returnValue', () => {
    let props, instance;

    it('should return a string', () => {
      props = { options: [] };
      instance = shallow(<FormFieldSelectGroup {...props} />).instance();
      expect(instance.returnValue(['a'])).to.eql('a');
    });

    it('should return an array if multiple', () => {
      props = { multiple: true, options: [] };
      instance = shallow(<FormFieldSelectGroup {...props} />).instance();
      expect(instance.returnValue(['a', 'b'])).to.eql(['a', 'b']);
    });
  });

  describe('findOptions()', () => {
    let props, instance;

    beforeEach(() => {
      props = { options: [{ value: 'a' }, { value: 1 }, { value: 'c' }] };
      instance = shallow(<FormFieldSelectGroup {...props} />).instance();
    });

    it('should return a array with matched option', () => {
      expect(instance.findOptions(['a'])).to.eql([{ value: 'a' }]);
    });

    it('should return a array with matched options', () => {
      expect(instance.findOptions(['a', 1])).to.eql([
        { value: 'a' },
        { value: 1 },
      ]);
    });

    it('should return null if no options found', () => {
      expect(instance.findOptions(['b'])).to.eql(null);
    });
  });

  describe('handleChange()', () => {
    let props, instance;

    describe('on single', () => {
      beforeEach(() => {
        props = {
          value: null,
          options: [],
          onChange: td.func('onChange'),
        };
        instance = shallow(<FormFieldSelectGroup {...props} />).instance();
        instance.refs = { dropdown: td.object(['handleClose']) };
      });

      it('should update val state', () => {
        instance.handleChange('a');
        expect(instance.state.val).to.eql(['a']);
      });

      it('should call onChange', () => {
        instance.handleChange('a');
        expect(props.onChange).to.have.been.calledWith('a');
      });
    });

    describe('on multiple', () => {
      beforeEach(() => {
        props = {
          multiple: true,
          value: [],
          options: [],
          onChange: td.func('onChange'),
        };
        instance = shallow(<FormFieldSelectGroup {...props} />).instance();
      });

      it('should combine values and update val', () => {
        instance.setState({ val: ['a'] });
        instance.handleChange('b');
        expect(instance.state.val).to.eql(['b', 'a']);
      });

      it('should toggle value and update val', () => {
        instance.setState({ val: ['a', 'b', 'c'] });
        instance.handleChange('b');
        expect(instance.state.val).to.eql(['a', 'c']);
      });

      it('should call onChange', () => {
        instance.handleChange('a');
        expect(props.onChange).to.have.been.calledWith(['a']);
      });
    });
  });

  describe('handleFocus()', () => {
    let props, instance;

    beforeEach(() => {
      props = { options: [], onFocus: td.func('onFocus') };
      instance = shallow(<FormFieldSelectGroup {...props} />).instance();
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
        options: [],
        onBlur: td.func('onBlur'),
      };
      instance = shallow(<FormFieldSelectGroup {...props} />).instance();
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
