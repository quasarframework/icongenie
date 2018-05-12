# icon-factory
Make a set of favicons, webicons, pwa-icons and electron-icons.

This simple node module takes an original image and resizes it to common web icon sizes that are deposited in a target directory. It will retain transparency. You should use a 1024x1024 square image as the initial resource.

It works cross-platform to even generate those pesky icns 

## Requires
- node / yarn


## Install


You'll probably also want to have X-Code installed (which is normally the case when you are publishing to the iOS or MacOS store)...

Then to install this lib use yarn:

```
$ yarn add icon-factory
```
## Usage
```
let webicons = require('gm-webicons')

let iconfactory = require('iconfactory')

iconfactory.

iconfactory.icns

iconfactory.minify(path_to_src_image, path_to_deposit_icons, )
```

## Testing
clone, `yarn install`, `yarn test

## Future Work
- [ ] Complete set of tests
- [ ] File streams
- [ ] Switch for Cordova / Electron / Webapps
- [X] Get all the sizes!!!
- [X] Find cross-platform alternative for MacOS .icns
- [X] Find a smaller (and safe!) alternative to graphicsmagick
- [X] Be smarter about chaining
- [X] pngquant the results
- [ ] get some svg's in there yo


## License
©2018 D.C. Thompson (nothingismagick)
MIT
