import { configure } from '@kadira/storybook';

import './client.scss';

configure(() => {
  const req = require.context('..', true, /__tests__\/stories\.js$/);
  req.keys().forEach(req);
}, module);
