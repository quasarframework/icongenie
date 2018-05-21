'use strict'

/**
* Simple module that takes an original image and resizes
* it to common icon sizes and will put them in a folder.
* It will retain transparency.
* @module icon-factory
* @exports iconfactory
*/

const fs = require('fs')
	, sharp = require('sharp')
	, path = require('path')
	, imagemin = require('imagemin')
	, pngquant = require('imagemin-pngquant')
	, optipng = require('imagemin-optipng')
	, pngout = require('imagemin-pngout')
	, zopfli = require('imagemin-zopfli')
	, pngcrush = require('imagemin-pngcrush')
	, advpng = require('imagemin-advpng')
	, png2icons = require('png2icons')
	, toIco = require('to-ico')
	, potrace = require('potrace')
	, SVGO = require('svgo')
	, Potrace = potrace.Potrace
	, readChunk = require('read-chunk')
	, isPng = require('is-png')

let settings = require('./settings')
	, options
	, image = false

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
			throw(new Error('Source image for icon-factory not found'))
		}
		else {
			const buffer = readChunk.sync(src, 0, 8)
			if (isPng(buffer)) {
				console.log('created image buffer')
				return image = sharp(src)
			}
			else {
				image = false
				console.error('Source image for icon-factory is not a png')
				process.exit(0)
				throw(new Error('Source image for icon-factory is not a png'))
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
const mkdirpAsync = function (dirPath) {
	// https://gist.github.com/christophemarois/e30650691cf74b9da2e51e13a01c7f70
  const mkdirAsync = currentPath => new Promise((resolve, reject) => {
    fs.mkdir(currentPath, err => err ? reject(err) : resolve())
  }).catch(err => {
    if (err.code === 'EEXIST') return Promise.resolve()
    throw err
  })

  let parts = dirPath.split(path.sep)

  // Support absolute urls
  if (parts[0] === '') {
    parts.shift()
    parts[0] = path.sep + parts[0]
  }

  let chain = Promise.resolve()

  parts.forEach((part, i) => {
    const currentPath = parts.slice(0, i + 1).join(path.sep)
    chain = chain.then(() => mkdirAsync(currentPath))
  })

  return chain
}

/**
 * Optional sync version for checking if the target folder exists
 *
 * @param {string} target - a folder to target
 */
const checkTgt = function(target) {
  mkdirpAsync(target)
	  .catch((err) => {console.error(err)})
    .then(()  => {return true})
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
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

module.exports = {}
let iconfactory
iconfactory = exports.iconfactory = {

	// these are wrappers
	custom: function (src, target, options, strategy) {
		this.build(src, target, options)
		.catch(e => console.info('Successfully caught error: ', e))
		.then(() => strategy ? this.minify(target, options, strategy, 'batch') : console.log('no strategy'))
	},
	cordova: function (src, target, strategy) {
		options = settings.options.cordova
		this.splash(src, target, options)
		this.build(src, target, options)
		.catch(e => console.info('Successfully caught error: ', e))
		.then(() => {
			strategy ? this.minify(target, settings.options.cordova, strategy, 'batch') : console.log('no strategy')
		})
	},
	electron: function (src, target, strategy) {
		options = settings.options.electron
		this.build(src, target, options)
		.catch(e => console.info('Successfully caught error: ', e))
		.then(() => {
			strategy ? this.minify(target, settings.options.electron, strategy, 'batch') : console.log('no strategy')
			this.icns(src, target, options, strategy)
		})
	},
	pwa: function (src, target, strategy) {
		options = settings.options.pwa
		this.build(src, target, options)
		.catch(e => console.info('Successfully caught error: ', e))
		.then(() => {
			strategy ? this.minify(target, settings.options.pwa, strategy, 'batch') : console.log('no strategy')
			this.favicon(src, target, 'spa')
		})
	},
	spa: function (src, target, strategy) {
		options = settings.options.spa
		this.build(src, target, options)
		.catch(e => console.info('Successfully caught error: ', e))
		.then(() => {
			strategy ? this.minify(target, settings.options.spa, strategy, 'batch') : console.log('no strategy')
			this.favicon(src, target, 'spa')
		})
	},

	kitchensink: function (src, target, strategy ) {
		this.cordova(src, target, strategy)
		this.electron(src, target, strategy)
		this.pwa(src, target, strategy)
		this.spa(src, target, strategy)
	},
	/**
	 * Creates a set of images according to the subset of options it knows about.
	 *
	 * @param {string} src - image location
	 * @param {string} target - where to drop the images
	 * @param {string} options - js object that defines path and sizes
	 */
	build: function (src, target, options) {
		checkSrc(src)
		checkTgt(target)
		const buildify = (pvar) => new Promise((resolve, reject) => {
			// console.log("P", pvar[0], pvar[1])
			image
				.resize(pvar[1], pvar[1])
				.crop(sharp.strategy.centre) // you know, just in case
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
			options[type].sizes.forEach((size) => {
				if(!options[type].splash) {
					const dest = `${target}/${options[type].folder}`
					if (options[type].infix === true) {
						output = `${dest}/${options[type].prefix}${size}x${size}${options[type].suffix}`
					} else {
						output = `${dest}/${options[type].prefix}${options[type].suffix}`
					}
					// console.log('p1', output, size)
					let pvar = [output, size]
					chain = chain.then(() => buildify(pvar))
				}
			})
		}
		return chain
	},
	/**
	 * Creates a set of splash images with extended logic
	 *
	 * @param {string} src - image location
	 * @param {string} target - where to drop the images
	 * @param {string} options - js object that defines path and sizes
	 */
	splash: function (src, target, options) {
		checkTgt(target)
		let rgb = hexToRgb(settings.options.background)
		console.log('RGB', rgb.r,rgb.g, rgb.b)
		sharp(src)
		.background({r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1})
		.extend({top: 726, bottom: 726, left: 726, right: 726})
		.flatten()
		.toBuffer()
		.then(data => {
			const buildify = (pvar) => new Promise((resolve, reject) => {
				// console.log("P", pvar[0], pvar[1])
				sharp(data)
				.resize(pvar[1][0], pvar[1][1])
				.toFile(pvar[0])
				.then(() => resolve())
			}).catch(err => {
				console.log(err)
				Promise.resolve()
			})

			let output
			let chain = Promise.resolve()
			for (let type in options) {
				// chain up the transforms
				options[type].sizes.forEach((size) => {
					if(options[type].splash) {
						const dest = `${target}/${options[type].folder}`
						if (options[type].infix === true) {
							output = `${dest}/${options[type].prefix}${size}x${size}${options[type].suffix}`
						} else {
							output = `${dest}/${options[type].prefix}${options[type].suffix}`
						}
						// console.log('p1', output, size)
						let pvar = [output, size]
						chain = chain.then(() => buildify(pvar))
					}
				})
			}
			return chain
		})
	},
	/**
	 * Minifies a set of images
	 * @param {string} target - image location
	 * @param {string} options - where to drop the images
	 * @param {string} strategy - which minify strategy to use
	 * @param {string} mode - singlefile, single directory or batch
	 */
	minify: function (target, options, strategy, mode) {
		let cmd
		let minify = settings.options.minify
		if ( !minify.available.find(x => x === strategy,)) {
			strategy = minify.type
		}
		switch(strategy) {
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
			case 'advpng':
				cmd = advpng(minify.advpngOptions)
				break
		}

		const minifier = (pvar) => new Promise((resolve, reject) => {
			console.log('minifier:', pvar[0], pvar[1])
			imagemin([pvar[0]], pvar[1], {
				plugins: [
					cmd
				]
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

		switch(mode) {
			case 'singlefile':
				chain = chain.then(() => minifier([target, path.dirname(target)]))

				break
			case 'directory':
				chain = chain.then(() => minifier([target+'*.png', path.dirname(target)]))

				break
			case 'batch':
				let folders = uniqueFolders(options)
				for (let n in folders) {
					console.log('batch minify:', folders[n])
					chain = chain.then(() => minifier([`${target}/${folders[n]}/*.png`,`${target}/${folders[n]}`]))
				}
				break
			default:
				throw(new Error('Minify mode must be one of [singlefile|directory|batch]'))
		}

		return chain
	},

	/**
	 * Creates special icns and ico filetypes
	 * @param {string} src - image location
	 * @param {string} target - where to drop the images
	 * @param {string} options - js object that defines path and sizes
	 */
	icns: function (src, target, options) {
		mkdirpAsync(`${target}/electron`)
			.then(() => {
				sharp(src)
				.resize(256, 256)
				.crop(sharp.strategy.centre)
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
		mkdirpAsync(`${target}/${dest}`)
			.then(() => {
				let files = [
					fs.readFileSync(`${target}/${dest}/icon-16x16.png`),
					fs.readFileSync(`${target}/${dest}/icon-32x32.png`)
				]
				if (files.length <= 0) {
					sharp(src)
					.resize(32, 32)
					.crop(sharp.strategy.centre)
					.png()
					.toColourspace('srgb')
					.toFile(`${target}/${dest}/icon-32x32.png`)
					.resize(16,16)
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
				} else {
					toIco(files).then(buf => {
						fs.writeFileSync(`${target}/${dest}/favicon.ico`, buf)
					})
				}
			})
	},
	/**
	 * Create a monochrome svg from the icon
	 * @param {string} src - image location
	 * @param {string} target - where to drop the images
	 * @param {string} dest - js object that defines path and sizes
	 */
	svg: function(src, target) {
		// blatantly taken from image-trace-loader
		const traceParams = {
		};

		mkdirpAsync(`${target}`)
		.then(() => {

			var trace = new Potrace();
			const svgo = new SVGO({multipass: true, floatPrecision: 0});
			trace.loadImage(src, function (error) {
				if (error) {
					console.log(error);
				} else {
					// console.log(trace.getSVG())
					fs.writeFileSync(`${target}/test.svg`, trace.getSVG());
					/*
					 // needs a lot of work
					 svgo.optimize(trace.getSVG(), function (result) {
						console.log(result.data)
						fs.writeFileSync(`${target}/test.svg`, result.data);
					});
					*/
				}
			})
		})
	}
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = iconfactory
  }
  exports.iconfactory = iconfactory
}