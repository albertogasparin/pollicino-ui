import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldPassword from '..';

storiesOf('FormFieldPassword', module)

  .add('examples', () => (
    <div>
      <h2>Default style</h2>
      <div className="w2">
        <FormFieldPassword
          label="Label" debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h2>Block, inverted colors, custom placeholder</h2>
      <div className="w2 dark">
        <FormFieldPassword className="FormField--block FormField--invert"
          label="Label:" placeholder="Type your password..."
          onChange={action('change')}
        />
      </div>

      <h2>Invalid, custom size</h2>
      <FormFieldPassword value="12345" size="14"
        ref={(c) => c && c.validate()}
        validation={(v) => v.length < 6 && 'Your password should be at least 6 chars long'}
        onChange={action('change')}
      /><br />

      <h2>Disabled</h2>
      <div className="w2">
        <FormFieldPassword value="password" disabled />
      </div>
    </div>
  ));
