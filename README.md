# Pollicino UI

[![npm](https://img.shields.io/npm/v/pollicino-ui.svg?maxAge=2592000)](https://www.npmjs.com/package/pollicino-ui)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://albertogasparin.mit-license.org)
[![CircleCI](https://circleci.com/gh/albertogasparin/pollicino-ui.svg?style=shield&circle-token=cd02d6e4de18113f185af5a4aad6597aff5583c8)](https://circleci.com/gh/albertogasparin/pollicino-ui)
[![Dependency Status](https://david-dm.org/albertogasparin/pollicino-ui.svg)](https://david-dm.org/albertogasparin/pollicino-ui)
[![devDependency Status](https://david-dm.org/albertogasparin/pollicino-ui/dev-status.svg)](https://david-dm.org/albertogasparin/pollicino-ui#info=devDependencies)

## Usage

### Install

```
npm i pollicino-ui
```

### Use

This UI components are meant to be used independently.

The recommended way of adding them to your project is to create a dedicated file, re-exporting all components that you need.  

```js
export { default as Btn } from 'pollicino-ui/lib/Btn';
export { default as Dropdown } from 'pollicino-ui/lib/Dropdown';
//...
```

Moreover, you will also need to include relevant scss styles. So, in your main scss file, add:

``` scss
@import '~pollicino-ui/lib/Btn/style';
@import '~pollicino-ui/lib/Dropdown/style';
//...
```  



### Providing icons

Some components (Icon, FormFieldPassword, ...) require SVG icons to work. In the examples, I'm using some Material Design icons, but you are free to use whatever set you like.
Just configure Webpack to alias `assets/icons` and add an svg loader like `svg-sprite-loader` to ensure `require` works:

```js
// webpack.config.js
module.exports = {
  //...
  resolve: {
    alias: {
      // add an assets alias, and add icons your in assets/icons/*.svg
      assets: path.join(__dirname, 'app', 'assets'),
    },
  },
  //...
  module: {
    rules: [
      { // SVG Icons sprite loader
        test: /\.svg$/,
        include: [path.join(__dirname, 'app', 'assets', 'icons')],
        use: [{ loader: 'svg-sprite-loader', options: { symbolId: 'i-[name]' } }],
      },
      //...
```



### Overriding styles

Colors and some other SCSS variables can be overridden. Just define them before importing the component’s styles. For a full list look at `./scss/_variables.scss`

``` scss
$Pollicino-color-primary: pink;
@import '~pollicino-ui/lib/Btn/style';
// now Btn--primary will be pink 
```
  


## Contributing

### Development

To start react storybook server (watching) run:
``` sh
npm run watch
```
The browser entry point is `127.0.0.1:9001`.



### Testing

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

