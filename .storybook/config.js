import { configure, setAddon } from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';

setAddon(infoAddon);

import './client.scss';

configure(() => {
  const req = require.context('..', true, /__tests__\/stories\.js$/);
  req.keys().forEach(req);
}, module);
