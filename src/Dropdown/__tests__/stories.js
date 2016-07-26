import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Dropdown from '..';
import Icon from '../../Icon';

storiesOf('Dropdown', module)

  .addWithInfo('description', '', () => (
    <Dropdown className=""
      label="Label" autoClose align="left"
      onOpen={action('open')}
      onClose={action('close')}
    >
      Content
    </Dropdown>
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style with label</h4>
      <div className="left">
        <Dropdown
          label="Click here to open the dropdown"
          onOpen={action('open')}
          onClose={action('close')}
        >
          <p>Click here<br />will not close</p>
        </Dropdown>
      </div>

      <h4>Left, autoClose, no label</h4>
      <div className="w1 dark">
        <Dropdown align="left"
          autoClose opened
          onOpen={action('open')}
          onClose={action('close')}
        >
          <p>Click anywhere to close this dropdown</p>
        </Dropdown>
      </div>

      <h4>Disabled, custom label component</h4>
      <div className="w1">
        <Dropdown disabled
          label={<Icon glyph="magnify" />}
        />
      </div>

    </div>
  ));
