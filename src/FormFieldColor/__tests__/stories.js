import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldColor, Btn } from '../..';

storiesOf('FormFieldColor', module)

  .addWithInfo('description', '', () => (
    <FormFieldColor className=""
      label="Label" opacity align="left"
      onChange={action('change')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div>
        <FormFieldColor
          label="Label"
          onChange={action('change')}
        />
      </div>

      <h4>Block level label, defaultValue, opacity</h4>
      <FormFieldColor className="FormField--block"
        label="Label:"
        defaultValue="rgba(255,100,0,0.5)"
        opacity
        onChange={action('change')}
      />

      <h4>Inverted colors</h4>
      <div className="dark">
        <FormFieldColor className="FormField--invert"
          label="Label"
        />
      </div>

      <h4>Inline</h4>
      <div>
        <FormFieldColor className="FormField--inline"
          label="Label"
          onChange={action('change')}
        />
        &nbsp; <Btn className="Btn--primary" disabled>next</Btn>
      </div>

      <h4>No options but disabled</h4>
      <FormFieldColor disabled />
    </div>
  ));
