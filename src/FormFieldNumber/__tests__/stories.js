import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { FormFieldNumber, Btn } from '../..';

storiesOf('FormFieldNumber', module)
  .add(
    'description',
    withInfo()(() => (
      <FormFieldNumber
        className=""
        label="Label"
        value={7}
        min={5}
        onChange={action('change')}
      />
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldNumber label="Label" onChange={action('change')} />
      </div>

      <h4>Block level label, min, max, value</h4>
      <FormFieldNumber
        className="FormField--block w2"
        label="Label:"
        min={5}
        max={10}
        value={7}
        onChange={action('change')}
      />

      <h4>Inverted colors, custom step</h4>
      <div className="w1 dark">
        <FormFieldNumber
          className="FormField--invert"
          label="Label"
          step={0.1}
          value={1.234}
          decimals={3}
        />
      </div>

      <h4>Invalid, custom size</h4>
      <div>
        <FormFieldNumber
          className="FormField--inline"
          label="Label"
          size="4"
          validation={v => v === 0 && 'Required'}
          touched
          onChange={action('change')}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>No options but disabled</h4>
      <div className="w2">
        <FormFieldNumber disabled />
      </div>
    </div>
  ));
