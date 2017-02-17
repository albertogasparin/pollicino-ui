import React, { PropTypes } from 'react';

import Btn from '../Btn';
import Icon from '../Icon';

const Modal = ({
  className,
  style,
  title,
  icon,
  headerClassName,
  message,
  buttons,
  onClose,
}) => {
  return (
    <div className={'Modal ' + className} style={style}>
      <div className="Modal-box">
        <header className={'Modal-header ' + headerClassName}>
          {icon &&
            <Icon className="Icon--mR" glyph={icon} />
          }
          <h3 className="Modal-title">
            {title}
          </h3>
        </header>
        <div className="Modal-message">
          {typeof message === 'string'
            ? message.split(/\s*\n\s*/).map((line, i) => <p key={i}>{line}</p>)
            : message
          }
        </div>
        <footer className="Modal-footer">
          {buttons.map((btn, i) => (
            <Btn key={i} className={'Btn--plain ' + (btn.className || '')}
              onClick={() => { btn.action && btn.action(); onClose(); }}
            >
              {btn.label}
            </Btn>
          ))}
        </footer>
      </div>
    </div>
  );
};


Modal.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.node,
  message: PropTypes.node,
  buttons: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func,
};

Modal.defaultProps = {
  className: '',
  headerClassName: '',
  buttons: [{ label: 'OK', className: 'Btn--secondary' }],
  onClose() {},
};

export default Modal;
