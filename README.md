<div style="text-align:center">
  <img src="iconfactory.png" />
</div>

# @quasar/icon-factory

This node module outputs a set of **SQUARE** favicons, webicons, pwa-icons and electron-icons as well as iOS, Windows Store and MacOS icons from an original 1240x1240 square icon that retains transparency and also **minifies** the assets. It will also create splash screens and two different types of svgs.

It works cross-platform to even generate those pesky `.icns` and `.ico` files for some reason still used by Electron apps and in the case of the latter prefered by some browsers and webscrapers (favicon.ico) - even though modern development guidelines for Apple and Windows recommend using `.png`. 

It has two primary interfaces (with Quasar CTX and as a standalone CLI) and although it is built for the Quasar Framework, it should work anywhere you can run node. You can even import it and use it in your own pipelines if that's your thing. It is designed to be a very useful tool that you will be glad to have lying around.

> If you use an original that is smaller than 1240x1240 some icons will be naively upscaled. If you do not use a square original, it will be cropped square from the center using the smaller dimension as width and height. You have been warned.

A final note: You should always pad your icon design with about 1% of empty space. This is because you will lose aliasing resolution when downscaling, which means at smaller sizes your round icon will seem to have a flattened top, bottom, left and right sides.

## Installation and Usage

## Requires
- node / yarn
- Linux, MacOS or Windows
- A square image in png format that is at least 1240px x 1240px (much bigger will merely slow down the conversions)
- @quasar/cli version 1.0.0-beta.4 (if building a new project) or @quasar/app v1.0.0-beta.18 or later in order to add this module as an app-extension.

### Install

```bash
$ quasar ext add @quasar/icon-factory
```

During the install phase, the extension will ask you for a path relative to the app folder where it can find your icon source file: 

```bash
? Please type a relative path to the file you want to use as your source image.
Best results with a 1240x1240 png (using transparency):  (./logo-source.png) 
```
> **Note:** 
  Please use a valid png of 1240x1240 pixels. If you choose an image that is not square or has smaller dimensions, the icon-factory will do its best, but the results will not be optimal. Transparency is recommended. PNG is required.

Then choose a minification strategy:
```bash 
? Minify strategy to be used during development: (Use arrow keys)
❯ pngquant (rate: 0.225 | quality: lossy | time: 01.4s) 
  pngout (rate: 0.94 | quality: lossless | time: 10.7s) 
  optipng (rate: 0.61 | quality: lossless | time: 13.9s) 
  pngcrush (rate: 0.61 | quality: lossless | time: 28.1s) 
  zopfli (rate: 0.57 | quality: lossless | time: 33.2s) 
```

> Note: we recommend using pngquant because it is the fastest. The times given are approximations for SPA. Other targets will take more time.

You will be asked the same questions for production. Our recommendation is to choose `optipng`. It has the best time / quality trade-off for a lossless minification.

You will also be asked for a background and a highlight color. These are used in the few cases that a background is required, as with cordova splashscreens and cordova iOS icons.

Your selections will be registered and filehashes registered to the new file `quasar.icon-factory.json` in the root folder of your project repository. If you do not change this file - or you do not replace the source image - icon-factory will do nothing.

### Triggering
The first time you start Quasar, icon-factory will create the images needed for the specific app artifacts. They will not automatically be added to git, so you will need to manage that yourself.

```bash
$ quasar dev --mode electron 
```

There is an option during the install phase to "always rebuild", which is useful for fine-tuning e.g. background colors, but if you don't remove this flag in quasar.extensions.json, the icon-factory will always run and slow down the dev buildtime.

If you change the image, the settings in `quasar.extensions.json` (like e.g. the background color) or the dev/build mode, this extension will be triggered and rebuild your assets in the appropriate place. Don't forget to check the results and commit them.

### Intermediary Folder
The icon-factory makes an intermediary folder in your project folder at `/.icon-factory` to host the images when you switch between dev and build. If you haven't changed the source icon, these will merely be copied to the right destination folders. 

### Special notes about Cordova (iOS and Android only)

If you choose to build icons for Cordova, on iOS they WILL have a colored background (because transparency is not allowed), and this is why you are asked for an RGB value during the install phase. (Android allows transparency, btw.) You can change this in the quasar.icon-factory.json, but be sure to use a valid hex code like: `#c0ff33`.
 
