import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldDate, Btn } from '../..';

storiesOf('FormFieldDate', module)
  .addWithInfo(
    'description',
    '',
    () =>
      <FormFieldDate
        className=""
        label="Label"
        isRange
        hidePlaceholder
        yearDropdown
        onChange={action('change')}
      />,
    { inline: true }
  )
  .add('examples', () =>
    <div>
      <h4>Default style (single) with options</h4>
      <div>
        <FormFieldDate
          label="Label"
          options={[
            { label: '1990', value: '1990-01-01' },
            { label: '2000', value: '2000-01-01' },
          ]}
          onChange={action('change')}
        />
      </div>

      <h4>Default style (range), block, no options/placeholder</h4>
      <FormFieldDate
        className="FormField--block"
        label="Label:"
        isRange
        hidePlaceholder
        onChange={action('change')}
      />

      <h4>Default style (single), Min/max date, year dropdown</h4>
      <FormFieldDate
        label="Label"
        yearDropdown
        minDate={new Date('1900-01-01')}
        maxDate={new Date()}
        onChange={action('change')}
      />

      <h4>Custom range value, inverted colors, truncated</h4>
      <div className="dark w1">
        <FormFieldDate
          className="FormField--invert"
          isRange
          options={[{ label: '1st Jan 2000', value: ['2000-01-01'] }]}
          value={['2000-01-01', '2000-01-05']}
        />
      </div>

      <h4>Invalid, inline</h4>
      <div>
        <FormFieldDate
          className="FormField--inline"
          label="Label"
          placeholder="Not set"
          touched
          validation={v => !v && 'Required'}
          onChange={action('change')}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>Disabled, no label, value set</h4>
      <FormFieldDate
        disabled
        options={[{ label: '1990', value: ['1990-01-01', '1991-01-01'] }]}
        value={['1990-01-01', '1991-01-01']}
      />
    </div>
  );
