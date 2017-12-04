import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { FormFieldPassword, Btn } from '../..';

storiesOf('FormFieldPassword', module)
  .add(
    'description',
    withInfo()(() => (
      <FormFieldPassword
        className=""
        label="Label"
        placeholder="Password"
        onChange={action('change')}
      />
    ))
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
            v.length < 6 && 'Your password should be at least 6 chars long'
          }
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

      <h4>Read-only</h4>
      <div className="w2">
        <FormFieldPassword value="password" readOnly />
      </div>
    </div>
  ));
