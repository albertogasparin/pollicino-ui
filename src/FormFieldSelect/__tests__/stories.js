import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { FormFieldSelect, Btn } from '../..';

storiesOf('FormFieldSelect', module)
  .add(
    'description',
    withInfo()(() => (
      <FormFieldSelect
        className=""
        label="Label"
        placeholder="Select"
        options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
        onChange={action('change')}
      />
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldSelect
          label="Label"
          options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
          onChange={action('change')}
        />
      </div>

      <h4>Inverted colors, custom placeholder, truncated</h4>
      <div className="w1 dark">
        <FormFieldSelect
          className="FormField--invert"
          placeholder="Zero means any value"
          options={[{ label: 'One', value: 1 }]}
        />
      </div>

      <h4>Invalid, inline</h4>
      <div>
        <FormFieldSelect
          className="FormField--inline"
          label="Label"
          options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
          touched
          validation={v => !v && 'Please select an option'}
          onChange={action('change')}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>No options but disabled</h4>
      <FormFieldSelect className="w2" options={[]} disabled />
    </div>
  ));
