import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldRange from '..';

storiesOf('FormFieldRange', module)

  .add('examples', () => (
    <div>
      <h2>Default style</h2>
      <div className="w2">
        <FormFieldRange
          label="Label" debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h2>Block level label, min, max, step, value</h2>
      <FormFieldRange className="FormField--block w2"
        label="Label:"
        min={5} max={10} step={0.5}
        value={7}
        onChange={action('change')}
      />

      <h2>Inverted colors</h2>
      <div className="w2 dark">
        <FormFieldRange className="FormField--invert"
          label="Label"
        />
      </div>

      <h2>Invalid, custom size</h2>
      <FormFieldRange size="14"
        ref={(c) => c && c.validate()}
        validation={(v) => !v && 'Please select a non-zero value'}
        min={-5} max={5} step={1}
        onChange={action('change')}
      /><br />

      <h2>No options but disabled</h2>
      <div className="w2">
        <FormFieldRange disabled />
      </div>
    </div>
  ));
