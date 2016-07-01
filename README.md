# Pollicino UI


## Usage

This UI components are meant to be used independently.

The recommended way of adding it to your project is to create a dedicated file, re-exporting all components that you need.  

```js
export { default as Btn } from 'pollicino-ui/lib/Btn';
export { default as Dropdown } from 'pollicino-ui/lib/Dropdown';
//...
```

Moreover, you will also need to include relevant scss files. So, in your main scss file, add:

``` scss
@import '~pollicino-ui/lib/Btn/style';
@import '~pollicino-ui/lib/Dropdown/style';
//...
```  



## Providing icons

Some components (Icon, FormFieldPassword, ...) require SVG icons to work. In the implementation examples I'm using some Material Design icons, but you are free to use whatever set you like.
You just need to configure Webpack to load the icons. For instance:

```js
// webpack.config.js
module.exports = {
  //...
  resolve: {
    alias: {
      // add an assets alias, and add icons your in assets/icons/*.svg
      assets: path.join(root, 'assets'),
    },
  },
  //...
  { // SVG Icons sprite loader
    test: /\.svg$/,
    loader: 'svg-sprite-loader?' + ['name=i-[name]'].join('&'),
  },
```



## Overriding styles

Colors and some over scss variables can be overridden. To do that, just define them before importing the component scss. 

``` scss
$Pollicino-color-primary: pink;
@import '~pollicino-ui/lib/Btn/style';
// now Btn--primary will be pink 
```




## Development

To start react storybook server (watching) run:
``` sh
npm run watch
```
The browser entry point is `127.0.0.1:9001`.



## Testing

Unit tests run with Mocha + Expect for both client and server:
``` sh
npm run test:unit -s
# or
npm run test:unit:watch # for TDD
```

Unit + Integration tests run with Webdriver + Selenium:
``` sh
npm run test # this will also bundle the assets first
```


Code coverage reports are also available thanks to [Nyc](https://github.com/bcoe/nyc):
``` sh
npm run coverage
```

