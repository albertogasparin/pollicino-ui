import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldText from '..';

storiesOf('FormFieldText', module)

  .add('Text', () => (
    <div>
      <h2>Default style</h2>
      <div className="w2">
        <FormFieldText
          label="Label" debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h2>Block, inverted colors, custom placeholder</h2>
      <div className="w2 dark">
        <FormFieldText className="FormField--block FormField--invert"
          label="Label:" placeholder="Type something..."
          onChange={action('change')}
        />
      </div>

      <h2>Invalid, custom size</h2>
      <div>
        <FormFieldText value=""
          ref={(c) => c && c.validate()}
          label="Label" size="14"
          validation={(v) => !v && 'Please provide a value'}
          onChange={action('change')}
        /><br />
      </div>

      <h2><br />Disabled</h2>
      <FormFieldText className="w2" value="text" disabled />
    </div>
  ));
