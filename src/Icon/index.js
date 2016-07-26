import React, { PropTypes } from 'react';

const Icon = ({ glyph, className, width, height }) => {
  if (glyph === 'loading') {
    return (
      <i className={'Icon Icon--loading ' + className}>
        <b></b><b></b><b></b>
      </i>
    );
  }

  require(`assets/icons/${glyph}.svg`);
  return (
    <svg className={'Icon Icon--' + glyph + ' ' + className}
      width={width} height={height}
    >
      <use xlinkHref={`#i-${glyph}`} />
    </svg>
  );
};

Icon.propTypes = {
  className: PropTypes.string,
  glyph: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Icon.defaultProps = {
  className: '',
  width: 24,
  height: 24,
};

export default Icon;
