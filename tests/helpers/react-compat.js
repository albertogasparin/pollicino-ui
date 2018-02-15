import path from 'path';
import requireHacker from 'require-hacker';

import webpackConfig from '../../webpack.config';

/**
 * Enhance require to better support React env
 * (sadly .babelrc "ignore" does not work)
 */

const IGNORE = /\.(s?css|less|jpe?g|png|gif|svg|swf|mp[34])$/;

// Ignore non js extensions
// so `import 'style.scss'` does not throw
if (!requireHacker.occupied_file_extensions.has('ignore extensions')) {
  requireHacker.global_hook('ignore extensions', function(pathName, module) {
    if (IGNORE.test(pathName)) {
      return { source: '', path: pathName };
    }
  });
}

// Add support Webpack-like require() aliasing
// so we can eventually provide server-specific modules
requireHacker.resolver(function(pathName, module) {
  for (let alias in webpackConfig.resolve.alias) {
    if (pathName === alias || pathName.indexOf(alias + '/') === 0) {
      pathName = pathName.substring(alias.length);
      let clientPath = path.join(webpackConfig.resolve.alias[alias], pathName);
      return requireHacker.resolve(clientPath, module);
    }
  }
});
