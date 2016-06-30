import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import { FormFieldSelectGroup } from '..';

storiesOf('FormFieldSelectGroup', module)

  .add('examples', () => (
    <div>
      <div className="left" style={{ width: '45%', paddingRight: '5%' }}>
        <h2>Default style with search</h2>
        <div className="w2">
          <FormFieldSelectGroup
            label="Label" withSearch
            options={[
              { label: 'One', value: 1 }, { label: 'Two', value: 2 }, { label: 'Three', value: 3 },
              { label: 'Four', value: 4 }, { label: 'Five', value: 5 }, { label: 'Six', value: 6 },
              { label: 'Seven', value: 7 }, { label: 'Eight', value: 8 }, { label: '9', value: 9 },
              { label: 'Ten', value: 10 }, { label: 'Eleven', value: 11 },
            ]}
            onChange={action('change')}
          />
        </div>

        <h2>Block level label, custom placeholder, optionsPerRow</h2>
        <FormFieldSelectGroup className="FormField--block"
          label="Label:" placeholder="Any number"
          options={[{ label: 'One', value: 1 }]}
          optionsPerRow="2"
          onChange={action('change')}
        />

        <h2>Inverted colors, truncated</h2>
        <div className="w1 dark">
          <FormFieldSelectGroup className="FormField--invert"
            label="Label:"
            placeholder="Placeholder zero"
            options={[{ label: 'One', value: 1 }]}
          />
        </div>

        <h2>Invalid, hidden placeholder</h2>
        <FormFieldSelectGroup
          ref={(c) => c && c.validate()} hidePlaceholder
          options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
          validation={(v) => !v && 'Required'}
          onChange={action('change')}
        /><br />

        <h2>Disabled, no label, value set and custom render</h2>
        <FormFieldSelectGroup disabled
          options={[{ label: 'One', value: 1 }]} value={1}
          valueRenderer={(opt) => 'Nr. ' + opt.label}
        />

      </div>

      <div className="left" style={{ width: '50%' }}>
        <h2>Inline, optionsPerRow</h2>
        <div className="w2">
          <FormFieldSelectGroup
            label="Label" inline
            optionsPerRow="3"
            options={[
              { label: 'One', value: 1 }, { label: 'Two', value: 2 }, { label: 'Three', value: 3 },
              { label: 'Four', value: 4 },
            ]}
            onChange={action('change')}
          />
        </div>

        <h2>Inline, zero optionsPerRow, block level, inverted</h2>
        <div className="w2 dark">
          <FormFieldSelectGroup className="FormField--invert FormField--block"
            label="Label:" placeholder="Any number" inline
            optionsPerRow="0"
            options={[{ label: 'One', value: 1 }]}
          />
        </div>

        <h2>Inline, multiple, invalid, hide placeholder</h2>
        <FormFieldSelectGroup
          ref={(c) => c && c.validate()}
          label="Label:" hidePlaceholder inline multiple
          value={[1]}
          options={[
            { label: 'One', value: 1 }, { label: 'Two', value: 2 }, { label: 'Three', value: 3 },
          ]}
          validation={(v) => v.length < 2 && 'Please select two options'}
          onChange={action('change')}
        /><br />

        <h2>Inline, disabled, no label</h2>
        <FormFieldSelectGroup inline disabled
          options={[{ label: 'One', value: 1 }]} value={1}
        />

      </div>
    </div>
  ));
