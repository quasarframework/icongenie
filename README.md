# icon-factory
is a cross-platform tool to create a set of favicons, webicons, pwa-icons and electron-icons as well as iOS, Windows Store and MacOS icons from an original 1240x1240 square icon that retains transparency and also minifies the assets.

It works cross-platform to even generate those pesky `.icns` and `.ico` files for some reason still needed by Electron apps and in the case of the latter prefered by some browsers, even though modern development guidelines for Apple and Windows recommend using `.png`. 

> If you use an original that is smaller than 1240x1240 some icons will be naively upscaled. You have been warned.

## How it Works
There are four things that icon-factory does with your original file. It will create a set of webicons for your project, it will minify those icons, it can make special icns (Mac) / ico (Windows) files for apps that need them and it will sort these icons into folders.

There are three general functions that are used internally to compose icon sets and if you just want to use them, feel free:
- **build** - This function creates all assets requested from the sizes object or presets object.
- **minify** - The default usage minifies all assets in the target folder in-place with `pngquant`. Compared to using `pngcrush --brute`, it is a relatively fast process. If you are not in a hurry and want the best results, consider using pngcrush instead. 
- **icns** - This will create the special MacOS (icns) and Windows icon (ico) files.

There are five composed methods that will create icons for you according to your needs:

- **kitchensink** (all icons, all platforms)
- **cordova** (all platforms)
- **electron** (all platforms)
- **pwa** (incl. chrome special icon name)
- **spa** (common icon sizes)

If you merely call `iconfactory.kitchensink('test.png', 'target-dir/')` in your code,

### Head's Up!
You may notice that very small icons (like 16x16 and 32x32) look a little strange. Achieving good results by simply downscaling to a very small size depends a great deal on your original, and it is highly recommended that you at least look at all of the icons before you publish your project to a store. While integration testing can make sure that you have an asset, judging the ability of your small icon to express the same content as a large one is highly subjective and something better left to humans. Not even hamming distance will get this right!

## Requires
- node / yarn
- Linux, MacOS or Windows

## Install
To include this lib in your project use npm or yarn:

```
$ yarn add icon-factory
```

## Module Usage
`icon-factory` was built for use in the [Quasar-Framework](https://quasar-framework.org) and as such is intended to follow some of the conventions of that project. If you prefer to output different files / settings, it is possible for you to pass these in an override object to `icon-factory` that contains all of the settings that you prefer. (See sizes.js for the structural design you will have to follow.)

iconfactory.build('./test/example-1024x1024.png', './test/output/', false)

```
let iconfactory = require('iconfactory')

These are exposed, but are actually used internally to make the icons depending on what you need them to be built for.

iconfactory._build

iconfactory._icns

iconfactory._minify(path_to_src_image, path_to_deposit_icons, )
```

If you want to pass an options object, this is the structure you will need: 

```js 
let options = {
    minify: {
        type: 'pngquant'
        options: {quality: '65-80', }
    dimensions: {
        spa: {
            all: {
                folder: 'spa',
                prefix: 'icon-',
                infix: true,
                suffix: '.png',
                sizes: [
                    64,
                    48,
                    32,
                    16
                ]
            }
        }
    }
}


```
### Minify

There are four different minification methods available:
- pngquant (fastest, lossy, 15-20% of original size)
- pngcrush (slowest, same visual quality)
- optipng ()
- pngout (Remove IDAT)
- zopfli (Slow)

```bash
$ du -sh test/output
3.9M    test/output

$ time iconfactory 
$ du -sh test/output
3.9M    test/output

$ du -sh test/output/spa
344K    test/output/spa


```

## CLI Usage
`icon-factory` can be used as a command line tool, and you can simply add it by installing it "globally" with your node package manager:
```bash
$ yarn global add icon-factory 
- or -
$ npm install --global icon-factory 
```

To find out about the settings, just use
``` 
$ iconfactory --help
```


### Resources for more information about App Icons
- [SPA Icons]()
- [PWA Icons](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA for Chrome](https://developer.chrome.com/multidevice/android/installtohomescreen)
- [MacOS App Icon](https://developer.apple.com/macos/human-interface-guidelines/icons-and-images/app-icon/)
- [iOS App Icons](https://developer.apple.com/library/content/qa/qa1686/_index.html)
- [iOS Ad Hoc Mode](https://stackoverflow.com/questions/14858266/what-is-the-difference-between-in-house-versus-ad-hoc-distribution-for-enterpris)
- [Cordova Icons](https://cordova.apache.org/docs/en/latest/config_ref/images.html)
- [Electron Icons](https://www.electron.build/icons)
- [Windows Icon Assets](https://docs.microsoft.com/en-gb/windows/uwp/design/shell/tiles-and-notifications/app-assets)
- [Windows APPX Icons](https://blogs.msdn.microsoft.com/madenwal/2015/11/24/generating-your-tileicon-image-assets-for-windows-10-uwp-using-photoshop-actions/)
- [Windows MRT Cordova Image Spec](https://github.com/apache/cordova-windows/blob/master/spec/unit/MRTImage.spec.js)

### Other nice resources
- [Material Icons](https://material.io/tools/icons/)
- [Favicon Checker](https://realfavicongenerator.net/favicon_checker)
- [Wikipedia PNG Optimizing](https://en.wikipedia.org/wiki/Portable_Network_Graphics#Optimizing_tools)
- [PNG Minification Comparison](https://css-ig.net/png-tools-overview#overview)

## Testing
clone, `yarn install`, `yarn test`

## Future Work
- [ ] Complete set of tests
- [X] Switch for Cordova / Electron / Webapps
- [X] Get all the sizes!!!
- [X] Find cross-platform alternative for MacOS .icns
- [X] Find a smaller (and safe!) alternative to graphicsmagick
- [X] Be smarter about chaining
- [X] pngquant the results
- [ ] get some svg's in there yo


## License
©2018 D.C. Thompson (nothingismagick)
MIT
