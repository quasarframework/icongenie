# PRE ALPHA ! THERE BE DRAGONS!

# quasar-icon-factory
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

If you want to pass an options object (perhaps for the fastest available minify at lowest quality), this is the structure you will need: 

```js 
let options = {
    minify: {
        available: ['pngquant']
        type: 'pngquant'
        options: {
            quality: '1-10',
            floyd: 0.1,
            speed: 10
        }
    },
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

There are five different minification methods available (because it is possible that one or the other just won't build on your system). Using totally non-scientific tests, these are the results of this command that ran on a 3,2 GHz Quad-Core Intel Xeon: 

`$ time node cli.js -p=spa -s=test/example-1240x1240.png -t=test/output -m="$minify" && du -sh test/output/spa`

It takes a source image, scales it down according to the settings and then minifies it according to the library listed and the default settings tuned to give the best results.

| Library       | Time        | Quality    | Size   |
|:-------------:|:-----------:|:----------:|:------:| 
| *no minify*   | 00.7s       | original   | 664K   |
| pngquant-bad  | 00.9s       | very lossy | 100K   |
| pngquant-good | 01.4s       | lossy      | 144K   |
| pngout        | 10.7s       | lossless   | 624K   |
| optipng       | 13.9s       | lossless   | 404K   |
| pngcrush      | 28.1s       | lossless   | 404K   |
| zopfli        | 33.2s       | lossless   | 380K   |
| zopfli.more   | 81.3s       | lossless   | 336K   |

This is why I would recommend using pngquant during development (to have a proxy image, but to use optipng when building for production.)

<div style="text-align:center">
    <img src="/test/sources/quant_opti_orig.png?raw=true" width="701" height="195" >
</div>

## .icns & .ico
These are notoriously difficult to acquire and make. For icns you usually need a mac and ico is really just a sequence of images with a special header - but there are very few tools that will let you do both cross-platform. 

This module uses the amazing [`png2icons`](https://github.com/idesis-gmbh/png2icons) module, which actually does all of the decoding and encoding on a byte-level with javascript. That is some real ninja sh*t - so go over there and give those devs a :star:. This is actually the slowest part of the `kitchensink` and the files are huge. By feeding it from the `sharp` buffer it has been sped up a little bit (and the final icns file is actually about 20% smaller!)

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

Icon Factory: v.1.0.0
     License: MIT

Icon Factory is a node utility to create a batch of icons for your app. 
Designed to work seamlessly with the Quasar Framework, but probably
useful for other build pipelines.
    
Flags:    
  -p, --preset      Choose a preset output or make your own
                    [spa|pwa|cordova|electron|kitchensink|custom]
  -s, --source      Your source image as a large square png
  -t, --target      The destination directory for the files created
  -o, --options     path to file that overrides defaults (if custom)
  -m, --minify      Minify strategy to use. 
                    [pngcrush|pngquant|optipng|pngout|zopfli]
  -v, --version     display version information
  -h, --help        display this information
  
Usage:
    
$ iconfactory -p=kitchensink -s=icon-1280x1280.png -t=./outputFolder/ -m=pngquant  

```


### Resources for more information about App Icons
- [Favicon Cheat Sheet](https://github.com/audreyr/favicon-cheat-sheet)
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
- [favicon.ico vs favicon.png](https://stackoverflow.com/questions/1344122/favicon-png-vs-favicon-ico-why-should-i-use-png-instead-of-ico)
- [Material Icons](https://material.io/tools/icons/)
- [Favicon Checker](https://realfavicongenerator.net/favicon_checker)
- [Wikipedia PNG Optimizing](https://en.wikipedia.org/wiki/Portable_Network_Graphics#Optimizing_tools)
- [PNG Minification Comparison](https://css-ig.net/png-tools-overview#overview)
- [.ico file-header Information](https://en.wikipedia.org/wiki/ICO_(file_format)#Outline)

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
