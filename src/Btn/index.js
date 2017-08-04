import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

/**
 * @class Btn
 * @augments {Component<{
     [x:string]: any
     className?: string
     loading?: boolean
     tagName?: string
     type?: string
    }, {}>}
 */
class Btn extends Component {
  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    tagName: PropTypes.any,
    type: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    tagName: 'button',
    type: 'button',
  };

  render() {
    let { tagName: TagName, className, loading, ...props } = this.props;
    return (
      <TagName
        className={'Btn ' + className + (loading ? ' isLoading' : '')}
        {...props}
      >
        {props.children}
        {loading && <Icon glyph="loading" />}
      </TagName>
    );
  }
}

export default Btn;
