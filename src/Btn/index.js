import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

const Btn = ({ tagName: TagName, className, loading, ...props }) => {
  return (
    <TagName className={'Btn ' + className + (loading ? ' isLoading' : '')}
      {...props}
    >
      {props.children}
      {loading &&
        <Icon glyph="loading" />
      }
    </TagName>
  );
};

Btn.propTypes = {
  tagName: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
};

Btn.defaultProps = {
  tagName: 'button',
  className: '',
  type: 'button',
};


export default Btn;
