import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import FormFieldTick from '..';

storiesOf('FormFieldTick', module)

  .add('examples', () => (
    <div>
      <h2>Default style, radiobox</h2>
      <div className="left w1">
        <FormFieldTick name="t1"
          label="Label" debounce={1000}
          onChange={action('change')}
        />
      </div>
      <div>
        <FormFieldTick name="t2" checked
          label="Label"
          onChange={action('change')}
        />
      </div>

      <h2>Default style, checkbox, truncated</h2>
      <div className="left w1">
        <FormFieldTick type="checkbox" name="t3"
          label="Label really really long"
          onChange={action('change')}
        />
      </div>
      <div>
        <FormFieldTick className="col-w1" type="checkbox" checked name="t4"
          label="Label really really long"
          onChange={action('change')}
        />
      </div>

      <h2>Inverted colors</h2>
      <div className="dark">
        <div className="left w1">
          <FormFieldTick className="FormField--invert" type="radio" label="Label" />
        </div>
        <div className="left w1">
          <FormFieldTick className="FormField--invert" type="radio" label="Label" checked />
        </div>
        <div className="left w1">
          <FormFieldTick className="FormField--invert" type="checkbox" label="Label" />
        </div>
        <div>
          <FormFieldTick className="FormField--invert" type="checkbox" label="Label" checked />
        </div>
      </div>

      <h2>No options but disabled</h2>
      <div className="left w1">
        <FormFieldTick label="Label" disabled />
      </div>
      <div className="left w1">
        <FormFieldTick label="Label" checked disabled />
      </div>
      <div className="left w1">
        <FormFieldTick label="Label" type="checkbox" disabled />
      </div>
      <div className="left w1">
        <FormFieldTick label="Label" type="checkbox" checked disabled />
      </div>
    </div>
  ));
