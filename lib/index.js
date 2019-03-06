'use strict'

/**
 * Simple module that takes an original image and resizes
 * it to common icon sizes and will put them in a folder.
 * It will retain transparency and can make special file
 * types. You can control the settings.
 *
 * @module icon-factory
 * @exports iconfactory
 */

const fs = require('fs-extra'),
  sharp = require('sharp'),
  path = require('path'),
  imagemin = require('imagemin'),
  pngquant = require('imagemin-pngquant'),
  optipng = require('imagemin-optipng'),
  pngout = require('imagemin-pngout'),
  zopfli = require('imagemin-zopfli'),
  pngcrush = require('imagemin-pngcrush'),
  png2icons = require('png2icons'),
  toIco = require('to-ico'),
  potrace = require('potrace'),
  // SVGO = require('svgo'),
  readChunk = require('read-chunk'),
  isPng = require('is-png')

let settings = require('./settings'),
  options,
  image = false

/**
 * This is the first call that attempts to memoize the sharp(src).
 * If the source image cannot be found or if it is not a png, it
 * is a failsafe that will exit or throw.
 *
 * @param {string} src - a folder to target
 * @throws {error} if not a png, if not an image
 */
const checkSrc = function(src) {
  if (image === false) {
    if (!fs.existsSync(src)) {
      image = false
      console.error('Source image for icon-factory not found')
      process.exit(0)
      throw new Error('Source image for icon-factory not found')
    } else {
      const buffer = readChunk.sync(src, 0, 8)
      if (isPng(buffer) === true) {
        console.log('created image buffer')
        return (image = sharp(src))
      } else {
        image = false
        // console.error('Source image for icon-factory is not a png')
        // process.exit(0)
        // todo: permit SVG
        throw new Error('Source image for icon-factory is not a png')
      }
    }
  } else {
    return image
  }
}

/**
 * This function makes sure that the target directories exist.
 *
 * @param {string} dirPath - a folder to create
 * @throws {error} if not a png, if not an image
 */
const mkdirpAsync = function(dirPath) {
  return new Promise((resolve, reject) => {
    fs.ensureDir(dirPath, err => (err ? reject(err) : resolve()))
  }).catch(err => {
    if (err.code === 'EEXIST') return Promise.resolve()
    throw err
  })
}

/**
 * Optional sync version for checking if the target folder exists
 * Alias if we need it NOW!!!
 *
 * @param {string} target - a folder to target
 */
const checkTgt = function(target) {
  mkdirpAsync(target)
    .catch(err => {
      console.error(err)
    })
    .then(() => {
      return true
    })
}

/**
 * Sort the folders in the current job for unique folders.
 *
 * @param {object} options - a subset of the settings
 * @returns {array} folders
 */
const uniqueFolders = function(options) {
  let folders = []
  for (let type in options) {
    folders.push(options[type].folder)
  }
  folders = folders.sort().filter((x, i, a) => !i || x !== a[i - 1])
  return folders
}

/**
 * Turn a hex color (like #212342) into r,g,b values
 *
 * @param {string} hex - hex colour
 * @returns {array} r,g,b
 */
