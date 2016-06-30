# Pollicino UI



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

