import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldPassword } from '../..';

storiesOf('FormFieldPassword', module)

  .addWithInfo('description', '', () => (
    <FormFieldPassword className=""
      label="Label" placeholder="Password"
      onChange={action('change')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldPassword
          label="Label" debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Block, inverted colors, custom placeholder</h4>
      <div className="w2 dark">
        <FormFieldPassword className="FormField--block FormField--invert"
          label="Label:" placeholder="Type your password..."
          onChange={action('change')}
        />
      </div>

      <h4>Invalid, custom size</h4>
      <FormFieldPassword value="12345"
        ref={(c) => c && c.validate()}
        label="Label" size="14"
        validation={(v) => v.length < 6 && 'Your password should be at least 6 chars long'}
        onChange={action('change')}
      /><br />

      <h4>Disabled</h4>
      <div className="w2">
        <FormFieldPassword value="password" disabled />
      </div>
    </div>
  ));
