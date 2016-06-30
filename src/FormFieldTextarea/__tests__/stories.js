import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldTextarea } from '..';

storiesOf('FormFieldTextarea', module)

  .add('examples', () => (
    <div>
      <h2>Default style</h2>
      <div className="w2">
        <FormFieldTextarea
          label="Label" debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h2>Block, inverted colors, custom placeholder</h2>
      <div className="w2 dark">
        <FormFieldTextarea className="FormField--block FormField--invert"
          label="Label" placeholder="Type something..."
          onChange={action('change')}
        />
      </div>

      <h2>Invalid, custom size</h2>
      <FormFieldTextarea value="" rows="2" cols="14"
        ref={(c) => c && c.validate()}
        validation={(v) => !v && 'Please provide a value'}
        onChange={action('change')}
      /><br />

      <h2>Disabled</h2>
      <FormFieldTextarea className="w2" value="text" disabled />
    </div>
  ));
