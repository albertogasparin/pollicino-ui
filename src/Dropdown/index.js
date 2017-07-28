import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Dropdown extends Component {
  state = {
    isOpen: false,
  };

  componentDidMount() {
    if (this.props.opened) {
      this.handleOpen();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.opened !== this.props.opened) {
      if (nextProps.opened) {
        this.handleOpen();
      } else {
        this.handleClose();
      }
    }
  }

  handleClickOutside = ev => {
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
        ref={c => (this.el = c)}
      >
        {typeof label !== 'undefined' &&
          <button
            className="Dropdown-btn"
            type="button"
            disabled={disabled}
            tabIndex={tabIndex}
            onClick={this.handleOpen.bind(this)}
          >
            {label}
          </button>}

        {isOpen &&
          <div className="Dropdown-overlay" data-align={align}>
            {children}
          </div>}
      </div>
    );
  }
}

Dropdown.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  disabled: PropTypes.bool,

  align: PropTypes.oneOf(['left', 'right']),
  autoClose: PropTypes.bool,
  opened: PropTypes.bool,
  children: PropTypes.node,
  modal: PropTypes.bool,

  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

Dropdown.defaultProps = {
  className: '',
  align: 'right',
  modal: true,

  onOpen() {},
  onClose() {},
};

export default Dropdown;
