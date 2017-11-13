import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { Collapsible } from '../..';

storiesOf('Collapsible', module)
  .add(
    'description',
    withInfo()(() => (
      <Collapsible
        header="Title"
        onCollapse={action('collapse')}
        onExpand={action('expand')}
      >
        Content
      </Collapsible>
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style with label</h4>
      <div className="w2">
        <Collapsible
          header="Title"
          onCollapse={action('collapse')}
          onExpand={action('expand')}
        >
          <div className="dark">
            Content<br />Content<br />Content<br />Content
          </div>
        </Collapsible>
      </div>

      <h4>Expanded, header element clickable</h4>
      <div className="w2 dark">
        <Collapsible
          header={
            <div style={{ background: '#444', padding: '1em 0' }}>Title</div>
          }
          expanded
          headerClickable
          onCollapse={action('collapse')}
          onExpand={action('expand')}
        >
          <p>Content</p>
        </Collapsible>
      </div>

      <h4>Disabled with custom icon</h4>
      <div className="w2">
        <Collapsible disabled header="Search" direction="up">
          <p>Content</p>
        </Collapsible>
      </div>
    </div>
  ));
