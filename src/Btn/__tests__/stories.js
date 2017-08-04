import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { Btn, Icon } from '../..';

storiesOf('Btn', module)
  .addWithInfo(
    'description',
    '',
    () =>
      <Btn
        className="Btn--primary"
        data-tip="Tooltip"
        onClick={action('click')}
      >
        Button
      </Btn>,
    { inline: true }
  )
  .add('examples', () =>
    <div>
      <h4>Primary with tooltip</h4>
      <style>{`
        .Btn.Btn--primary[data-tip]::after {
          transform: translate(0, -50%); max-height: none; opacity: 1;
        }`}</style>
      <div className="left w2">
        <Btn className="Btn--primary" data-tip="Tooltip">
          Button
        </Btn>
      </div>
      <small>
        <Btn className="Btn--primary" data-tip="Tooltip right" data-tip-right>
          Button 2
        </Btn>
      </small>
      <h4>Custom tagName, secondary and line</h4>
      <p className="w1">
        <Btn tagName="a" href="#" className="Btn--secondary Btn--line">
          Button long
        </Btn>
      </p>
      <h4>Outline, square</h4>
      <span style={{ color: '#E11' }}>
        <Btn className="Btn--outline Btn--square">
          <Icon glyph="magnify" />
        </Btn>
      </span>
      &nbsp;
      <Btn className="Btn--square">
        <Icon glyph="magnify" />
      </Btn>
      <h4>Loading</h4>
      <Btn className="Btn--primary" loading data-tip="Tooltip">
        Button loading
      </Btn>
      &nbsp;
      <Btn className="Btn--outline Btn--square" loading>
        <Icon glyph="magnify" />
      </Btn>
      <h4>Disabled</h4>
      <Btn className="Btn--primary" disabled>
        Button
      </Btn>
    </div>
  );
