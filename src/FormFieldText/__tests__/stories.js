import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { FormFieldText, Btn, Icon } from '../..';

storiesOf('FormFieldText', module)
  .add(
    'description',
    withInfo()(() => (
      <FormFieldText
        className=""
        placeholder="Type..."
        onChange={action('change')}
      />
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <div className="w2">
        <FormFieldText
          label="Label"
          debounce={2000}
          onChange={action('change')}
        />
      </div>

      <h4>Block, inverted colors, custom placeholder, icon right</h4>
      <div className="w2 dark">
        <FormFieldText
          className="FormField--block FormField--invert"
          label="Label:"
          placeholder="Type something..."
          iconRight={
            <Btn className="Btn--square Btn--primary">
              <Icon glyph="magnify" />
            </Btn>
          }
          onChange={action('change')}
        />
      </div>

      <h4>Invalid, inline, custom size, icon left</h4>
      <div>
        <FormFieldText
          className="FormField--inline"
          value=""
          label="Label"
          size="14"
          iconLeft={<Icon glyph="magnify" />}
          touched
          validation={v => v.length < 3 && 'Write at least 3 chars'}
        />
        &nbsp;{' '}
        <Btn className="Btn--primary" disabled>
          next
        </Btn>
      </div>

      <h4>
        <br />Disabled
      </h4>
      <FormFieldText className="w2" value="text" disabled />
    </div>
  ));
