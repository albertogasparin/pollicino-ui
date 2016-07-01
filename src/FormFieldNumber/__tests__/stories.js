import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldNumber from '..';

storiesOf('FormFieldNumber', module)

  .add('examples', () => (
    <div>
      <h2>Default style</h2>
      <div className="w2">
        <FormFieldNumber
          label="Label"
          onChange={action('change')}
        />
      </div>

      <h2>Block level label, min, max, value</h2>
      <FormFieldNumber className="FormField--block w2"
        label="Label:"
        min={5} max={10}
        value={7}
        onChange={action('change')}
      />

      <h2>Inverted colors</h2>
      <div className="w1 dark">
        <FormFieldNumber className="FormField--invert"
          label="Label"
        />
      </div>

      <h2>Invalid, custom size</h2>
      <FormFieldNumber size="4"
        ref={(c) => c && c.validate()}
        validation={(v) => v === 0 && 'Required' }
        onChange={action('change')}
      /><br />

      <h2>No options but disabled</h2>
      <div className="w2">
        <FormFieldNumber disabled />
      </div>
    </div>
  ));