const hexToRgb = function(hex) {
  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

const buildify = pvar => {
  // Is it really safe to run eval?
  new Promise((resolve, reject) => {
    eval(pvar)
    resolve()
  }).catch(err => {
    console.log(err)
    // throw new Error(err)
    Promise.reject(err)
  })
}

const verify = function(src, target) {
  let chain = Promise.resolve()
  chain = chain.then(() => buildify(checkSrc(src)))
  chain = chain.then(() => buildify(checkTgt(target)))
  return chain
}

let iconfactory = (exports.iconfactory = {
  version: function() {
    return require('../package.json').version
  },
  custom: function(src, target, strategy, options) {
    let chain = Promise.resolve()
    chain = chain.then(() => verify(src, target))
    chain = chain.then(() => buildify(this.build(src, target, options)))
    return chain
  },
  cordova: function(src, target, strategy) {
    let chain = Promise.resolve()
    options = settings.options.cordova
    chain = chain.then(() => verify(src, target))
    chain = chain.then(() => buildify(this.splash(src, target, options)))
    chain = chain.then(() => buildify(this.build(src, target, options)))
    chain = chain.then(() =>
      buildify(
        strategy
          ? this.minify(target, settings.options.cordova, strategy, 'batch')
          : console.log('no minify strategy')
      )
    )
    return chain
  },
  electron: function(src, target, strategy) {
    let chain = Promise.resolve()
    options = settings.options.electron
    chain = chain.then(() => buildify(verify(src, target)))
    chain = chain.then(() => buildify(this.build(src, target, options)))
    chain = chain.then(() =>
      buildify(
        strategy
          ? this.minify(target, settings.options.electron, strategy, 'batch')
          : console.log('no minify strategy')
      )
    )
    chain = chain.then(() => buildify(this.icns(src, target, options, strategy)))
    return chain
  },
  pwa: function(src, target, strategy) {
    let chain = Promise.resolve()
    options = settings.options.pwa
    chain = chain.then(() => verify(src, target))
    chain = chain.then(() => buildify(this.build(src, target, options)))
    chain = chain.then(() =>
      buildify(
        strategy
          ? this.minify(target, settings.options.pwa, strategy, 'batch')
          : console.log('no minify strategy')
      )
    )
    chain = chain.then(() => buildify(this.favicon(src, target, 'spa')))
    return chain
  },
  spa: function(src, target, strategy) {
    let chain = Promise.resolve()
    options = settings.options.spa
    chain = chain.then(() => verify(src, target))
    chain = chain.then(() => buildify(this.build(src, target, options)))
    chain = chain.then(() =>
      buildify(
        strategy
          ? this.minify(target, settings.options.spa, strategy, 'batch')
          : console.log('no minify strategy')
      )
    )
    chain = chain.then(() => buildify(this.favicon(src, target, 'spa')))
    chain = chain.then(() => buildify(this.svg(src, target, 'spa')))
    chain = chain.then(() => buildify(this.svgDuochrome(src, target, 'spa')))
    return chain
  },
  kitchensink: function(src, target, strategy) {
    let chain = Promise.resolve()
    chain = chain.then(() => buildify(this.electron(src, target, strategy)))
    chain = chain.then(() => buildify(this.pwa(src, target, strategy)))
    chain = chain.then(() => buildify(this.spa(src, target, strategy)))
    chain = chain.then(() => buildify(this.cordova(src, target, strategy)))
    return chain
  },
  /**
   * Creates a set of images according to the subset of options it knows about.
   *
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {string} options - js object that defines path and sizes
   */
  build: function(src, target, options) {
    checkSrc(src)
    checkTgt(target)
    const buildify2 = pvar =>
      new Promise((resolve, reject) => {
        // console.log("P", pvar[0], pvar[1])
        image
          .resize(pvar[1], pvar[1])
          //.crop(sharp.strategy.centre) // deprecated
          .png()
          .toFile(pvar[0])
          .then(() => resolve())
      }).catch(err => {
        console.log(err)
        Promise.resolve()
      })

    let output
    let chain = Promise.resolve()
    let folders = uniqueFolders(options)
    for (let n in folders) {
      // make the folders first
      console.log(folders[n])
      chain = chain.then(() => mkdirpAsync(`${target}/${folders[n]}`))
    }
    for (let type in options) {
      // chain up the transforms
      options[type].sizes.forEach(size => {
        if (!options[type].splash) {
          const dest = `${target}/${options[type].folder}`
          if (options[type].infix === true) {
            output = `${dest}/${options[type].prefix}${size}x${size}${options[type].suffix}`
          } else {
            output = `${dest}/${options[type].prefix}${options[type].suffix}`
          }
          // console.log('p1', output, size)
          let pvar = [output, size]
          chain = chain.then(() => buildify2(pvar))
        }
      })
    }
    return chain
  },
  /**
   * Creates a set of splash images
   *
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {string} options - js object that defines path and sizes
   */
  splash: function(src, target, options) {
    let output
    let rgb = hexToRgb(settings.options.background_color)
    // console.log('RGB', rgb.r, rgb.g, rgb.b)
    let chain = Promise.resolve()
    let feature = function() {
      sharp(src) // make our source first then build promise chain
        .background({ r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 })
        .extend({
          top: 726,
          bottom: 726,
          left: 726,
          right: 726
        })
        .flatten({background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 }})
        // .toFile(`${target}/splash_prototype.png`)
        .toBuffer()
        .then(data => {
          for (let type in options) {
            options[type].sizes.forEach(size => {
              if (options[type].splash) {
                const dest = `${target}/${options[type].folder}`
                mkdirpAsync(dest).then(() => {
                  if (options[type].infix === true) {
                    output = `${dest}/${options[type].prefix}${size}x${size}${options[type].suffix}`
                  } else {
                    output = `${dest}/${options[type].prefix}${options[type].suffix}`
                  }
                  console.log('p1', output, size)
                  let pvar = [output, size]
                  let feat = function() {
                    sharp(data)
                      .resize(pvar[1][0], pvar[1][1])
                      .toFile(pvar[0])
                  }
                  chain = chain.then(() => buildify(feat()))
                })
              }
            })
          }
        })
    }
    chain = chain.then(() => buildify(feature()))
    return chain
  },
  /**
   * Minifies a set of images
   * @param {string} target - image location
   * @param {string} options - where to drop the images
   * @param {string} strategy - which minify strategy to use
   * @param {string} mode - singlefile, single directory or batch
   */
  minify: function(target, options, strategy, mode) {
    let cmd
    let minify = settings.options.minify
    if (!minify.available.find(x => x === strategy)) {
      strategy = minify.type
    }
    switch (strategy) {
      case 'pngcrush':
        cmd = pngcrush(minify.pngcrushOptions)
        break
      case 'pngquant':
        cmd = pngquant(minify.pngquantOptions)
        break
      case 'optipng':
        cmd = optipng(minify.optipngOptions)
        break
      case 'pngout':
        cmd = pngout(minify.pngoutOptions)
        break
      case 'zopfli':
        cmd = zopfli(minify.zopfliOptions)
        break
    }

    const minifier = pvar =>
      new Promise((resolve, reject) => {
        console.log('minifier:', pvar[0], pvar[1])
        imagemin([pvar[0]], pvar[1], {
          plugins: [cmd]
        })
          .catch(err => console.log(err))
          .then(() => resolve())
      })
        .then(() => Promise.resolve())
        .catch(err => {
          console.log(err)
          Promise.resolve()
        })
    let chain = Promise.resolve()

    switch (mode) {
      case 'singlefile':
        chain = chain.then(() => minifier([target, path.dirname(target)]))

        break
      case 'directory':
        chain = chain.then(() => minifier([target + '*.png', path.dirname(target)]))
        console.log('directory')

        break
      case 'batch':
        let folders = uniqueFolders(options)
        for (let n in folders) {
          console.log('batch minify:', folders[n])
          chain = chain.then(() =>
            minifier([`${target}/${folders[n]}/*.png`, `${target}/${folders[n]}`])
          )
        }
        break
      default:
        throw new Error('Minify mode must be one of [singlefile|directory|batch]')
    }
    return chain
  },

  /**
   * Creates special icns and ico filetypes
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   */
  icns: function(src, target) {
    mkdirpAsync(`${target}/electron`).then(() => {
      sharp(src)
        .resize(256, 256)
        // .crop(sharp.strategy.centre) // deprecated
        .png()
        .toBuffer()
        .then(data => {
          png2icons.setLogger(console.log)
          let out = png2icons.createICNS(data, png2icons.BICUBIC, 0)
          fs.writeFileSync(`${target}/electron/icon.icns`, out)
          out = png2icons.createICO(data, png2icons.BICUBIC, 0, false)
          fs.writeFileSync(`${target}/electron/icon.ico`, out)
        })
        .catch(err => console.log(err))
    })
  },
  /**
   * Create one favicon.ico file with both 16x16 and 32x32 resources
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {string} dest - js object that defines path and sizes
   */
  favicon: function(src, target, dest) {
    if (!dest) dest = 'extras'
    mkdirpAsync(`${target}/${dest}`).then(() => {
      let image = sharp(src)
      image
        .resize(32, 32)
        // .crop(sharp.strategy.centre) // deprecated
        .png()
        .toFile(`${target}/${dest}/icon-32x32.png`)
        .then(() => {
          image
            .resize(16, 16)
            // .crop(sharp.strategy.centre) // deprecated
            .png()
            .toFile(`${target}/${dest}/icon-16x16.png`)
            .then(() => {
              let files = [
                fs.readFileSync(`${target}/${dest}/icon-16x16.png`),
                fs.readFileSync(`${target}/${dest}/icon-32x32.png`)
              ]
              toIco(files).then(buf => {
                fs.writeFileSync(`${target}/${dest}/favicon.ico`, buf)
              })
            })
        })
    })
  },
  /**
   * Create a monochrome svg from the icon
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {string} dest - specific project to put the svg
   */
  svg: function(src, target, dest) {
    if (!dest) dest = 'extras'
    // see potrace for more options
    const traceParams = {
      threshold: settings.options.svg.svg_threshold,
      background: settings.options.background_color,
      color: settings.options.theme_color,
      turdSize: settings.options.svg.turdSize,
      optTolerance: settings.options.svg.optTolerance
    }
    mkdirpAsync(`${target}/${dest}`).then(() => {
      sharp(src)
        .threshold(settings.options.svg.png_threshold)
        .toBuffer()
        .then(data => {
          potrace.trace(data, traceParams, function(err, svg) {
            if (err) console.log(err)
            fs.writeFileSync(`${target}/${dest}/safari-pinned-tab.svg`, svg)
          })
        })
    })
  },
  /**
   * Create a duochrome posterized svg from the icon (good for gradients)
   * @param {string} src - image location
   * @param {string} target - where to drop the svg
   * @param {string} dest - project folder to drop the svg
   */
  svgDuochrome: function(src, target, dest) {
    if (!dest) dest = 'extras'
    const traceParams = {
      steps: settings.options.svg.steps,
      color: settings.options.color,
      background: settings.options.background_color
    }
    mkdirpAsync(`${target}/${dest}`).then(() => {
      sharp(src)
        .toBuffer()
        .then(data => {
          potrace.posterize(data, traceParams, function(err, svg) {
            if (err) console.log(err)
            fs.writeFileSync(`${target}/${dest}/duochrome.svg`, svg)
          })
        })
    })
  }
})

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = iconfactory
  }
  exports.iconfactory = iconfactory
}

/*
module.exports = class IconFactory {
  constructor(opts = {}) {
    this.opts = opts
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('icon-factory', (compiler, callback) => {
      const preset = this.opts[0].preset
      const source = this.opts[0].source
      const target = this.opts[0].target
      const options = this.opts[0].options
      const minify = this.opts[0].minify
      const mode = this.opts[0].mode
      const debug = this.opts[0].debug

      console.log(`Quasar Icon Factory: v${iconfactory.version()}`)
      console.log(this.opts[0])

      if (debug) {
        sharp.queue.on('change', function(queueLength) {
          console.log('Queue contains ' + queueLength + ' task(s)')
        })
      }

      iconfactory[preset](source, target, minify, options, mode)
        .catch(err => {
          throw new Error(err)
        })
        .then(() => {
          callback()
        })
    })
  }
}
*/
