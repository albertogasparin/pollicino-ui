import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldSuggest, Btn } from '../..';

storiesOf('FormFieldSuggest', module)
  .addWithInfo(
    'description',
    '',
    () => (
      <FormFieldSuggest
        name="field"
        label="Label"
        placeholder="Select a number"
        options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
        onChange={action('change')}
      />
    ),
    { inline: true }
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldSuggest
          name="default"
          label="Label"
          options={[
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
            { label: 'Three', value: 3 },
            { label: 'Four', value: 4 },
            { label: 'Five', value: 5 },
            { label: 'Six', value: 6 },
            { label: 'Seven', value: 7 },
            { label: 'Eight', value: 8 },
            { label: '9', value: 9 },
            { label: 'Ten', value: 10 },
            { label: 'Eleven', value: 11 },
          ]}
          onChange={action('change')}
        />
      </div>

      <h4>Block level label, custom placeholder, async options</h4>
      <div className="w2">
        <FormFieldSuggest
          className="FormField--block"
          label="Label"
          placeholder="Select a user"
          valueKey="id"
          labelKey="login"
          loadOptions={v => {
            if (!v) {
              return Promise.resolve(null);
            }
            return window
              .fetch(`https://api.github.com/search/users?q=${v}`)
              .then(resp => resp.json())
              .then(json => {
                return json.items;
              });
          }}
        />
      </div>

      <h4>Invalid, inline, custom size, allowAny, labelKey, valueKey, rows</h4>
      <div>
        <FormFieldSuggest
          className="FormField--inline"
          value={{ lb: '12', vl: 12 }}
          labelKey="lb"
          valueKey="vl"
          allowAny
          rows="3.5"
          size="10"
          options={[
            { lb: 'One', vl: 1 },
            { lb: 'Two', vl: 2 },
            { lb: 'Three', vl: 3 },
            { lb: 'Four', vl: 4 },
            { lb: 'Five', vl: 5 },
            { lb: 'Six', vl: 6 },
            { lb: 'Seven', vl: 7 },
            { lb: 'Eight', vl: 8 },
            { lb: '9', vl: 9 },
            { lb: 'Ten', vl: 10 },
            { lb: 'Eleven', vl: 11 },
          ]}
          touched
          validation={o => (!o || o.vl > 10) && 'Please chose a number < 10'}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>Disabled</h4>
      <div className="w2">
        <FormFieldSuggest disabled value={{ value: '', label: 'Value' }} />
      </div>
    </div>
  ));
