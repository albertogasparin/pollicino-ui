import React from 'react';

import Btn from '../Btn';

const Modal = ({
  className = '',
  title,
  message = '',
  buttons = [{ label: 'OK', className: 'Btn--secondary' }],
  onClose = () => {},
}) => {
  return (
    <div className={'Modal ' + className}>
      <div className="Modal-box">
        <header className="Modal-header">
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

export default Modal;
