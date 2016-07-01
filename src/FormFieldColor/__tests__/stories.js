import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldColor from '..';

storiesOf('FormFieldColor', module)

  .add('examples', () => (
    <div>
      <h2>Default style</h2>
      <div>
        <FormFieldColor
          label="Label"
          onChange={action('change')}
        />
      </div>

      <h2>Block level label, defaultValue, opacity</h2>
      <FormFieldColor className="FormField--block"
        label="Label:"
        defaultValue="rgba(255,100,0,0.5)"
        opacity
        onChange={action('change')}
      />

      <h2>No options but disabled</h2>
      <FormFieldColor disabled />

      <h2>Inverted colors</h2>
      <div className="dark">
        <FormFieldColor className="FormField--invert"
          label="Label"
        />
      </div>
    </div>
  ));
