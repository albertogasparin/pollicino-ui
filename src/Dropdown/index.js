import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Dropdown
 * @augments {Component<{
     align?: 'left' | 'right' | 'top' | 'top left' | 'top right'
     autoClose?: boolean
     className?: string
     disabled?: boolean
     label?
     modal?: boolean
     opened?: boolean
     style?: Object
     tabIndex?: number
     onClose?: Function
     onOpen?: Function
    }, any>}
 */
class Dropdown extends Component {
  static propTypes = {
    align: PropTypes.oneOf(['left', 'right', 'top', 'top left', 'top right']),
    autoClose: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    modal: PropTypes.bool,
    opened: PropTypes.bool,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    modal: true,
    onClose() {},
    onOpen() {},
  };

  state = {
    isOpen: false,
  };

  componentDidMount() {
    if (this.props.opened) {
      this.handleOpen();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.opened !== this.props.opened) {
      if (nextProps.opened) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  handleClickOutside = (ev) => {
    let isClickOutside =
      !this.el || !this.el.contains(ev.target) || this.el === ev.target;
    if (this.props.autoClose || isClickOutside) {
      this.handleClose();
    }
  };

  handleOpen = () => {
    if (this.state.isOpen) {
      return;
    }

    if (this.props.modal) {
      setTimeout(() => {
        // defer to avoid catching event that opened the dd
        document.addEventListener('click', this.handleClickOutside);
      }, 40);
    }

    this.setState({ isOpen: true });
    this.props.onOpen();
  };

  handleClose = () => {
    document.removeEventListener('click', this.handleClickOutside);

    // check if still mounted and open
    if (!this.el || !this.state.isOpen) {
      return;
    }
    this.props.onClose();

    setTimeout(() => {
      // allow content update
      if (this.el) {
        // still mounted
        this.setState({ isOpen: false });
      }
    }, 20);
  };

  render() {
    let {
      className,
      style,
      children,
      label,
      disabled,
      align,
      modal,
      tabIndex,
    } = this.props;
    let { isOpen } = this.state;
    className += isOpen ? ' isOpen' : '';
    className += disabled ? ' isDisabled' : '';
    className += modal ? ' Dropdown--modal' : '';

    return (
      <div
        className={'Dropdown ' + className}
        style={style}
        ref={(c) => (this.el = c)}
      >
        {typeof label !== 'undefined' && (
          <button
            className="Dropdown-btn"
            type="button"
            disabled={disabled}
            tabIndex={tabIndex}
            onClick={this.handleOpen.bind(this)}
          >
            {label}
          </button>
        )}

        {isOpen && (
          <div className="Dropdown-overlay" data-align={align}>
            {children}
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
