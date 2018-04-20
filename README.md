# gm-webicons
Make a set of webicons with graphicsmagick.

This simple node module takes an original image and resizes it to common web icon sizes that are deposited in a target directory. It will retain transparency. You should use at least a 512x512 square image as the initial resource.

## Requires
- graphicsmagick
- node / yarn

## Install
First download and install [GraphicsMagick](http://www.graphicsmagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

```
$ brew install graphicsmagick
```

Then to install this lib use yarn:

```
$ yarn install gm-webicons
```
## Usage
```
let webicons = require('gm-webicons')
webicons('src-1024x1024.png','./src/statics/icons/')
```

## Future Work
- [X] Tests
- [ ] File streams


## License
©2018 D.C. Thompson (nothingismagick)
MIT