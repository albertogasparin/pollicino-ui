/* eslint-env mocha */ /* eslint-disable no-unused-vars, max-nested-callbacks */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import td from 'testdouble';

import Dropdown from '..';

describe('<Dropdown />', () => {
  describe('DOM', () => {
    let props, wrapper, instance;

    it('should render', () => {
      props = {};
      wrapper = shallow(<Dropdown {...props} />);

      expect(wrapper.type()).to.equal('div');
    });

    it('should be closed by default', () => {
      props = {};
      wrapper = shallow(<Dropdown {...props} />);

      expect(wrapper.hasClass('isOpen')).to.eql(false);
    });

    describe('on open', () => {
      beforeEach(() => {
        props = {};
        wrapper = shallow(<Dropdown {...props} />);
        wrapper.setState({ isOpen: true });
      });

      it('should have isOpen class', () => {
        expect(wrapper.hasClass('isOpen')).to.eql(true);
      });

      it('should render content', () => {
        expect(wrapper.find('.Dropdown-overlay')).to.have.lengthOf(1);
      });
    });

    describe('on mount', () => {
      it('should open if opened prop', () => {
        props = { opened: true };
        instance = shallow(<Dropdown {...props} />).instance();
        instance.handleOpen = td.func('handleOpen');
        instance.componentDidMount();
        expect(instance.handleOpen).to.have.been.called;
      });
    });
  });

  describe('Lifecycle', () => {
    let props, wrapper;

    it('should open on opened change', done => {
      props = {};
      wrapper = shallow(<Dropdown {...props} />);
      wrapper.instance().el = {};
      wrapper.setProps({ opened: true });

      setTimeout(() => {
        expect(wrapper.state()).to.eql({
          isOpen: true,
        });
        done();
      }, 30);
    });

    it('should close on opened change', done => {
      props = { opened: true };
      wrapper = shallow(<Dropdown {...props} />);
      wrapper.instance().el = {};
      wrapper.setProps({ opened: false });

      setTimeout(() => {
        expect(wrapper.state()).to.eql({
          isOpen: false,
        });
        done();
      }, 30);
    });
  });

  describe('handleOpen()', () => {
    let props, instance;

    beforeEach(() => {
      props = { onOpen: td.func('onOpen') };
      instance = shallow(<Dropdown {...props} />).instance();
      instance.handleOpen();
    });

    it('should lazily add a click ev listener on document', done => {
      setTimeout(() => {
        expect(global.document.addEventListener).to.have.been.calledWith(
          'click',
          instance.handleClickOutside
        );
        done();
      }, 50);
    });

    it('should set isOpen state', () => {
      expect(instance.state.isOpen).to.eql(true);
    });

    it('should call onOpen', () => {
      expect(props.onOpen).to.have.been.called;
    });
  });

  describe('handleClose()', () => {
    let props, instance;

    beforeEach(() => {
      props = { onClose: td.func('onClose') };
      instance = shallow(<Dropdown {...props} />).instance();
      instance.setState({ isOpen: true });
      instance.el = {};
      instance.handleClose();
    });

    it('should remove click ev listener on document', () => {
      expect(global.document.removeEventListener).to.have.been.calledWith(
        'click',
        instance.handleClickOutside
      );
    });

    it('should call onClose', () => {
      expect(props.onClose).to.have.been.called;
    });

    it('should set isOpen state after a short delay', done => {
      setTimeout(() => {
        expect(instance.state.isOpen).to.eql(false);
        done();
      }, 30);
    });
  });

  describe('handleClickOutside()', () => {
    let props, instance;

    it('should close if autoClose', () => {
      props = { autoClose: true };
      instance = shallow(<Dropdown {...props} />).instance();
      instance.handleClose = td.func('handleClose');
      instance.handleClickOutside();

      expect(instance.handleClose).to.have.been.called;
    });
  });
});
