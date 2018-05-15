'use strict'

/**
* Simple module that takes an original image and resizes
* it to common icon sizes and will put them in a folder.
* It will retain transparency.
* @module icon-factory
* @exports iconfactory
*/

const fs = require('fs')
  , path = require('path')

let settings = require('./settings')
	, options


// helper to make them folders
// https://gist.github.com/christophemarois/e30650691cf74b9da2e51e13a01c7f70

const mkdirpAsync = function (dirPath) {
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

const checkSrc = function(s) {
  if (!fs.existsSync(s)) {
    console.log('source image not found')
    process.exit(0);
  }
}

const checkTgt = function(t) {
  mkdirpAsync(t)
	  .catch((err) => {console.error(err)})
    .then(()  => {return true})
}

const uniqueFolders = function(options) {
	// turn async to sync
	let folders = []
	for (let type in options) {
		folders.push(options[type].folder)
	}
	folders = folders.sort().filter((x, i, a) => !i || x != a[i - 1])
	return folders
}

module.exports = {}
let iconfactory
iconfactory = exports.iconfactory = {

	// these are wrappers
	custom: function (src, target, options, strategy) {
		this.build(src, target, options)
		.catch(e => console.info('Succesfully caught error: ', e))
		.then(() => strategy ? this.minify(target, options, strategy) : console.log('no strategy'))
	},
	cordova: function (src, target, strategy) {
		options = settings.options.cordova
		this.build(src, target, options)
		.catch(e => console.info('Succesfully caught error: ', e))
		.then(() => strategy ? this.minify(target, settings.options.cordova, strategy) : console.log('no strategy'))

	},
	electron: function (src, target, strategy) {
		options = settings.options.electron
		this.build(src, target, options)
		.catch(e => console.info('Succesfully caught error: ', e))
		.then(() => {
			strategy ? this.minify(target, settings.options.electron, strategy) : console.log('no strategy')
			this.icns(src, target, settings.options.electron, strategy)
		})
	},
	pwa: function (src, target, strategy) {
		options = settings.options.pwa
		this.build(src, target, options)
		.catch(e => console.info('Succesfully caught error: ', e))
		.then(() => strategy ? this.minify(target, settings.options.pwa, 'pngquant') : console.log('no strategy'))
		// .then(() => strategy ? this.minify(target, settings.options.pwa, 'optipng') : console.log('no strategy'))
	},
	spa: function (src, target, strategy) {
		options = settings.options.spa
		this.build(src, target, options)
		.catch(e => console.info('Succesfully caught error: ', e))
		.then(() => strategy ? this.minify(target, settings.options.spa, strategy) : console.log('no strategy'))
	},
	kitchensink: function (src, target, strategy ) {
		this.cordova(src, target, strategy)
		this.electron(src, target, strategy)
		this.pwa(src, target, strategy)
		this.spa(src, target, strategy)
	},
	/**
	 * Creates a set of images
	 * @param {string} src - image location
	 * @param {string} target - where to drop the images
	 * @param {string} options - js object that defines path and sizes
	 */
	build: function (src, target, options) {
		checkSrc(src)
		checkTgt(target)
		const sharp = require('sharp')
		const image = sharp(src)
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
				const dest = `${target}/${options[type].folder}`
				if (options[type].infix === true) {
					output = `${dest}/${options[type].prefix}${size}x${size}${options[type].suffix}`
				} else {
					output = `${dest}/${options[type].prefix}${options[type].suffix}`
				}
				// console.log('p1', output, size)
				let pvar = [output, size]
				chain = chain.then(() => buildify(pvar))
			})
		}
		return chain
	},

	minify: function (target, options, strategy, singlefile) {
		const imagemin = require('imagemin')
		let cmd, pvar
		let minify = settings.options.minify
		if ( !minify.available.find(x => x === strategy,)) {
			strategy = minify.type
		}
		switch(strategy) {
			case 'pngcrush':
				const pngcrush = require('imagemin-pngcrush')
				cmd = pngcrush(minify.pngcrushOptions)
				break
			case 'pngquant':
				const pngquant = require('imagemin-pngquant')
				cmd = pngquant(minify.pngquantOptions)
				break
			case 'optipng':
				const optipng = require('imagemin-optipng')
				cmd = optipng(minify.optipngOptions)
				break
			case 'pngout':
				const pngout = require('imagemin-pngout')
				cmd = pngout(minify.pngoutOptions)
				break
			case 'zopfli':
				const zopfli = require('imagemin-zopfli')
				cmd = zopfli(minify.zopfliOptions)
				break
		}

		const minifier = (pvar) => new Promise((resolve, reject) => {
			console.log(pvar[0],pvar[1])
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

		if (!singlefile) {
			// for the batch operation
			let input, output
			// put unique folder names in an array
			let folders = uniqueFolders(options)
			for (let n in folders) {
				chain = chain.then(() => minifier([`${target}/${folders[n]}/*.png`,`${target}/${folders[n]}`]))
			}
		} else {
			chain = chain.then(() => minifier([target, path.dirname(target)]))
		}
		return chain
	},
	icns: function (src, target, options) {

		// to make these smaller, we need to pngcrush it

		const png2icons = require('png2icons')

		mkdirpAsync(`${target}/electron`)
		.then(() => {
			let input = fs.readFileSync(src)
			let out = png2icons.createICNS(input, png2icons.BICUBIC, 0)
			fs.writeFileSync(`${target}/electron/icon.icns`, out)

			out = png2icons.createICO(input, png2icons.BICUBIC, 0, false)
			fs.writeFileSync(`${target}/electron/icon.ico`, out)
			})

	}
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = iconfactory
  }
  exports.iconfactory = iconfactory
}