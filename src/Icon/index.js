import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @class Icon
 * @augments {Component<{
     [x:string]: any
     className?: string
     glyph: string
     height?: number | string
     width?: number | string
    }, {}>}
 */
class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    glyph: PropTypes.string.isRequired,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    className: '',
    height: 24,
    width: 24,
  };

  render() {
    let { glyph, className, width, height, ...props } = this.props;
    if (glyph === 'loading') {
      return (
        <i className={'Icon Icon--loading ' + className} {...props}>
          <b />
          <b />
          <b />
        </i>
      );
    }
    require(`assets/icons/${glyph}.svg`);
    return (
      <svg
        className={'Icon Icon--' + glyph + ' ' + className}
        width={width}
        height={height}
        {...props}
      >
        <use xlinkHref={`#i-${glyph}`} />
      </svg>
    );
  }
}

export default Icon;
