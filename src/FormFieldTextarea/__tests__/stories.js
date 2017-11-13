import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { FormFieldTextarea, Btn } from '../..';

storiesOf('FormFieldTextarea', module)
  .add(
    'description',
    withInfo()(() => (
      <FormFieldTextarea
        className=""
        placeholder="Type..."
        onChange={action('change')}
      />
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldTextarea
          label="Label"
          debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Block, inverted colors, custom placeholder</h4>
      <div className="w2 dark">
        <FormFieldTextarea
          className="FormField--block FormField--invert"
          label="Label"
          placeholder="Type something..."
          onChange={action('change')}
        />
      </div>

      <h4>Invalid, inline, custom size</h4>
      <div>
        <FormFieldTextarea
          className="FormField--inline"
          value=""
          label="Label"
          rows="2"
          cols="14"
          touched
          validation={v => !v && 'Please provide a value'}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>Disabled</h4>
      <FormFieldTextarea className="w2" value="text" disabled />
    </div>
  ));
