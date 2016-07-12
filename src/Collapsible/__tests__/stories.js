import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Collapsible from '..';
import Icon from '../../Icon';

storiesOf('Collapsible', module)
  .add('examples', () => (
    <div>
      <h2>Default style with label</h2>
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

      <h2>Expanded, header element</h2>
      <div className="w2 dark">
        <Collapsible
          header={<div style={{ background: '#444', padding: '1em 0' }}>Title</div>}
          expanded
          onCollapse={action('collapse')}
          onExpand={action('expand')}
        >
          <p>Content</p>
        </Collapsible>
      </div>

      <h2>Disabled</h2>
      <div className="w2">
        <Collapsible disabled
          header={<Icon glyph="magnify" />}
        >
          <p>Content</p>
        </Collapsible>
      </div>

    </div>
  ));
