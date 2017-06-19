import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldText } from '../..';

storiesOf('FormFieldText', module)

  .addWithInfo('description', '', () => (
    <FormFieldText className=""
      placeholder="Type..."
      onChange={action('change')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldText
          label="Label" debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Block, inverted colors, custom placeholder</h4>
      <div className="w2 dark">
        <FormFieldText className="FormField--block FormField--invert"
          label="Label:" placeholder="Type something..."
          onChange={action('change')}
        />
      </div>

      <h4>Invalid, custom size</h4>
      <div>
        <FormFieldText value=""
          ref={(c) => c && c.validate()}
          label="Label" size="14"
          validation={(v) => !v && 'Please provide a value'}
          onChange={action('change')}
        /><br />
      </div>

      <h4><br />Disabled</h4>
      <FormFieldText className="w2" value="text" disabled />
    </div>
  ));
