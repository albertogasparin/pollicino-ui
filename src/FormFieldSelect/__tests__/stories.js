import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldSelect from '..';

storiesOf('FormFieldSelect', module)

  .add('examples', () => (
    <div>
      <h2>Default style</h2>
      <div className="w2">
        <FormFieldSelect
          label="Label"
          options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
          onChange={action('change')}
        />
      </div>

      <h2>Inverted colors, custom placeholder, truncated</h2>
      <div className="w1 dark">
        <FormFieldSelect className="FormField--invert"
          placeholder="Zero means any value"
          options={[{ label: 'One', value: 1 }]}
        />
      </div>

      <h2>Invalid</h2>
      <FormFieldSelect
        ref={(c) => c && c.validate()}
        label="Label"
        options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
        validation={(v) => !v && 'Please select an option'}
        onChange={action('change')}
      /><br />

      <h2>No options but disabled</h2>
      <FormFieldSelect className="w2" disabled />
    </div>
  ));
