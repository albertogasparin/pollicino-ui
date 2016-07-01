import React from 'react';
import { storiesOf } from '@kadira/storybook';

import Icon from '..';

storiesOf('Icon', module)
  .add('examples', () => (
    <div>
      <h2>Default style</h2>
      <Icon glyph="magnify" />

      <h2>Icon with label</h2>
      <div className="w1 dark">
        <Icon className="Icon--mR" glyph="alert" /> Label
      </div>

      <h2>Icon loading</h2>
      <Icon glyph="loading" />

    </div>
  ));
