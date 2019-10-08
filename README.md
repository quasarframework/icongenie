![official icon](https://img.shields.io/badge/Quasar%201.0-Official%20UI%20App%20Extension-blue.svg)
![npm (scoped)](https://img.shields.io/npm/v/@quasar/quasar-app-extension-icon-genie.svg)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/quasarframework/app-extension-icon-genie.svg)]()
[![GitHub repo size in bytes](https://img.shields.io/github/repo-size/quasarframework/app-extension-icon-genie.svg)]()
[![npm](https://img.shields.io/npm/dt/@quasar/quasar-app-extension-icon-genie.svg)](https://www.npmjs.com/package/@quasar/quasar-app-extension-icon-genie)

 <img src="iconfactory.png" />

# @quasar/icon-genie

This node module outputs a set of **SQUARE** favicons, webicons, pwa-icons and electron-icons as well as iOS, Windows Store and MacOS icons from an original 1240x1240 square icon that retains transparency and also **minifies** the assets. It will also create splash screens for Cordova/Capacitor and even a minified svg.

It works cross-platform to generate those pesky `.icns` and `.ico` files used by Electron apps and in the case of the latter preferred by some browsers and webscrapers (favicon.ico) - even though modern development guidelines for Apple and Windows recommend using `.png`.

It has two primary interfaces (with Quasar CTX and as a standalone CLI) and although it is built for the Quasar Framework, it should work anywhere you can run node. You can even import it and use it in your own pipelines if that's your thing. It is designed to be a very useful tool that you will be glad to have lying around.

> You **MUST** use PNG. If you use a source image that is smaller than 1240x1240 some icons will be naively upscaled. If you do not use a square original, it will be cropped square from the center using the smaller dimension as width and height - but will never upscale - which can potentially result in non-square results. You have been warned.

A final note: You should always pad your icon design with about 1% of empty space. This is because you will lose aliasing resolution when downscaling, which means at smaller sizes your round icon (if it doesn't have padding) will seem to have flattened top, bottom, left and right sides.

## Installation and Usage

### Requires
- node / yarn
- Linux, MacOS or Windows
- A square image in png format that is at least 1240px x 1240px (much bigger will merely slow down the conversions)
- @quasar/cli version 1.0.0 or later (if building a new project) or @quasar/app v1.0.0 or later in order to add this module as an app-extension.


### Install as an App Extension (Quasar v1.0+)

```bash
$ quasar ext add @quasar/icon-genie
```

> **NOTE** If you have previously used @quasar/icon-factory, it is recommended to switch over to @quasar/icon-genie, as it will continue to be maintained, and gain extra features in the future. @quasar/icon-factory _should_ continue to work as it currently does, but isn't maintained. Simply remove @quasar/icon-factory before adding @quasar/icon-genie:

```bash
$ quasar ext remove @quasar/icon-factory
$ quasar ext add @quasar/icon-genie
```

If you are on Windows and seeing an error the likes of `pngquant failed to build, make sure that libpng-dev is installed`, please do the following:

```
$ npm install --global --production windows-build-tools
```

The most important part (and indeed the only reason to use this extension) is pointing it at your shiny icon (and splashscreen if you are building for Cordova/Capacitor.) So the first thing you are reminded of is that you need to do that!

```
--------------------------- ATTENTION! -----------------------------

 You must replace app-icon.png in the root folder of your project.
 If you plan on building for Cordova/Capacitor, you must also replace the
 app-splashscreen.png image in the same place. File details:

  -> app-icon.png           1240x1240   (with transparency)
  -> app-splashscreen.png   2436x2436   (transparency optional)
--------------------------------------------------------------------
```
> **Note:**
  Please use a valid png of 1240x1240 pixels. If you choose an image that is not square or has smaller dimensions, the icon-genie will do its best, but the results will not be optimal. Transparency is recommended. PNG is required.

Then choose a minification strategy:
```bash
? Minify strategy to be used for development:
  pngquant  => quality: lossy       |  time: 1x
  pngcrush  => quality: lossless+   |  time: 10x
  optipng   => quality: lossless+   |  time: 4x
  zopfli    => quality: lossless++  |  time: 80x
```

> Note: we recommend using pngquant for dev because it is the fastest minification. Other targets will take more time, but that is highly dependent on both the mode and the underlying hardware.

You will be asked the same question for production. Our recommendation is to choose `optipng`. It has the best time / quality trade-off for a lossless minification - but `zopfli` WILL shave off a bit more bytes (at the cost of taking much, much longer).

You will also be asked for a background color. This is used in the few cases that a background is required, as with Cordova/Capacitor splashscreens and Cordova/Capacitor iOS icons.

### Triggering
The first time you start Quasar, icon-genie will create the images needed for the specific app artifacts. They will not automatically be added to git, so you will need to manage that yourself.

```bash
$ quasar dev --mode electron
```

You will also be asked which method of splashscreen generation you prefer, ranging from the mere placement of your logo upon the background color you specified, overlaying your icon on top of a splashscreen image, or just using the splashscreen image. If you aren't happy with the results, don't forget you can change it in `quasar.extensions.json`.

The final option during the install phase is to "always rebuild", which is useful for fine-tuning e.g. background colors, but if you don't remove this flag in quasar.extensions.json (or set it to false), the icon-genie will always run and slow down your dev buildtime.

### Intermediary Folder
The icon-genie makes an intermediary folder in the `node_modules/@quasar/icon-genie/tmp` folder to host the images when you switch between dev and build. If you haven't changed the source icon, these will merely be copied to the right destination folders.

### Changing the Source Image
If you don't change the source image for the icon or the splashscreen, you will see a default image that reminds you to do this.
Any time you change the source image, its hash won't match what is recorded in the settings - so it will trigger a rebuild.

### Changing the Settings
All relevant settings are stored in `quasar.extensions.json`, and if you change them, you will notice that the extension is not rerun. To force the rerun, remove the hash of the respective target.

### Uninstalling
Run:
```
$ quasar ext remove @quasar/icon-genie
```

This will remove the extension, its dependencies - but not any of the icons it created.


### Special notes about Cordova (iOS and Android only)

If you choose to build icons for Cordova, on iOS they WILL have a colored background (because transparency is not allowed), and this is why you are asked for an RGB value during the install phase. (Android allows transparency, btw.) You can change this in the quasar.extensions.json, but be sure to use a valid hex code like: `#c0ff33`.

There are three methods to create your splashscreens:
- Only use app-splashscreen.png (default)
- Generate with background color and icon
- Overlay app-icon.png centered on top of app-splashscreen.png

This colored background color will be used for the splashscreen (if you choose the background-color + icon or if your splashscreen is transparent. If you don't provide one (or your color code is invalid), black will be used. If you haven't already installed the [cordova-plugin-splashscreen](https://github.com/apache/cordova-plugin-splashscreen#readme), the process will attempt to install the plugin first and then continue to build the icons before proceeding to the actual Cordova dev or build pipeline.

Splashscreens are obviously a little different depending on whether you are targeting iOS or Android. Please read this document to find out more:

- https://github.com/apache/cordova-plugin-splashscreen#readme

## How it Works
There are 5 things that Icon Genie does with your original file. It will create a set of webicons for your project, it will minify those icons, it can make special icns (Mac) / ico (Windows) files for apps that need them and it will create SVG assets. Finally it will sort these icons into folders.

Here is the description of these general functions that are used internally to compose icon sets and if you just want to use them, feel free:

- **build** - This function creates all assets requested from the sizes object or presets object.
- **minify** - The default usage minifies all assets in the target folder in-place with `pngquant`. Compared to using `pngcrush --brute`, it is a relatively fast process. If you are not in a hurry and want the best results, consider using zopfli for your production assets.
- **icns** - This will create the special MacOS (icns) and Windows icon (ico) files.
- **favicon** - This will create the classical and never going out of style favicon.ico
- **svg** - With this command you can trace the outlines of your PNG to create an SVG and style it with some options.

There are five composed "recipes" that will create icons for you and place them in the appropriate folders according to your needs and as assembled by our research:

- **cordova** (all icons, splashscreens, iOS & Android)
- **electron** (all platforms)
- **pwa**, **spa**, **ssr** (incl. chrome special icon name, favicon)
- **kitchensink** (all icons, all platforms)

### Head's Up!
You may notice that very small icons (like 16x16 and 32x32) look a little strange. Achieving good results by simply downscaling to a very small size depends a great deal on your original, and it is highly recommended that you at least look at all of the icons before you publish your project to a store. While integration testing can make sure that you have an asset, judging the ability of your small icon to express the same content as a large one is highly subjective and something better left to humans. Not even hamming distance will get this right!

## But why did you make this?
There are literally dozens of other projects out there that more or less do the same thing, why did you bother to make a new one? The answer is quite simple: Because none of them fulfill all the needs of the quasar project, and although lots of really smart people built them, we want to be able to maintain this library and grow it as quasar grows. Especially since many such image-library projects quickly grow outdated and maintainers drift away into a sea of micro-modules, we felt that it is a good property to keep "in-house".

Furthermore, we wanted to pay special attention to your security and it was obvious that other libraries aren't doing enough to protect developers.

## Minify
There are four different minification algorithms available (because it is possible that one or the other just won't build on your system or worse becomes compromised via some kind of exploit). Using totally non-scientific tests, these are the results of this command that ran one time on a 3,2 GHz Quad-Core Intel Xeon with 16 GB of ram:

`$ time node ./bin/cli.js -p=spa -s=test/example-1240x1240.png -t=test/output -m="$minify" && du -sh test/output/spa`

It takes a source image, scales it down according to the settings and then minifies it according to the library listed and the default settings tuned to give the best results.

| Library       | Time        | Quality    | Size   |
|:-------------:|:-----------:|:----------:|:------:|
| *no minify*   | 00.7s       | original   | 664K   |
| pngquant-good | 01.4s       | lossy      | 144K   |
| optipng       | 13.9s       | lossless   | 404K   |
| pngcrush      | 28.1s       | lossless   | 404K   |
| zopfli.more   | 81.3s       | lossless   | 336K   |

This is why it is recommended to use pngquant during development (to have a proxy image), but to use optipng (or zopfli) when building for production.

<div style="text-align:center">
    <img src="./test/__tests__/sources/quant_opti_orig.png?raw=true" width="701" height="195" >
</div>

## .icns & .ico
These are notoriously difficult to acquire and make. For icns you usually need a mac and ico is really just a sequence of images with a special header - but there are very few tools that will let you do both cross-platform - and this is one case where we needed several tools.

This module uses the amazing [`png2icons`](https://github.com/idesis-gmbh/png2icons) module, which actually does all of the decoding and encoding on a byte-level with javascript. This of course takes a bit of time, but it also works cross-platform, so please think about going over there and giving those devs a :star:. This is actually one of the slowest parts of the `kitchensink` and the files are huge. By feeding it from the `sharp` buffer it has been sped up a little bit (and the final icns file is actually about 20% smaller!)


## SVG
The `safari-pinned-tab.svg` mask is created by adding contrast (via threshold) to the original and then applying even more threshold to the SVG tracing.

To make these SVG's as small as possible, they are compressed with SVGO. There are no scripts or remote resources included in these SVG assets.

## CLI Usage
The Icon Genie can be used as a command line tool for batch invocation, and you can simply add it by installing it "globally" with your node package manager:
```bash
$ yarn global add @quasar/quasar-app-extension-icon-genie
- or -
$ npm install --global @quasar/quasar-app-extension-icon-genie
```

To find out about the settings, just use
```
$ icongenie --help

Quasar Icon Genie: v.1.0.0
     License: MIT

Icon Genie is a node utility to create a batch of icons for your app.
Designed to work seamlessly with the Quasar Framework, but probably
useful for other build pipelines.

Flags:
  -p, --preset      Choose a preset output or make your own
                    [minify|splash|svg|favicon]
                    [spa|pwa|cordova|electron|kitchensink|custom]
  -s, --source      Your source image as a large square png
  -t, --target      The destination directory for the files created
  -o, --options     path to file that overrides defaults (if custom)
  -m, --minify      Minify strategy to use.
                    [pngcrush|optipng|pngquant|zopfli]
  -d, --mode        Minify mode if minify preset [folder|singlefile]
  -v, --version     display version information
  -h, --help        display this information

Usage:

$ icongenie -p=kitchensink -s=icon-1280x1280.png -t=./outputFolder -m=pngquant
$ icongenie -p=minify -s=icon-1240x1240.png -t=./output -m=pngquant -d=singlefile
```

## Consuming as a library
You can use this module as a library to provide production and minification assets if you so desire. It will only work in the server context. Import and use at your discretion, but please note: this is not the primary purpose of this library and only security / core functionality issues will be addressed. Please do not file feature requests for this unless you provide a PR.

## Performance
Solving compression problems takes time, and the more complex the approach the more linear time is needed. Some compression algorithms are fast, some are great. None are both. This package tries to write from the buffer only when a file is created and (mostly) avoids creating intermediary files.

## Testing
`git clone`, `yarn install`, `yarn test`

## Security
This library only permits the usage of `.png` files as the source, and there is a `magic-number` check to ensure that the file being processed is indeed a valid and proper `image/png`. Furthermore, there are neither imagemagick nor graphicsmagick dependencies and this project should build and run on all platforms supported by `@quasar/cli`.

If you discover a security issue, please contact us via email: `security@quasar-framework.org`

## Known Issues

### Docker
`Error spawn ../node_modules/optipng-bin/vendor/optipng ENOENT`

If you build the Quasar and an icon-genie in a Docker environment using an Alpine Linux image, here is the solution how to workaround an issue https://github.com/imagemin/optipng-bin/issues/84

1. Create a `.dockerignore` file in the folder where where your `Dockerfile` is placed and exclude `node_modules`:
`./client/node_modules`
2. Install the following packages in the Docker image
`RUN apk --no-cache add pkgconfig autoconf automake libtool nasm build-base zlib-dev`

## Contributing
You are welcome to join this project. Please file issues and make PRs! Let us know how it goes and join us at our [discord server](https://discord.gg/5TDhbDg) to talk shop.

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


## Thanks to
- [image-trace-loader](https://github.com/EmilTholin/image-trace-loader)
- the [image-min](https://github.com/imagemin) team
- the incredible work and dedication of @mn4367 and the [[`png2icons`](https://github.com/idesis-gmbh/png2icons)
- @TobyMosque, @maxMatteo, @Robin, @Rob, @trendchaser4u, @bloo_df, @mn4367


## Naming
We discovered very late that there is another project known as Icon Factory, so before we published 1.0.0, we did a last minute renaming.


## Licenses
- Code: MIT
- © 2018 - present: Present Daniel Thompson-Yvetot & Razvan Stoenescu
- Original Image for icon-genie: [Public Domain](https://www.publicdomainpictures.net/pictures/180000/nahled/coffee-grinder-14658946414E8.jpg)
- Modifications: Daniel Thompson-Yvetot. CC-BY
