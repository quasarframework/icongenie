'use strict'

/**
 * This is a module that takes an original image and resizes
 * it to common icon sizes and will put them in a folder.
 * It will retain transparency and can make special file
 * types. You can control the settings.
 *
 * @module icon-genie
 * @exports icongenie
 */

const { promisify } = require('util'),
  { posterize, trace } = require('potrace'),
  sharp = require('sharp'),
  path = require('path'),
  imagemin = require('imagemin'),
  pngquant = require('imagemin-pngquant'),
  optipng = require('imagemin-optipng'),
  zopfli = require('imagemin-zopfli'),
  pngcrush = require('imagemin-pngcrush'),
  png2icons = require('png2icons'),
  readChunk = require('read-chunk'),
  isPng = require('is-png'),
  SVGO = require('svgo')

let settings = require('./settings'), image = false

const {
  access,
  writeFile,
  writeFileSync,
  ensureDir,
  ensureFileSync } = require('fs-extra')


const exists = async function (file) {
  try {
    await access(file)
    return true
  } catch (err) {
    return false
  }
}

const potrace = {
  /**
   * Wrapper for Potrace that simplifies use down to one function call
   * @param  {Object} context
   * @param  {String | Buffer | Jimp} context.data Source image, file path or {@link Jimp} instance
   * @param  {Object} context.traceParams [options]
   * @returns {Promise<Object>} svg content and instance of {@link Potrace} (so it could be reused with different set of parameters)
   */
  posterize: promisify((context, callback) => {
    posterize(context.data, context.traceParams, callback)
  }),
  /**
   * Wrapper for Potrace that simplifies use down to one function call
   * @param  {Object} context
   * @param  {String | Buffer | Jimp} context.data Source image, file path or {@link Jimp} instance
   * @param  {Object} context.traceParams [options]
   * @returns {Promise<Object>} svg content and instance of {@link Potrace} (so it could be reused with different set of parameters)
   */
  trace: promisify((context, callback) => {
    trace(context.data, context.traceParams, callback)
  })
}

/**
 * This is the first call that attempts to memoize the sharp(src).
 * If the source image cannot be found or if it is not a png, it
 * is a failsafe that will exit or throw.
 *
 * @param {string} src - a folder to target
 * @exits {error} if not a png, if not an image
 */
const checkSrc = async function (src) {
  if (image !== false) {
    return image
  } else {
    const srcExists = await exists(src)
    if (!srcExists) {
      image = false
      throw new Error('Source image for icon-genie not found')
    } else {
      const buffer = await readChunk(src, 0, 8)
      if (isPng(buffer) === true) {
        // console.log('created image buffer')
        return (image = sharp(src))
      } else {
        image = false
        console.error('* [ERROR] Source image for icon-genie is not a png')
        // exit because this is BAD!
        // Developers should catch () { } this as it is
        // the last chance to stop bad things happening.
        process.exit(1)
      }
    }
  }
}

/**
 * Sort the folders in the current job for unique folders.
 *
 * @param {object} options - a subset of the settings
 * @returns {array} folders
 */
