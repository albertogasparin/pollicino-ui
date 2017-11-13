import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';

import { Modal } from '../..';

storiesOf('Modal', module)
  .add(
    'description',
    withInfo()(() => (
      <Modal
        className=""
        title="Title"
        message="Message"
        icon="alert"
        onClose={action('close')}
      />
    ))
  )
  .add('examples', () => (
    <div>
      <h4>Default style</h4>
      <Modal title="Title" message="Message" onClose={action('close')} />

      <h4>Custom title and buttons</h4>
      <Modal
        title={<i>Error</i>}
        icon="alert"
        headerClassName="dark"
        message={
          <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
            <li>A</li>
            <li>B</li>
          </ul>
        }
        buttons={[
          { label: 'One', action: action('One') },
          { label: 'Two', className: 'Btn--primary', action: action('Two') },
        ]}
        onClose={action('close')}
      />
    </div>
  ));
