import React from 'react';

import './style.scss';

const Icon = ({ glyph, className = '', width = 24, height = 24 }) => {
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

export {
  Icon,
};
