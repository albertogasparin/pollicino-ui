import React, { PropTypes } from 'react';

const Btn = ({ className, type, ...props }) => {
  return (
    <button className={'Btn ' + className}
      type={type}
      {...props}
    >
      {props.children}
    </button>
  );
};

Btn.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
};

Btn.defaultProps = {
  className: '',
  type: 'button',
};


export default Btn;
