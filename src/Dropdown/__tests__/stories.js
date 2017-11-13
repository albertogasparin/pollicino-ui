import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { Icon, Dropdown } from '../..';

storiesOf('Dropdown', module)
  .add(
    'description',
    withInfo()(() => (
      <Dropdown
        className=""
        label="Label"
        autoClose
        align="left"
        onOpen={action('open')}
        onClose={action('close')}
      >
        Content
      </Dropdown>
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style with label</h4>
      <div className="left">
        <Dropdown
          label="Click here to open the dropdown"
          onOpen={action('open')}
          onClose={action('close')}
        >
          <p>
            Click here
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            will not close
          </p>
        </Dropdown>
      </div>

      <h4>Left, autoClose, no label</h4>
      <div className="w1 dark">
        <Dropdown
          align="left"
          autoClose
          opened
          onOpen={action('open')}
          onClose={action('close')}
        >
          <p>Click anywhere to close this dropdown</p>
        </Dropdown>
      </div>

      <h4>Disabled, custom label component</h4>
      <div className="w1">
        <Dropdown disabled label={<Icon glyph="magnify" />} />
      </div>
    </div>
  ));
