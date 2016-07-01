import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Modal from '..';
import Icon from '../../Icon';

storiesOf('Modal', module)
  .add('examples', () => (
    <div>
      <style>{'.Modal { position: relative; padding: 2rem 0; }'}</style>
      <h2>Default style</h2>
      <Modal
        title="Title"
        message="Message"
        onClose={action('close')}
      />

      <h2>Custom title and buttons</h2>
      <Modal
        title={<span><Icon className="Icon--mR" glyph="alert" /> Error</span>}
        message={<ul style={{ margin: 0, paddingLeft: '1.1em' }}><li>A</li><li>B</li></ul>}
        buttons={[
          { label: 'One', action: action('One') },
          { label: 'Two', className: 'Btn--primary', action: action('Two') },
        ]}
        onClose={action('close')}
      />

    </div>
  ));
