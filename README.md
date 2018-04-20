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
$ yarn install git+ssh://github.com/nothingismagick/gm-webicons.git
```
## Usage
```
let webicons = require('gm-webicons')

webicons(path_to_src_image,path_to_deposit_icons)

webicons('src-1024x1024.png','./src/statics/icons/')
```

## Testing
clone, `yarn install`, `yarn test`

## Future Work
- [X] Tests
- [ ] File streams


## License
©2018 D.C. Thompson (nothingismagick)
MIT