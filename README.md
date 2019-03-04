# **ATTENTION ACHTUNG** 
This library is currently being rebuilt.
<hr/>

<div style="text-align:center">
  <img src="iconfactory.png" />
</div>

# quasar-icon-factory - Work in Progress

This node module outputs a set of **SQUARE** favicons, webicons, pwa-icons and electron-icons as well as iOS, Windows Store and MacOS icons from an original 1240x1240 square icon that retains transparency and also **minifies** the assets. It will also create splash screens and two different types of svgs.

It works cross-platform to even generate those pesky `.icns` and `.ico` files for some reason still used by Electron apps and in the case of the latter prefered by some browsers and webscrapers (favicon.ico) - even though modern development guidelines for Apple and Windows recommend using `.png`. 

It has three main interfaces (CLI, API and Webpack 4) and although it is built for the Quasar-Framework, it should work anywhere you can run node. It is designed to be a very useful tool that you will be glad to have lying around.

> If you use an original that is smaller than 1240x1240 some icons will be naively upscaled. If you do not use a square original, it will be cropped square from the center using the smaller dimension as width and height. You have been warned.

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
There are literally dozens of other projects out there that more or less do the same thing, why did you bother to make a new one? The answer is quite simple: Because none of them fulfill all the needs of the quasar project, and although lots of really smart people built them, we want to be able to maintain this library and grow it as quasar grows. Especially since many such image-library projects quickly grow outdated and maintainers drift away into a sea of micro-modules (yes imagemin, we mean you), we felt that it is a good property to keep "in-house".

# Installation and Usage

## Requires
- node / yarn
- Linux, MacOS or Windows

## Install
If you install it, quasar-cli will use this project internally as a webpack plugin.

To include this lib in your project use npm or yarn:

```
$ yarn add quasar-icon-factory
```

## Webpack plugin [WIP]
The following example uses the webpack chain approach and will create all of the icons seperated to their respective folders.

```js 
chainWebpack (chain) {
  chain.plugin('icon-factory')
  .use(IconFactory, [
    [{
      preset: 'kitchensink',
      source: './icon-prototype.png',
      target: './src/statics/icons',
      options: false,
      minify: false,
      mode: false,
      debug: true
    }]
  ])
}
```

