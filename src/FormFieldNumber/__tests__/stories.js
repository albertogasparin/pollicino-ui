import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldNumber, Btn } from '../..';

storiesOf('FormFieldNumber', module)

  .addWithInfo('description', '', () => (
    <FormFieldNumber className=""
      label="Label" value={7} min={5}
      onChange={action('change')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldNumber
          label="Label"
          onChange={action('change')}
        />
      </div>

      <h4>Block level label, min, max, value</h4>
      <FormFieldNumber className="FormField--block w2"
        label="Label:"
        min={5} max={10}
        value={7}
        onChange={action('change')}
      />

      <h4>Inverted colors</h4>
      <div className="w1 dark">
        <FormFieldNumber className="FormField--invert"
          label="Label"
        />
      </div>

      <h4>Invalid, custom size</h4>
      <div>
        <FormFieldNumber className="FormField--inline"
          label="Label" size="4"
          validation={(v) => v === 0 && 'Required' }
          touched
          onChange={action('change')}
        />
        &nbsp; <Btn className="Btn--primary" disabled>next</Btn>
      </div>

      <h4>No options but disabled</h4>
      <div className="w2">
        <FormFieldNumber disabled />
      </div>
    </div>
  ));
