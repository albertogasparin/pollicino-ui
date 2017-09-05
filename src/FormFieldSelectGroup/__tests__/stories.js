import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldSelectGroup, Btn } from '../..';

storiesOf('FormFieldSelectGroup', module)
  .addWithInfo(
    'description',
    '',
    () => (
      <FormFieldSelectGroup
        className=""
        label="Label"
        options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
        onChange={action('change')}
      />
    ),
    { inline: true }
  )
  .add('examples', () => (
    <div>
      <div className="left" style={{ width: '45%', paddingRight: '5%' }}>
        <h4>Default style with search</h4>
        <div className="w2">
          <FormFieldSelectGroup
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

        <h4>Block level label, custom placeholder, optionsPerRow</h4>
        <FormFieldSelectGroup
          className="FormField--block"
          label="Label:"
          placeholder="Any number"
          options={[{ label: 'One', value: 1 }]}
          optionsPerRow={2}
          onChange={action('change')}
        />

        <h4>Inverted colors, truncated</h4>
        <div className="w1 dark">
          <FormFieldSelectGroup
            className="FormField--invert"
            label="Label:"
            placeholder="Placeholder zero"
            options={[{ label: 'One', value: 1 }]}
          />
        </div>

        <h4>Invalid, inline, hidden placeholder</h4>
        <div>
          <FormFieldSelectGroup
            className="FormField--inline"
            label="Label"
            hidePlaceholder
            options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
            touched
            validation={v => !v && 'Required'}
          />
          &nbsp;{' '}
          <Btn className="Btn--primary" disabled>
            next
          </Btn>
        </div>

        <h4>Disabled, no label, value set and custom render</h4>
        <FormFieldSelectGroup
          disabled
          options={[{ label: 'One', value: 1 }]}
          value={1}
          valueRenderer={opt => 'Nr. ' + opt.label}
        />
      </div>

      <div className="left" style={{ width: '50%' }}>
        <h4>Inline, optionsPerRow</h4>
        <div className="w2">
          <FormFieldSelectGroup
            name="i1"
            label="Label"
            inline
            optionsPerRow={3}
            options={[
              { label: 'One', value: 1 },
              { label: 'Two', value: 2 },
              { label: 'Three', value: 3 },
              { label: 'Four', value: 4 },
            ]}
            onChange={action('change')}
          />
        </div>

        <h4>Inline, zero optionsPerRow, block label, inverted</h4>
        <div className="w2 dark">
          <FormFieldSelectGroup
            className="FormField--invert FormField--block"
            name="i2"
            label="Label:"
            placeholder="Any number"
            inline
            optionsPerRow={0}
            options={[{ label: 'One', value: 1 }]}
          />
        </div>

        <h4>Inline tabbed</h4>
        <div>
          <FormFieldSelectGroup
            name="i3"
            label="Label:"
            placeholder="Any number"
            inline="tabbed"
            options={[{ label: '1 One', value: 1 }, { label: '2', value: 2 }]}
          />
        </div>

        <h4>Inline tabbed inverted, block label, hide placeholder</h4>
        <div className="w2 dark">
          <FormFieldSelectGroup
            className="FormField--block"
            name="i4"
            label="Label:"
            hidePlaceholder
            inline="tabbed"
            options={[
              { label: 'One', value: 1 },
              { label: '2', value: 2 },
              { label: 'Three or three', value: 3 },
              { label: 'Four', value: 4 },
            ]}
          />
        </div>

        <h4>Inline, multiple, invalid, hide placeholder</h4>
        <FormFieldSelectGroup
          name="i5"
          label="Label:"
          hidePlaceholder
          inline
          multiple
          value={[1]}
          options={[
            { label: 'One', value: 1 },
            { label: 'Two has a long label that push', value: 2 },
            { label: 'Three', value: 3 },
          ]}
          touched
          validation={v => v.length < 2 && 'Please select two options'}
          onChange={action('change')}
        />
        <br />

        <h4>Inline, disabled, no label</h4>
        <FormFieldSelectGroup
          inline
          disabled
          options={[{ label: 'One', value: 1 }]}
          value={1}
        />

        <h4>Inline tabbed disabled, no label</h4>
        <FormFieldSelectGroup
          placeholder="Any number"
          inline="tabbed"
          disabled
          options={[{ label: '1 One', value: 1 }, { label: '2', value: 2 }]}
        />
        <br />
      </div>
    </div>
  ));