const uniqueFolders = function (options) {
  let folders = []
  for (let type in options) {
    if (options[type].folder) {
      folders.push(options[type].folder)
    }
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
const hexToRgb = function (hex) {
  if (hex !== void 0) {
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
  return null
}

/**
 * validate image and directory
 * @param src
 * @param target
 * @returns {Promise<void>}
 */
const validate = async function (src, target) {
  await checkSrc(src)
  if (target !== undefined) {
    await ensureDir(target)
  }
}

/**
 * Log progress in the command line
 *
 * @param {string} msg
 * @param {boolean} end
 */
const progress = function (msg) {
    process.stdout.write(`  ${msg}                       \r`)
}

/**
 * Create a spinner on the command line
 *
 * @example
 *
 *     const spinnerInterval = spinner()
 *     // later
 *     clearInterval(spinnerInterval)
 * @returns {function} - the interval object
 */
const spinner = function () {
  return setInterval(()=> {
    process.stdout.write('/ \r')
    setTimeout(()=>{
      process.stdout.write('- \r')
      setTimeout(()=>{
        process.stdout.write('\\ \r')
        setTimeout(()=>{
          process.stdout.write('| \r')
        }, 100)
      }, 100)
    }, 100)
  },500)
}

let icongenie = exports.icongenie = {
  validate: async function (src, target) {
    await validate(src, target)
    return typeof image === 'object'
  },
  version: function() {
    return require('../package.json').version
  },
  custom: async function(src, target, strategy, options) {
    await this.build(src, target, options)
  },
  cordova: async function(src, target, strategy, options, splashSrc) {
    const spinnerInterval = spinner()
    try {
      if (!splashSrc) splashSrc = src
      options = options || settings.options.cordova
      await this.validate(src, target)
      progress('Building Cordova splash images')
      await this.splash(src, splashSrc, target, options)
      progress('Building Cordova icons')
      await this.build(src, target, options)
      if (strategy) {
        progress(`Minifying assets with ${strategy}`)
        await this.minify(target, options, strategy, 'batch')
      } else {
        console.log('no minify strategy')
      }
    } catch (e) {
      console.log('Cordova: failed', e)
      // throw e
    }
    progress('Icon Genie Finished Cordova')
    clearInterval(spinnerInterval)
  },
  capacitor: async function(src, target, strategy, options, splashSrc) {
    const spinnerInterval = spinner()
    try {
      if (!splashSrc) splashSrc = src
      options = options || settings.options.capacitor
      await this.validate(src, target)
      progress('Building Capacitor splash images')
      await this.splash(src, splashSrc, target, options)
      progress('Building Capacitor icons')
      await this.build(src, target, options)
      if (strategy) {
        progress(`Minifying assets with ${strategy}`)
        await this.minify(target, options, strategy, 'batch')
      } else {
        console.log('no minify strategy')
      }
    } catch (e) {
      console.log('Capacitor: failed', e)
      // throw e
    }
    progress('Icon Genie Finished Capacitor')
    clearInterval(spinnerInterval)
  },
  electron: async function(src, target, strategy, options) {
    const spinnerInterval = spinner()
    try {
      options = options || settings.options.electron
      await this.validate(src, target)
      progress('Building Electron icns and ico')
      await this.icns(src, target, options, strategy)
      progress('Building Electron icons')
      await this.build(src, target, options)
      if (strategy) {
        progress(`Minifying assets with ${strategy}`)
        await this.minify(target, options, strategy, 'batch')
      } else {
        console.log('no minify strategy')
      }
    } catch (e) {
      console.log('Electron: failed', e)
      // throw e
    }
    progress('Icon Genie Finished Electron')
    clearInterval(spinnerInterval)
  },
  pwa: async function(src, target, strategy, options) {
    const spinnerInterval = spinner()
    try {
      options = options || settings.options.pwa
      await this.validate(src, target)
      progress('Building PWA favicons')
      await this.favicon(src, target)
      progress('Building PWA SVG')
      await this.svg(src, target, options)
      progress('Building PWA icons')
      await this.build(src, target, options)
      if (strategy) {
        progress(`Minifying assets with ${strategy}`)
        await this.minify(target, options, strategy, 'batch')
      } else {
        console.log('no minify strategy')
      }
    } catch (e) {
      console.log('PWA: failed', e)
      // throw e
    }
    progress('Icon Genie Finished PWA')
    clearInterval(spinnerInterval)
  },
  spa: async function(src, target, strategy, options) {
    const spinnerInterval = spinner()
    try {
      options = options || settings.options.spa
      await this.validate(src, target)
      progress('Building SPA favicons')
      await this.favicon(src, target)
      progress('Building SPA SVG')
      await this.svg(src, target, options)
      progress('Building SPA icons')
      await this.build(src, target, options)
      if (strategy) {
        progress(`Minifying assets with ${strategy}`)
        await this.minify(target, options, strategy, 'batch')
      } else {
        console.log('no minify strategy')
      }
      // await this.svgDuochrome(src, target, options)
    } catch (e) {
      console.log('SPA: failed', e)
      // throw e
    }
    progress('Icon Genie Finished SPA')
    clearInterval(spinnerInterval)
  },
  bex: async function(src, target, strategy, options) {
    const spinnerInterval = spinner()
    try {
      options = options || settings.options.bex
      await this.validate(src, target)
      progress('Building Browser Extension icons')
      await this.build(src, target, options)
      if (strategy) {
        progress(`Minifying assets with ${strategy}`)
        await this.minify(target, options, strategy, 'batch')
      } else {
        console.log('no minify strategy')
      }
    } catch (e) {
      console.log('BEX: failed', e)
      // throw e
    }
    progress('Icon Genie Finished BEX')
    clearInterval(spinnerInterval)
  },
  kitchensink: async function(src, target, strategy) {
    await this.pwa(src, path.join(target, '/src/statics'), strategy)
    await this.spa(src, path.join(target, '/src/statics'), strategy)
    await this.electron(src, path.join(target + '/src-electron/icons'), strategy)
    await this.cordova(src, path.join(target + '/src-cordova/res'), strategy)
    await this.capacitor(src, path.join(target + '/src-capacitor'), strategy)
    await this.bex(src, path.join(target + '/src-browser-ext/icons'), strategy)
  },

  /**
   * Creates a set of images according to the subset of options it knows about.
   *
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {object} options - js object that defines path and sizes
   */
  build: async function(src, target, options) {
    await this.validate(src, target) // creates the image object
    const buildify2 = async function (pvar) {
      try {
        let pngImage = image.resize(pvar[1], pvar[1])
        if (pvar[2] && options.background_color !== void 0) {
          let rgb = hexToRgb(options.background_color)
          pngImage.flatten({background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 }})
        }
        pngImage.png()
        await pngImage.toFile(pvar[0])
      } catch (err) {
        console.log(err)
        throw err
      }
    }

    let output
    let folders = uniqueFolders(options)
    for (let n in folders) {
      // make the folders first
      ensureDir(`${target}${path.sep}${folders[n]}`)
    }
    for (let optionKey in options) {
      let option = options[optionKey]
      // chain up the transforms
      for (let sizeKey in option.sizes) {
        let size = option.sizes[sizeKey]
        if (!option.splash) {
          const dest = `${target}/${option.folder}`
          if (option.infix === true) {
            output = `${dest}${path.sep}${option.prefix}${size}x${size}${option.suffix}`
          } else {
            output = `${dest}${path.sep}${option.prefix}${option.suffix}`
          }
          let pvar = [output, size, option.background]
          await buildify2(pvar)
        }
      }
    }
  },
  /**
   * Creates a set of splash images
   *
   * @param {string} src - icon location
   * @param {string} splashSrc - splashscreen location
   * @param {string} target - where to drop the images
   * @param {object} options - js object that defines path and sizes
   */
  splash: async function(src, splashSrc, target, options) {
    if (options.background_color !== void 0) {
      let output,
        block = false,
        rgb = hexToRgb(options.background_color)

      // three options
      // options: splashscreen_type [generate | overlay | pure]
      //          - generate (icon + background color) DEFAULT
      //          - overlay (icon + splashscreen)
      //          - pure (only splashscreen)

      let sharpSrc
      if (splashSrc === src) {
        // prevent overlay or pure
        block = true
      }
      if (block === true || options.splashscreen_type === 'generate') {
        await this.validate(src, target)
        if (!image) {
          process.exit(1)
        }
        sharpSrc = sharp(src)
        sharpSrc.extend({
          top: 726,
          bottom: 726,
          left: 726,
          right: 726,
          background: {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            alpha: 1 }})
        .flatten({ background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 } })

      } else if (options.splashscreen_type === 'overlay') {
        sharpSrc = sharp(splashSrc)
          .flatten({ background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 } })
          .composite([{
            input: src
            // blend: 'multiply' <= future work, maybe just a gag
          }])

      } else if (options.splashscreen_type === 'pure') {
        sharpSrc = sharp(splashSrc)
          .flatten({ background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 } })
      }

      let data = await sharpSrc.toBuffer()

      for (let optionKey in options) {
        let option = options[optionKey]
        for (let sizeKey in option.sizes) {
          let size = option.sizes[sizeKey]
          if (option.splash) {
            const dest = `${target}${path.sep}${option.folder}`
            await ensureDir(dest)

            if (option.infix === true) {
              output = `${dest}${path.sep}${option.prefix}${size}x${size}${option.suffix}`
            } else {
              output = `${dest}${path.sep}${option.prefix}${option.suffix}`
            }
            // console.log('p1', output, size)
            let pvar = [output, size]
            let sharpData = sharp(data)
            sharpData = sharpData.resize(pvar[1][0], pvar[1][1])
            await sharpData.toFile(pvar[0])
          }
        }
      }
    }
  },

  /**
   * Minifies a set of images
   *
   * @param {string} target - image location
   * @param {object} options - where to drop the images
   * @param {string} strategy - which minify strategy to use
   * @param {string} mode - singlefile, single directory or batch
   */
  minify: async function(target, options, strategy, mode) {
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
      case 'zopfli':
        cmd = zopfli(minify.zopfliOptions)
        break
    }

    const __minifier = async (pvar) => {
      await imagemin([pvar[0]], {
        destination: pvar[1],
        plugins: [cmd]
      }).catch(err => {
        console.log(err)
      })
    }
    switch (mode) {
      case 'singlefile':
        await __minifier([target, path.dirname(target)], cmd)
        break
      case 'directory':
        chain = await __minifier([target + '*.png', path.dirname(target)], cmd)
        // console.log('directory')
        break
      case 'batch':
        let folders = uniqueFolders(options)
        for (let n in folders) {
          // console.log('batch minify:', folders[n])
          await __minifier([`${target}${path.sep}${folders[n]}${path.sep}*.png`, `${target}${path.sep}${folders[n]}`], cmd)
        }
        break
      default:
        console.error('* [ERROR] Minify mode must be one of [ singlefile | directory | batch]')
        process.exit(1)
    }
    return 'minified'
  },

  /**
   * Creates special icns and ico filetypes
   *
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {object} options
   * @param {string} strategy
   */
  icns: async function(src, target, options, strategy) {
    try {
      if (!image) {
        process.exit(1)
      }

      await this.validate(src, target)

      let sharpSrc = sharp(src)
      let buf = await sharpSrc.toBuffer()

      let out = await png2icons.createICNS(buf, png2icons.BICUBIC, 0)
      ensureFileSync(path.join(target, '/icon.icns'))
      writeFileSync(path.join(target, '/icon.icns'), out)

      let out2 = await png2icons.createICO(buf, png2icons.BICUBIC, 0, true)
      ensureFileSync(path.join(target, '/icon.ico'))
      writeFileSync(path.join(target, '/icon.ico'), out2)

    } catch (err) {
      console.error(err)
      throw err
    }
  },
  /**
   * Create one favicon.ico file with both 16x16 and 32x32 resources
   *
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   */
  favicon: async function(src, target) {
    try {
      await this.validate(src, target)
      if (!image) {
        process.exit(1)
      }

      let sharpSrc = sharp(src)
      let buf = await sharpSrc.toBuffer()

      let out = await png2icons.createICO(buf, png2icons.BICUBIC, 0, true)
      ensureFileSync(path.join(target, '/icons/favicon.ico'))
      writeFileSync(path.join(target, '/icons/favicon.ico'), out)

    } catch (err) {
      console.error(err)
      throw err
    }
  },
  /**
   * Create a monochrome svg from the icon
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {object} options - config options
   */
  svg: async function(src, target, options) {
    try {
      // see potrace for more options
      const traceParams = {
        // threshold: settings.options.svg.svg_threshold,
        // background: options.background_color,
        color: options.theme_color
        // turdSize: settings.options.svg.turdSize,
        // optTolerance: settings.options.svg.optTolerance
      }

      await this.validate(src, target)
      if (!image) {
        process.exit(1)
      }
      // we need to REASSIGN the sharp src
      let sharpSrc = sharp(src)
        .threshold(settings.options.svg.png_threshold)
      let data = await sharpSrc.toBuffer()
      let svg = await potrace.trace({ data, traceParams })

      let svgo = new SVGO({})
      await svgo.optimize(svg).then((res) => {
        ensureFileSync(path.join(target, '/icons/safari-pinned-tab.svg'))
        writeFileSync(path.join(target, '/icons/safari-pinned-tab.svg'), res.data)
      })

    } catch (err) {
      console.error(err)
      throw err
    }
  },
  /**
   * Create a duochrome posterized svg from the icon (good for gradients)
   * @param {string} src - image location
   * @param {string} target - where to drop the svg
   * @param {object} options - pass in the options
   */
  svgDuochrome: async function(src, target, options) {
    try {
      const traceParams = {
        steps: 4,
        color: options.theme_color,
        turdSize: settings.options.svg.turdSize,
        threshold: settings.options.svg.svg_threshold,
        optTolerance: settings.options.svg.optTolerance
      }
      await ensureDir(`${target}`)
      await this.validate(src, target)
      if (!image) {
        process.exit(1)
      }
      // we need to REASSIGN the sharp src
      let data = await sharp(src).toBuffer()
      let svg = await potrace.posterize({ data, traceParams })


      let svgo = new SVGO({})
      await svgo.optimize(svg).then(res => {
        writeFile(`${target}/duochrome.svg`, res.data)
      })

    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = icongenie
  }
  exports.icongenie = icongenie
}
