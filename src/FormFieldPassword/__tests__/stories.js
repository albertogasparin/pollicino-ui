import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldPassword, Btn } from '../..';

storiesOf('FormFieldPassword', module)
  .addWithInfo(
    'description',
    '',
    () => (
      <FormFieldPassword
        className=""
        label="Label"
        placeholder="Password"
        onChange={action('change')}
      />
    ),
    { inline: true }
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldPassword
          label="Label"
          debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Block, inverted colors, custom placeholder</h4>
      <div className="w2 dark">
        <FormFieldPassword
          className="FormField--block FormField--invert"
          label="Label:"
          placeholder="Type your password..."
          onChange={action('change')}
        />
      </div>

      <h4>Invalid, inline, custom size</h4>
      <div>
        <FormFieldPassword
          className="FormField--inline"
          value="12345"
          label="Label"
          size="14"
          touched
          validation={v =>
            v.length < 6 && 'Your password should be at least 6 chars long'}
          onChange={action('change')}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>Disabled</h4>
      <div className="w2">
        <FormFieldPassword value="password" disabled />
      </div>
    </div>
  ));