This colored background color will also be used for the splashscreen. If you don't provide one, black will be used. If you haven't already installed the [cordova-plugin-splashscreen](https://github.com/apache/cordova-plugin-splashscreen#readme), the process will remind you to install the plugin first and then continue to build the icons before proceeding to the actual cordova dev or build pipeline.

Splashscreens are obviously a little different depending on whether you are targetting iOS or Android. Please read this document to find out more:

- https://github.com/apache/cordova-plugin-splashscreen#readme

## How it Works
There are 5 1/2 things that icon-factory does with your original file. It will create a set of webicons for your project, it will minify those icons, it can make special icns (Mac) / ico (Windows) files for apps that need them and it will create SVG assets. Finally it will sort these icons into folders. 

Here is the description of these general functions that are used internally to compose icon sets and if you just want to use them, feel free:

- **build** - This function creates all assets requested from the sizes object or presets object.
- **minify** - The default usage minifies all assets in the target folder in-place with `pngquant`. Compared to using `pngcrush --brute`, it is a relatively fast process. If you are not in a hurry and want the best results, consider using pngcrush instead. 
- **icns** - This will create the special MacOS (icns) and Windows icon (ico) files.
- **favicon** - This will create the classical and never going out of style favicon.ico
- **svg** - With this command you can trace the outlines of your PNG to create an SVG and style it with some options.
- **svgduochrome** - This tool will help you make a posterized SVG from your PNG. Choose your colors and setting wisely.

There are five composed "recipes" that will create icons for you according to your needs as assembled by our research:

- **cordova** (all icons, splashscreens, all platforms)
- **electron** (all platforms)
- **pwa** (incl. chrome special icon name, favicon)
- **spa** (common icon sizes, favicon)
- **kitchensink** (all icons, all platforms)

### Head's Up!
You may notice that very small icons (like 16x16 and 32x32) look a little strange. Achieving good results by simply downscaling to a very small size depends a great deal on your original, and it is highly recommended that you at least look at all of the icons before you publish your project to a store. While integration testing can make sure that you have an asset, judging the ability of your small icon to express the same content as a large one is highly subjective and something better left to humans. Not even hamming distance will get this right!

## But why did you make this?
There are literally dozens of other projects out there that more or less do the same thing, why did you bother to make a new one? The answer is quite simple: Because none of them fulfill all the needs of the quasar project, and although lots of really smart people built them, we want to be able to maintain this library and grow it as quasar grows. Especially since many such image-library projects quickly grow outdated and maintainers drift away into a sea of micro-modules, we felt that it is a good property to keep "in-house".

Furthermore, we wanted to pay special attention to your security and it was obvious that other libraries aren't doing enough to protect developers.

### Minify
There are six different minification algorithms available (because it is possible that one or the other just won't build on your system or worse becomes compromised via some kind of exploit). Using totally non-scientific tests, these are the results of this command that ran one time on a 3,2 GHz Quad-Core Intel Xeon with 16 GB of ram: 

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

This is why it is recommended to use pngquant during development (to have a proxy image), but to use optipng when building for production.

<div style="text-align:center">
    <img src="./test/__tests__/sources/quant_opti_orig.png?raw=true" width="701" height="195" >
</div>

## .icns & .ico
These are notoriously difficult to acquire and make. For icns you usually need a mac and ico is really just a sequence of images with a special header - but there are very few tools that will let you do both cross-platform - and this is one case where we needed several tools. 

This module uses the amazing [`png2icons`](https://github.com/idesis-gmbh/png2icons) module, which actually does all of the decoding and encoding on a byte-level with javascript. This of course takes a bit of time, but it also works cross-platform, so please think about going over there and giving those devs a :star:. This is actually one of the slowest parts of the `kitchensink` and the files are huge. By feeding it from the `sharp` buffer it has been sped up a little bit (and the final icns file is actually about 20% smaller!)

To make the favicon.ico, it uses [`to-ico`](https://github.com/kevva/to-ico) and concats a 16x16 and a 32x32 png.

## Splash Screens for Cordova
These are constructed for your app using the background color that you specified during the install phase.  

## SVG
The `safari-pinned-tab.svg` mask is created by adding contrast (via threshold) to the original and then applying even more threshold to the SVG tracing.
 
If you are indeed of a discerning nature (and have used gradients in your icon design), there is another option available to you:svg-duochrome. It too will be created in the spa folder within the spa task, but it will be up to you to rename it to `safari-pinned-tab.svg`. Be forewarned, that gradients used in a duochrome svg have a very particular character - and you will have a very large file.

To make these SVG's as small as possible, they are compressed with SVGO. There are no scripts or remote resources included in these SVG assets.

## CLI Usage
`quasar-icon-factory` can be used as a command line tool for batch invocation, and you can simply add it by installing it "globally" with your node package manager:
```bash
$ yarn global add @quasar/app-extension-icon-factory 
- or -
$ npm install --global @quasar/app-extension-icon-factory 
```

To find out about the settings, just use
``` 
$ iconfactory --help

Quasar Icon Factory: v.1.0.0
     License: MIT

Icon Factory is a node utility to create a batch of icons for your app. 
Designed to work seamlessly with the Quasar Framework, but probably
useful for other build pipelines.
    
Flags:    
  -p, --preset      Choose a preset output or make your own
                    [minify|splash|svg|svgduochrome|favicon]
                    [spa|pwa|cordova|electron|kitchensink|custom]
  -s, --source      Your source image as a large square png
  -t, --target      The destination directory for the files created
  -o, --options     path to file that overrides defaults (if custom)
  -m, --minify      Minify strategy to use. 
                    [pngcrush|pngquant|optipng|pngout|zopfli]
  -d, --mode        Minify mode if minify preset [folder|singlefile]
  -v, --version     display version information
  -h, --help        display this information
  
Usage:
    
$ iconfactory -p=kitchensink -s=icon-1280x1280.png -t=./outputFolder -m=pngquant  
$ iconfactory -p=minify -s=icon-1240x1240.png -t=./output -m=pngquant -d=singlefile  
```

## Consuming as a library
You can use this module as a library to provide production and minification assets if you so desire. It will only work in the server context. Import and use at your discretion, but please note: this is not the primary purpose of this library and only security issues will be addressed. Please do not file feature requests for this unless you provide a PR.

## Performance
Solving compression problems takes time, and the more complex the approach the more linear time is needed. Some compression algorithms are fast, some are great. None are both. This package tries to write from the buffer only when a file is created and (mostly) avoids creating intermediary files.

## Testing
`git clone`, `yarn install`, `yarn test`

## Security
We only permit you to use .png files as the source, and there is a `magic-number` check to ensure that the file being processed is indeed a valid and proper `image/png`. Furthermore, there are neither imagemagick nor graphicsmagick dependencies and this project should build and run on all platforms supported by @quasar/cli.

## Contributing
You are totally welcome to join this project. Please file issues and make PRs! Let us know how it goes and join us at our [discord server](https://discord.gg/5TDhbDg) to talk shop. There are a number of tasks that will be marked as "help wanted" on the Issue board, so please make sure to have a look there.


### Resources for more information about App Icons
- [Favicon Cheat Sheet](https://github.com/audreyr/favicon-cheat-sheet)
- [PWA Icons](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA for Chrome](https://developer.chrome.com/multidevice/android/installtohomescreen)
- [PWA on iOS](https://www.netguru.co/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native)
- [Lighthouse Web App Audit ](https://developers.google.com/web/tools/lighthouse/)
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

## Future Work
Stage 0 - Collection
- [X] CLI interface
- [X] Switch for Cordova / Electron / Webapps
- [X] Get all the sizes!!!
- [X] Find cross-platform alternative for MacOS .icns
- [X] Find a smaller (and safe!) alternative to graphicsmagick
- [X] Be smarter about chaining
- [X] pngquant the results
- [X] get some svg's in there yo

Stage 1 - Connection
- [X] Node API interface
- [X] Webpack plugin extension
- [X] - rebuild the options and config
- [X] - map to quasar outputs
- [ ] Add debug logging (verbose, minimal, file, none)

Stage 2 - Refactoring
- [ ] Complete set of unit tests with 95% coverage target
- [ ] Audit imagemin lib and deps
- [ ] Build JSDocs on git precommit 
- [ ] Real benchmarks
- [ ] Refactor internal methods and patterns to streamline process
- [ ]  - multithreading of sharp via .clone()
- [ ]  - be even smarter about only REALLY making the icons that are needed and then writing targets from that specific buffer


## Thanks to
- [image-trace-loader](https://github.com/EmilTholin/image-trace-loader)
- the [image-min](https://github.com/imagemin) team
- @TobyMosque, @maxMatteo, @Robin, @Rob, @trendchaser4u, @bloo_df


## Licenses
- Code: MIT
- © 2018: Present Daniel Thompson-Yvetot & Razvan Stoenescu
- Original Image for iconfactory: [Public Domain](https://www.publicdomainpictures.net/pictures/180000/nahled/coffee-grinder-14658946414E8.jpg)
- Modifications: Daniel Thompson-Yvetot. CC-BY 
