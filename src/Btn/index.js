import React, { PropTypes } from 'react';

import Icon from '../Icon';

const Btn = ({ className, type, loading, ...props }) => {
  return (
    <button className={'Btn ' + className + (loading ? ' isLoading' : '')}
      type={type}
      {...props}
    >
      {props.children}
      {loading &&
        <Icon glyph="loading" />
      }
    </button>
  );
};

Btn.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
};

Btn.defaultProps = {
  className: '',
  type: 'button',
};


export default Btn;
