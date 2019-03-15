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

const { promisify } = require('util'),
  { posterize, trace } = require('potrace'),
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
  readChunk = require('read-chunk'),
  isPng = require('is-png')

let settings = require('./settings'), image = false

const { access, writeFile, writeFileSync, readFile, ensureDir } = require('fs-extra')
const exists = async function (file) {
  try {
    await access(file)
    return true
  } catch (err) {
    // console.error(err)
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
      throw 'Source image for icon-factory not found'
    } else {
      const buffer = await readChunk(src, 0, 8)
      if (isPng(buffer) === true) {
        // console.log('created image buffer')
        return (image = sharp(src))
      } else {
        image = false
        console.error('* [ERROR] Source image for icon-factory is not a png')
        // exit because this is BAD!
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

const verify = async function(src, target) {
  await checkSrc(src)
  await ensureDir(target)
}

let iconfactory = exports.iconfactory = {
  version: function() {
    return require('../package.json').version
  },
  custom: async function(src, target, strategy, options) {
    await this.build(src, target, options)
  },
  cordova: async function(src, target, strategy, options) {
    options = options || settings.options.cordova
    await verify(src, target)
    await this.splash(src, target, options)
    await this.build(src, target, options)
    if (strategy) {
      await this.minify(target, options, strategy, 'batch')
    } else {
      console.log('no minify strategy')
    }
  },
  electron: async function(src, target, strategy, options) {
    options = options || settings.options.electron
    await verify(src, target)
    await this.build(src, target, options)
    if (strategy) {
      await this.minify(target, options, strategy, 'batch')
    } else {
      console.log('no minify strategy')
    }
    await this.icns(src, target, options, strategy)
  },
  pwa: async function(src, target, strategy, options) {
    options = options || settings.options.pwa
    await verify(src, target)
    await this.build(src, target, options)
    if (strategy) {
      await this.minify(target, options, strategy, 'batch')
    } else {
      console.log('no minify strategy')
    }
    await this.favicon(src, target)
  },
  spa: async function(src, target, strategy, options) {
    options = options || settings.options.spa
    await verify(src, target)
    await this.build(src, target, options)
    if (strategy) {
      await this.minify(target, options, strategy, 'batch')
    } else {
      console.log('no minify strategy')
    }
    await this.favicon(src, target)
    await this.svg(src, target)
    await this.svgDuochrome(src, target)
  },
  kitchensink: async function(src, target, strategy) {
    await this.pwa(src, target + '/src/statics', strategy)
    await this.spa(src, target + '/src/statics', strategy)
    await this.electron(src, target + '/src-electron/icons', strategy)
    await this.cordova(src, target + '/src-cordova/res', strategy)
  },
  /**
   * Creates a set of images according to the subset of options it knows about.
   *
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {string} options - js object that defines path and sizes
   */
  build: async function(src, target, options) {
    await verify(src, target) // creates the image object
    const buildify2 = async function (pvar) {
      try {
        let pngImage = image.resize(pvar[1], pvar[1]).png()
        await pngImage.toFile(pvar[0])
      } catch (err) {
        console.log(err)
      }
    }

    let output
    let folders = uniqueFolders(options)
    for (let n in folders) {
      // make the folders first
      // console.log(folders[n])
      ensureDir(`${target}/${folders[n]}`)
    }
    for (let optionKey in options) {
      let option = options[optionKey]
      // chain up the transforms
      for (let sizeKey in option.sizes) {
        let size = option.sizes[sizeKey]
        if (!option.splash) {
          const dest = `${target}/${option.folder}`
          if (option.infix === true) {
            output = `${dest}/${option.prefix}${size}x${size}${option.suffix}`
          } else {
            output = `${dest}/${option.prefix}${option.suffix}`
          }
          // console.log('p1', output, size)
          let pvar = [output, size]
          await buildify2(pvar)
        }
      }
    }
  },
  /**
   * Creates a set of splash images
   *
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   * @param {string} options - js object that defines path and sizes
   */
  splash: async function(src, target, options) {
    let output
    let rgb = hexToRgb(settings.options.background_color)
    // console.log('RGB', rgb.r, rgb.g, rgb.b)

    await verify(src, target)
    if (!image) {
      process.exit(1)
    }
    let sharpSrc = sharp(src)

    sharpSrc.extend({ top: 726, bottom: 726, left: 726, right: 726 })
      .flatten({background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 }})

    let data = await sharpSrc.toBuffer()

    for (let optionKey in options) {
      var option = options[optionKey]
      for (let sizeKey in option.sizes) {
        var size = option.sizes[sizeKey]
        if (option.splash) {
          const dest = `${target}/${option.folder}`
          await ensureDir(dest)

          if (option.infix === true) {
            output = `${dest}/${option.prefix}${size}x${size}${option.suffix}`
          } else {
            output = `${dest}/${option.prefix}${option.suffix}`
          }
          // console.log('p1', output, size)
          let pvar = [output, size]
          let sharpData = sharp(data)
          sharpData = sharpData.resize(pvar[1][0], pvar[1][1])
          await sharpData.toFile(pvar[0])
        }
      }
    }
  },
  /**
   * Minifies a set of images
   *
   * @param {string} target - image location
   * @param {string} options - where to drop the images
   * @param {string} strategy - which minify strategy to use
   * @param {string} mode - singlefile, single directory or batch
   */
  minify: async function(target, options, strategy, mode) {
    let cmd, chain
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

    const __minifier = async (pvar) => {
      await imagemin([pvar[0]], pvar[1], {
        plugins: [cmd]
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
          await __minifier([`${target}/${folders[n]}/*.png`, `${target}/${folders[n]}`], cmd)
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

      await verify(src, target)

      let sharpSrc = sharp(src)
      let buf = await sharpSrc.toBuffer()

      let out = await png2icons.createICNS(buf, png2icons.BICUBIC, 0)
      // await writeFile(`${path}/icon.icns`, out)
      writeFileSync(`${target}/icon.icns`, out)

      let out2 = await png2icons.createICO(buf, png2icons.BICUBIC, 0, false)
      // await writeFile(`${path}/icon.ico`, out2)
      writeFileSync(`${target}/icon.ico`, out2)

    } catch (err) {
      console.error(err)
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
      await verify(src, target)
      if (!image) {
        process.exit(1)
      }
      let sharpSrc = sharp(src)

      await sharpSrc.resize(32, 32).png()
        .toFile(`${target}/icon-32x32.png`)

      await sharpSrc.resize(16, 16).png()
        .toFile(`${target}/icon-16x16.png`)

      let files = await Promise.all([
        readFile(`${target}/icon-16x16.png`),
        readFile(`${target}/icon-32x32.png`)
      ])
      let buf = await toIco(files)
      await writeFile(`${target}/favicon.ico`, buf)
    } catch (err) {
      console.error(err)
    }
  },
  /**
   * Create a monochrome svg from the icon
   * @param {string} src - image location
   * @param {string} target - where to drop the images
   */
  svg: async function(src, target) {
    try {
      // see potrace for more options
      const traceParams = {
        threshold: settings.options.svg.svg_threshold,
        background: settings.options.background_color,
        color: settings.options.theme_color,
        turdSize: settings.options.svg.turdSize,
        optTolerance: settings.options.svg.optTolerance
      }

      await verify(src, target)
      if (!image) {
        process.exit(1)
      }
      // we need to REASSIGN the sharp src
      let sharpSrc = sharp(src).threshold(settings.options.svg.png_threshold)
      let data = await sharpSrc.toBuffer()
      let svg = await potrace.trace({ data, traceParams })
      await writeFile(`${target}/safari-pinned-tab.svg`, svg)
    } catch (err) {
      console.error(err)
    }
  },
  /**
   * Create a duochrome posterized svg from the icon (good for gradients)
   * @param {string} src - image location
   * @param {string} target - where to drop the svg
   */
  svgDuochrome: async function(src, target) {
    try {
      const traceParams = {
        steps: settings.options.svg.steps,
        color: settings.options.color,
        background: settings.options.background_color
      }
      await ensureDir(`${target}`)
      await verify(src, target)
      if (!image) {
        process.exit(1)
      }
      // we need to REASSIGN the sharp src
      let data = await sharp(src).toBuffer()
      let svg = await potrace.posterize({ data, traceParams })
      await writeFile(`${target}/duochrome.svg`, svg)
    } catch (err) {
      console.error(err)
    }
  }
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = iconfactory
  }
  exports.iconfactory = iconfactory
}
