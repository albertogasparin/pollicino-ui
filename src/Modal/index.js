import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Btn from '../Btn';
import Icon from '../Icon';

/**
 * @class Modal
 * @augments {Component<{
      buttons?: Array<{ label, className?, action? }>
      className?: string
      headerClassName?: string
      icon?: string
      message?
      style?: Object
      title?
      onClose?: Function
    }, {
    }>}
 */
class Modal extends Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    headerClassName: PropTypes.string,
    icon: PropTypes.string,
    message: PropTypes.node,
    style: PropTypes.object,
    title: PropTypes.node,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    buttons: [{ label: 'OK', className: 'Btn--secondary' }],
    className: '',
    headerClassName: '',
    onClose() {},
  };

  render() {
    let {
      className,
      style,
      title,
      icon,
      headerClassName,
      message,
      buttons,
      onClose,
    } = this.props;
    return (
      <div className={'Modal ' + className} style={style}>
        <div className="Modal-box">
          <header className={'Modal-header ' + headerClassName}>
            {icon && <Icon className="Icon--mR" glyph={icon} />}
            <h3 className="Modal-title">{title}</h3>
          </header>
          <div className="Modal-message">
            {typeof message === 'string'
              ? message
                  .split(/\s*\n\s*/)
                  .map((line, i) => <p key={i}>{line}</p>)
              : message}
          </div>
          <footer className="Modal-footer">
            {buttons.map((btn, i) => (
              <Btn
                key={i}
                className={'Btn--plain ' + (btn.className || '')}
                onClick={() => {
                  btn.action && btn.action();
                  onClose();
                }}
              >
                {btn.label}
              </Btn>
            ))}
          </footer>
        </div>
      </div>
    );
  }
}

export default Modal;
