import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldTextarea } from '../..';

storiesOf('FormFieldTextarea', module)

  .addWithInfo('description', '', () => (
    <FormFieldTextarea className=""
      placeholder="Type..."
      onChange={action('change')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldTextarea
          label="Label" debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Block, inverted colors, custom placeholder</h4>
      <div className="w2 dark">
        <FormFieldTextarea className="FormField--block FormField--invert"
          label="Label" placeholder="Type something..."
          onChange={action('change')}
        />
      </div>

      <h4>Invalid, custom size</h4>
      <FormFieldTextarea value=""
        ref={(c) => c && c.validate()}
        label="Label" rows="2" cols="14"
        validation={(v) => !v && 'Please provide a value'}
        onChange={action('change')}
      /><br />

      <h4>Disabled</h4>
      <FormFieldTextarea className="w2" value="text" disabled />
    </div>
  ));
