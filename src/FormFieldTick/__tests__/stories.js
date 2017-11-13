import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { FormFieldTick } from '../..';

storiesOf('FormFieldTick', module)
  .add(
    'description',
    withInfo()(() => (
      <FormFieldTick
        className=""
        label="Label"
        value=""
        checked
        onChange={action('change')}
      />
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style, radiobox</h4>
      <div className="left w1">
        <FormFieldTick
          name="t1"
          label="Label 1"
          value="1"
          debounce={1000}
          onChange={action('change')}
        />
      </div>
      <div>
        <FormFieldTick
          name="t2"
          checked
          label="Label 2"
          value="2"
          onChange={action('change')}
        />
      </div>

      <h4>Default style, checkbox, truncated</h4>
      <div className="left w1">
        <FormFieldTick
          type="checkbox"
          name="t3"
          label="Label really really long"
          value="1"
          touched
          validation={checked => !checked && 'Please check this box'}
        />
      </div>
      <div>
        <FormFieldTick
          className="col-w1"
          type="checkbox"
          checked
          name="t4"
          label="Label really really long"
          value="2"
          onChange={action('change')}
        />
      </div>

      <h4>Inverted colors</h4>
      <div className="dark">
        <div className="left w1">
          <FormFieldTick
            className="FormField--invert"
            type="radio"
            label="Label"
            value=""
          />
        </div>
        <div className="left w1">
          <FormFieldTick
            className="FormField--invert"
            type="radio"
            label="Label"
            value=""
            checked
          />
        </div>
        <div className="left w1">
          <FormFieldTick
            className="FormField--invert"
            type="checkbox"
            label="Label"
            value=""
          />
        </div>
        <div>
          <FormFieldTick
            className="FormField--invert"
            type="checkbox"
            label="Label"
            value=""
            checked
          />
        </div>
      </div>

      <h4>Inline, disabled</h4>
      <FormFieldTick
        className="FormField--inline"
        label="Label"
        value=""
        disabled
      />
      <FormFieldTick
        className="FormField--inline"
        label="Label"
        value=""
        checked
        disabled
      />
      <FormFieldTick
        className="FormField--inline"
        label="Label"
        value=""
        type="checkbox"
        disabled
      />
      <FormFieldTick
        className="FormField--inline"
        label="Label"
        value=""
        type="checkbox"
        checked
        disabled
      />
    </div>
  ));
