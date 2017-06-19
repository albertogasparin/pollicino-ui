import React from 'react';
import { storiesOf } from '@kadira/storybook';

import { Icon } from '../..';

storiesOf('Icon', module)

  .addWithInfo('description', '', () => (
    <Icon glyph="magnify" />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <Icon glyph="magnify" />

      <h4>Icon with label</h4>
      <div className="w1 dark">
        <Icon className="Icon--mR" glyph="alert" /> Label
      </div>

      <h4>Icon loading</h4>
      <div>
        <Icon glyph="loading" />
      </div>
      <div style={{ fontSize: '1.8rem' }}>
        <Icon glyph="loading" />
      </div>

    </div>
  ));
