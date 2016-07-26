import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Modal from '..';
import Icon from '../../Icon';

storiesOf('Modal', module)

  .addWithInfo('description', '', () => (
    <Modal className=""
      title="Title"
      message='Message'
      onClose={action('close')}
    />
  ), { inline: true })

  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <Modal
        title="Title"
        message="Message"
        onClose={action('close')}
      />

      <h4>Custom title and buttons</h4>
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
