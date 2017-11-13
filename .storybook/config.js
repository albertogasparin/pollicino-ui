import { configure } from '@storybook/react';
import { setDefaults } from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'Pollicino UI',
  downPanelInRight: true,
});

// addon-info
setDefaults({
  inline: true,
  maxPropsIntoLine: 1,
  styles: s => ({
    ...s,
    infoBody: {
      ...s.infoBody,
      padding: 0,
      boxShadow: 'none',
      border: 'none',
      marginTop: 0,
      marginBottom: '2em',
    },
    header: {
      ...s.header,
      h2: { display: 'none' },
    },
    infoStory: { marginBottom: '2em' },
    source: {
      h1: { ...s.source.h1, fontSize: '1em', textTransform: 'uppercase' },
    },
    propTableHead: { display: 'none' },
  }),
});

import './client.scss';

configure(() => {
  const req = require.context('..', true, /__tests__\/stories\.js$/);
  req.keys().forEach(req);
}, module);
