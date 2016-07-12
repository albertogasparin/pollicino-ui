import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Dropdown from '..';
import Icon from '../../Icon';

storiesOf('Dropdown', module)
  .add('examples', () => (
    <div>
      <h2>Default style with label</h2>
      <div className="left">
        <Dropdown
          label="Click here to open the dropdown"
          onOpen={action('open')}
          onClose={action('close')}
        >
          <p>Click here<br />will not close</p>
        </Dropdown>
      </div>

      <h2>Left, autoClose, no label</h2>
      <div className="w1 dark">
        <Dropdown align="left"
          autoClose opened
          onOpen={action('open')}
          onClose={action('close')}
        >
          <p>Click anywhere to close this dropdown</p>
        </Dropdown>
      </div>

      <h2>Disabled, custom label component</h2>
      <div className="w1">
        <Dropdown disabled
          label={<Icon glyph="magnify" />}
        />
      </div>

    </div>
  ));
