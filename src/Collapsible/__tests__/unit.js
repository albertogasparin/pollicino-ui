/* eslint-env mocha *//* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import Collapsible from '..';

describe('<Collapsible />', () => {

  describe('DOM', () => {

    it('should render', () => {
      let props = { header: '' };
      let wrapper = shallow(<Collapsible {...props} />);
      expect(wrapper.type()).to.equal('div');
    });

    it('should be collapsed by default', () => {
      let props = { header: '' };
      let wrapper = shallow(<Collapsible {...props} />);
      expect(wrapper.hasClass('isCollapsed')).to.eql(true);
    });

    it('should be expanded if expanded prop set', () => {
      let props = { header: '', expanded: true };
      let wrapper = shallow(<Collapsible {...props} />);
      expect(wrapper.hasClass('isExpanded')).to.eql(true);
    });

    it('should expand on expanded prop change', () => {
      let props = { header: '' };
      let wrapper = shallow(<Collapsible {...props} />);
      wrapper.setProps({ expanded: true });
      expect(wrapper.hasClass('isExpanded')).to.eql(true);
    });

  });


  describe('handleToggle()', () => {
    let props, instance;

    beforeEach(() => {
      props = {
        header: '',
        animation: 0,
        onExpand: td.func('onExpand'),
        onCollapse: td.func('onCollapse'),
      };
      instance = shallow(<Collapsible {...props} />).instance();
    });

    describe('on collapsed', () => {

      beforeEach(() => {
        instance.setState({ isExpanded: false });
      });

      it('should toggle isExpanded', () => {
        instance.handleToggle();
        expect(instance.state.isExpanded).to.eql(true);
      });

      it('should set isAnimating', () => {
        instance.handleToggle();
        expect(instance.state.isAnimating).to.eql(true);
      });

      it('should call onExpand()', () => {
        instance.handleToggle();
        expect(props.onExpand).to.have.been.called;
      });

      it('should unset isAnimating after a delay', (done) => {
        instance.handleToggle();
        instance.refs = { collapsible: true };
        setTimeout(() => {
          expect(instance.state.isAnimating).to.eql(false);
          done();
        }, 10);
      });

    });


    describe('on expanded', () => {

      beforeEach(() => {
        instance.setState({ isExpanded: true });
      });

      it('should toggle isExpanded', () => {
        instance.handleToggle();
        expect(instance.state.isExpanded).to.eql(false);
      });

      it('should call onCollapse()', () => {
        instance.handleToggle();
        expect(props.onCollapse).to.have.been.called;
      });

    });


    describe('on force', () => {

      it('should set isExpanded true regardless', () => {
        instance.setState({ isExpanded: true });
        instance.handleToggle(null, true);
        expect(instance.state.isExpanded).to.eql(true);
      });

      it('should set isExpanded false regardless', () => {
        instance.setState({ isExpanded: false });
        instance.handleToggle(null, false);
        expect(instance.state.isExpanded).to.eql(false);
      });

    });

  });

});
