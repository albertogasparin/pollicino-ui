import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldDate from '..';

storiesOf('FormFieldDate', module)

  .add('examples', () => (
    <div>
      <h2>Default style (single) with options</h2>
      <div>
        <FormFieldDate
          label="Label"
          options={[{ label: '1990', value: '1990-01-01' }, { label: '2000', value: '2000-01-01' }]}
          onChange={action('change')}
        />
      </div>

      <h2>Default style (range), block, no options/placeholder</h2>
      <FormFieldDate className="FormField--block"
        label="Label:" isRange hidePlaceholder
        onChange={action('change')}
      />

      <h2>Default style (single), Min/max date, year dropdown</h2>
      <FormFieldDate
        label="Label" yearDropdown minDate={new Date('1900-01-01')} maxDate={new Date()}
        onChange={action('change')}
      />

      <h2>Custom range value, inverted colors, truncated</h2>
      <div className="dark w1">
        <FormFieldDate className="FormField--invert" isRange
          options={[{ label: '1st Jan 2000', value: ['2000-01-01'] }]}
          value={['2000-01-01','2000-01-05']}
        />
      </div>

      <h2>Invalid</h2>
      <FormFieldDate ref={(c) => c && c.validate()}
        label="Label"
        placeholder="Not set"
        validation={(v) => !v && 'Required' }
        onChange={action('change')}
      /><br />

      <h2>Disabled, no label, value set</h2>
      <FormFieldDate disabled
        options={[{ label: '1990', value: ['1990-01-01', '1991-01-01'] }]}
        value={['1990-01-01','1991-01-01']}
      />

    </div>
  ));
