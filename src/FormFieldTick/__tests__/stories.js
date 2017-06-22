import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldTick } from '../..';

storiesOf('FormFieldTick', module)

  .addWithInfo('description', '', () => (
    <FormFieldTick className=""
      label="Label" value="" checked
      onChange={action('change')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style, radiobox</h4>
      <div className="left w1">
        <FormFieldTick name="t1"
          label="Label 1" value="1" debounce={1000}
          onChange={action('change')}
        />
      </div>
      <div>
        <FormFieldTick name="t2" checked
          label="Label 2" value="2"
          onChange={action('change')}
        />
      </div>

      <h4>Default style, checkbox, truncated</h4>
      <div className="left w1">
        <FormFieldTick type="checkbox" name="t3"
          label="Label really really long" value="1"
          touched
          validation={(checked) => !checked && 'Please check this box'}
        />
      </div>
      <div>
        <FormFieldTick className="col-w1" type="checkbox" checked name="t4"
          label="Label really really long" value="2"
          onChange={action('change')}
        />
      </div>

      <h4>Inverted colors</h4>
      <div className="dark">
        <div className="left w1">
          <FormFieldTick className="FormField--invert" type="radio"
            label="Label" value=""
          />
        </div>
        <div className="left w1">
          <FormFieldTick className="FormField--invert" type="radio"
            label="Label" value="" checked
          />
        </div>
        <div className="left w1">
          <FormFieldTick className="FormField--invert" type="checkbox"
            label="Label" value=""
          />
        </div>
        <div>
          <FormFieldTick className="FormField--invert" type="checkbox"
            label="Label" value="" checked
          />
        </div>
      </div>

      <h4>No options but disabled</h4>
      <div className="left w1">
        <FormFieldTick label="Label" value="" disabled />
      </div>
      <div className="left w1">
        <FormFieldTick label="Label" value="" checked disabled />
      </div>
      <div className="left w1">
        <FormFieldTick label="Label" value="" type="checkbox" disabled />
      </div>
      <div className="left w1">
        <FormFieldTick label="Label" value="" type="checkbox" checked disabled />
      </div>
    </div>
  ));
