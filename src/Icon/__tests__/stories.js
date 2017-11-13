import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { Icon } from '../..';

storiesOf('Icon', module)
  .add('description', withInfo()(() => <Icon glyph="magnify" />))
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
