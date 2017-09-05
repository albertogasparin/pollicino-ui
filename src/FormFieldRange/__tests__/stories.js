import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldRange, Btn } from '../..';

storiesOf('FormFieldRange', module)
  .addWithInfo(
    'description',
    '',
    () => (
      <FormFieldRange
        className=""
        label="Label"
        value={50}
        onChange={action('change')}
      />
    ),
    { inline: true }
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldRange
          label="Label"
          debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Block level label, min, max, step, value</h4>
      <FormFieldRange
        className="FormField--block w2"
        label="Label:"
        min={5}
        max={10}
        step={0.5}
        value={7}
        onChange={action('change')}
      />

      <h4>Inverted colors</h4>
      <div className="w2 dark">
        <FormFieldRange className="FormField--invert" label="Label" />
      </div>

      <h4>Invalid, inline, custom size</h4>
      <div>
        <FormFieldRange
          className="FormField--inline"
          label="Label"
          size="14"
          min={-5}
          max={5}
          step={1}
          touched
          validation={v => !v && 'Please select a non-zero value'}
          onChange={action('change')}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>No options but disabled</h4>
      <div className="w2">
        <FormFieldRange disabled />
      </div>

      <h4>Inverted disabled</h4>
      <div className="w2 dark">
        <FormFieldRange className="FormField--invert" label="Label" disabled />
      </div>
    </div>
  ));
