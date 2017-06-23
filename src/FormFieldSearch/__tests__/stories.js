import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldSearch, Btn } from '../..';

storiesOf('FormFieldSearch', module)

  .addWithInfo('description', '', () => (
    <FormFieldSearch className=""
      placeholder="Search..."
      onChange={action('change')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldSearch
          debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Inverted colors, custom placeholder</h4>
      <div className="w2 dark" style={{ background: '#222225', color: '#FFF' }}>
        <FormFieldSearch className="FormField--invert"
          placeholder="Find anything"
          onChange={action('change')}
        />
      </div>

      <h4>Custom size, inline, disabled</h4>
      <div>
        <FormFieldSearch className="FormField--inline"
          size="12" disabled
        />
        &nbsp; <Btn className="Btn--primary" disabled>next</Btn>
      </div>

    </div>
  ));