## Api Usage
`quasar-icon-factory` was built for use in the [Quasar-Framework](https://quasar-framework.org) and as such is intended to follow some of the conventions of that project. If you prefer to output different files / settings, it is possible for you to pass these in an override object to `quasar-icon-factory` that contains all of the settings that you prefer. If you want to pass an options object (perhaps for the fastest available minify at lowest quality), this is the kind of structure you will need: 

```js 
let options = {
  minify: {
    available: ['pngquant']
    type: 'pngquant'
    pngquantOptions: {
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

There are six different minification algorithms available (because it is possible that one or the other just won't build on your system or worse becomes compromised via some kind of exploit). Using totally non-scientific tests, these are the results of this command that ran one time on a 3,2 GHz Quad-Core Intel Xeon with 16 GB of ram: 

`$ time node cli.js -p=spa -s=test/example-1240x1240.png -t=test/output -m="$minify" && du -sh test/output/spa`

It takes a source image, scales it down according to the settings and then minifies it according to the library listed and the default settings tuned to give the best results.

| Library       | Time        | Quality    | Size   |
|:-------------:|:-----------:|:----------:|:------:| 
| *no minify*   | 00.7s       | original   | 664K   |
| pngquant-bad  | 00.9s       | very lossy | 100K   |
| pngquant-good | 01.4s       | lossy      | 144K   |
| pngout        | 10.7s       | lossless   | 624K   |
| advpng.3      | 10.9s       | lossless   | 632K   |
| optipng       | 13.9s       | lossless   | 404K   |
| pngcrush      | 28.1s       | lossless   | 404K   |
| zopfli        | 33.2s       | lossless   | 380K   |
| zopfli.more   | 81.3s       | lossless   | 336K   |

This is why it is recommended to use pngquant during development (to have a proxy image), but to use optipng when building for production.

<div style="text-align:center">
    <img src="./test/sources/quant_opti_orig.png?raw=true" width="701" height="195" >
</div>

## .icns & .ico
These are notoriously difficult to acquire and make. For icns you usually need a mac and ico is really just a sequence of images with a special header - but there are very few tools that will let you do both cross-platform - and this is one case where we needed several tools. 

This module uses the amazing [`png2icons`](https://github.com/idesis-gmbh/png2icons) module, which actually does all of the decoding and encoding on a byte-level with javascript. This of course takes a bit of time, but it also works cross-platform, so please think about going over there and giving those devs a :star:. This is actually one of the slowest parts of the `kitchensink` and the files are huge. By feeding it from the `sharp` buffer it has been sped up a little bit (and the final icns file is actually about 20% smaller!)

To make the favicon.ico, it uses [`to-ico`](https://github.com/kevva/to-ico) and concats a 16x16 and a 32x32 png.

## Splash Screens for Cordova
These are constructed for your app and use your project's background color for the background. If you undefine this value, the process will automatically create a black background. You can also change the option with a hex triplet like `#c0ffee`. 

## SVG
The `safari-pinned-tab.svg` mask is created by adding contrast (via threshold) to the original and then applying even more threshold to the SVG tracing. If you set a background color, the mask will be solid, which is probably not what you want. If you are indeed of a discerning nature (and have used gradients in your icon design), there is another option available to you:svg-duochrome. It too will be created in the spa folder within the spa task. As usual, you can also override our sensible defaults and get some wild SVG action going on.

Here are the options you will want to set:

```js 
options: {
  background_color: '#000074',
  theme_color: '#02aa9b',
  svg: {
    png_threshold: 200,
    svg_threshold: 128,
    turdSize: 3,
    optTolerance: 0.3,
    steps: [40, 85, 135, 180]
  },
}
```

## CLI Usage
`quasar-icon-factory` can be used as a command line tool for batch invocation, and you can simply add it by installing it "globally" with your node package manager:
```bash
$ yarn global add quasar-icon-factory 
- or -
$ npm install --global quasar-icon-factory 
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
                    [pngcrush|pngquant|optipng|pngout|zopfli|advpng]
  -d, --mode        Minify mode if minify preset [folder|singlefile]
  -v, --version     display version information
  -h, --help        display this information
  
Usage:
    
$ iconfactory -p=kitchensink -s=icon-1280x1280.png -t=./outputFolder -m=pngquant  
$ iconfactory -p=minify -s=icon-1240x1240.png -t=./output -m=pngquant -d=singlefile  
```

## Performance
Solving compression problems takes time, and the more complex the approach the more linear time is needed. Some compression algorithms are fast, some are great. None are both. This package tries to write from the buffer only when a file is created and (mostly) avoids creating intermediary files. We will look to increasing the performance through multithreading and reducing memory consumption when we begin the refactoring stage.

## Testing
`git clone`, `yarn install`, `yarn test`

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


#### NPM Advisory: Tunnel Agent
- If you are concerned about tunnel-agent being out of date, you can try my experimental node module wrangler **[`superdep`](https://www.npmjs.com/package/superdep)**.

```bash
$ npm install --global superdep
$ cd {your project folder}
$ superdep -s='caw/tunnel-agent/0.6.0'
```

It will replace the version of tunnel-agent in your dependencies with v0.6.0 - however these changes are likely to be overridden when you do any kind of yarn or npm update / install / upgrade.




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
- [ ] Interactive CLI from @bloo_df
- [ ] Audit imagemin lib and deps
- [ ] Build JSDocs on git precommit 
- [ ] Real benchmarks
- [ ] Refactor internal methods and patterns to streamline process
- [ ]  - multithreading of sharp via .clone()
- [ ]  - be even smarter about only REALLY making the icons that are needed and then writing targets from that specific buffer


## Thanks to
- [image-trace-loader](https://github.com/EmilTholin/image-trace-loader)
- the [image-min](https://github.com/imagemin) team
- @maxMatteo, @Robin, @Rob, @trendchaser4u, @bloo_df


## Licenses
- Code: MIT
- © 2018: Present D.C. Thompson & Razvan Stoenescu
- Original Image for iconfactory: [Public Domain](https://www.publicdomainpictures.net/pictures/180000/nahled/coffee-grinder-14658946414E8.jpg)
- Modifications: D.C.Thompson. CC-BY 
