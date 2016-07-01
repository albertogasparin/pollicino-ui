import React from 'react';

import './style.scss';

const Btn = ({ className = '', type = 'button', ...props }) => {
  return (
    <button className={'Btn ' + className}
      type={type}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Btn;
