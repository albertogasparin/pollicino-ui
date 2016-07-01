import React from 'react';
import { storiesOf } from '@kadira/storybook';

import Icon from '../../Icon';
import Btn from '..';

storiesOf('Btn', module)
  .add('examples', () => (
    <div>
      <h2>Primary with tooltip</h2>
      <style>{`
        .Btn.Btn--primary[data-tip]:after {
          transform: translateX(0); max-height: none; opacity: 1;
        }`
      }</style>
      <Btn className="Btn--primary" data-tip="Tooltip">Button</Btn>

      <h2>Secondary and clipped</h2>
      <p style={{ width: 120 }}>
        <a href="#" className="Btn Btn--secondary Btn--clip">Button long text</a>
      </p>

      <h2>Outline and square</h2>
      <button className="Btn Btn--outline Btn--square">
        <Icon glyph="magnify" />
      </button>

      <h2>Disabled</h2>
      <button className="Btn Btn--primary" disabled>Button</button>

    </div>
  ));
