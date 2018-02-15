const path = require('path');

module.exports = {
  require: [path.join(__dirname, 'global.scss')],
  styleguideDir: '../docs',
  components: '../src/*/*.js',
  sections: [
    {
      name: 'Introduction',
      content: '../README.md',
    },
    {
      name: 'Components',
      components: '../src/!(FormField|HOC)*/*.js',
    },
    {
      name: 'FormFields',
      components: '../src/FormField*/*.js',
    },
    {
      name: 'Enhancers',
      components: '../src/HOC/!(index)*.js',
    }
  ],
  getComponentPathLine(componentPath) {
    let [, name, importName] = componentPath.match(/(\w+)\/(\w+)\.js$/) || [];
    importName = importName === 'index' ? name : `* as ${name}`;
    return (
      `JS:   import ${importName} from 'pollicino-ui/lib/${name}'\n` +
      `SCSS: @import '~pollicino-ui/lib/${name}/style'`
    );
  },
  showUsage: true,
  styles: {
    Table: {
      table: {
        tableLayout: 'fixed',
      },
    },
    Pathline: {
      pathline: {
        whiteSpace: 'pre',
      },
    },
    Playground: {
      preview: {
        padding: 0,
      },
      controls: {
        justifyContent: 'flex-end',
        transform: 'scale(0.8)',
        transformOrigin: '100% 0',
      },
      toolbar: {
        marginLeft: '10px',
      },
    },
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'Wrapper')
  }
};
