import React, { Component } from 'react';

class Dropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

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

  handleClickOutside(ev) {
    let { dropdown } = this.refs;
    if (this.props.autoClose
      || !dropdown || !dropdown.contains(ev.target) || dropdown === ev.target) {
      this.handleClose();
    }
  }

  handleOpen() {
    if (this.state.isOpen) {
      return;
    }

    document.addEventListener('click', this.handleClickOutside);
    this.setState({ isOpen: true });
    this.props.onOpen();
  }

  handleClose() {
    document.removeEventListener('click', this.handleClickOutside);

    // check if still mounted and open
    if (!this.refs.dropdown || !this.state.isOpen) {
      return;
    }
    this.props.onClose();

    setTimeout(() => { // allow content update
      let { dropdown } = this.refs;
      if (dropdown) { // still mounted
        this.setState({ isOpen: false });
      }
    }, 20);
  }

  render() {
    let { className, children, label, disabled, align } = this.props;
    let { isOpen } = this.state;
    className += isOpen ? ' isOpen' : '';
    className += disabled ? ' isDisabled' : '';

    return (
      <div className={'Dropdown ' + className} ref="dropdown">
        {label !== false &&
          <button className="Dropdown-btn"
            type="button" disabled={disabled}
            onClick={this.handleOpen.bind(this)}
          >
            {label}
          </button>
        }

        {isOpen &&
          <div className="Dropdown-overlay" data-align={align}>
            {children}
          </div>
        }
      </div>
    );
  }
}

Dropdown.defaultProps = {
  className: '',
  label: '',
  disabled: false,
  align: 'right',
  autoClose: false,
  opened: false,

  onOpen() {},
  onClose() {},
};

export default Dropdown;
