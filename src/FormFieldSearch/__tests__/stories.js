import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldSearch from '..';

storiesOf('FormFieldSearch', module)

  .add('Search', () => (
    <div>
      <h2>Default style</h2>
      <div className="w2">
        <FormFieldSearch
          debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h2>Inverted colors, custom placeholder</h2>
      <div className="w2 dark" style={{ background: '#222225', color: '#FFF' }}>
        <FormFieldSearch className="FormField--invert"
          placeholder="Find anything"
          onChange={action('change')}
        />
      </div>

      <h2>Custom size, disabled</h2>
      <FormFieldSearch size="12" disabled />
    </div>
  ));
