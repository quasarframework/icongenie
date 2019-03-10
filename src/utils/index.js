const fs = require('fs-extra')
const util = require('util')
const isPng = require('is-png')
const crypto = require('crypto')

const fileName = './quasar.icon-factory.json'
const access = util.promisify((file, callback) => {
  fs.access(file, fs.constants.F_OK, callback)
})
const exists = async function (file) {
  try {
    await access(file)
    return true
  } catch (err) {
    return false
  }
}
const writeFile = util.promisify((context, callback) => {
  fs.writeFile(context.file, context.data, callback)
})
const readFile = util.promisify((context, callback) => {
  fs.readFile(context.file, context.encoding, callback)
})

/**
 * validate if the `fileName` is a valid png file.
 * @param  {String} fileName the path to the png file to be validated
 * @returns {Promise<Boolean>} the result of the validation
 */
const validatePng = function (fileName) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(fileName)) {
      return reject('File not found.')
    }

    fs.readFile(fileName, (err, data) => {
      if (err)
        return reject(err.message);
      if (!isPng(data))
        return reject('The selected file is not a valid png.')
      return resolve(true)
    })
  })
}

/**
 * generating the `algorithm` sum of the `fileName`
 * @param  {String} fileName the path to the png file to be validated
 * @param  {String} algorithm algorithm used to generate the hash
 * @param  {String | Buffer} secret the secret used while generating the hash
 * @returns {Promise<String>} the hash of the given file
 */
const computeHash = function (fileName, algorithm, secret) {
  if (!Buffer.isBuffer(secret))
    secret = Buffer.from(secret)
  let hmac = crypto.createHmac(algorithm, secret)
  return validatePng(fileName).then(() => {
    return new Promise(resolve => {
      let stream = fs.ReadStream(fileName)
      stream.on('data', function (data) {
        hmac.update(data)
      })
      stream.on('end', function () {
        let hash = hmac.digest('hex')
        return resolve(hash);
      })
    })
  })
}

const mapIcons = function (mode) {
  return {
    favicon: {
      folder: 'icons',
      prefix: 'favicon-',
      infix: true,
      suffix: '.png',
      sizes: [16, 32]
    },
    icons: {
      folder: 'icons',
      prefix: 'icon-',
      infix: true,
      suffix: '.png',
      sizes: [128, 192, 256, 384, 512]
    },
    quasar: {
      folder: '',
      prefix: 'quasar-logo',
      infix: false,
      suffix: '.png',
      sizes: [128]
    }
  }
}

const mapCordovaIcons = function () {
  let options = {}
  const sizes = {
    landscape: (meta, multiplier) => [meta.x * multiplier, meta.y * multiplier],
    portrait: (meta, multiplier) => [meta.y * multiplier, meta.x * multiplier]
  }

  const androidIcons = {
    'ldpi': 36,
    'mdpi': 48, 
    'hdpi': 72, 
    'xhdpi': 96, 
    'xxhdpi': 144, 
    'xxxhdpi': 192
  }

  const iosIcons = {
    'icon': { size: 57, min: 1, max: 2 }, 
    'icon-40': { size: 40, min: 1, max: 2 }, 
    'icon-50': { size: 50, min: 1, max: 2 }, 
    'icon-60': { size: 60, min: 1, max: 3 }, 
    'icon-72': { size: 72, min: 1, max: 2 }, 
    'icon-83.5': { size: 83.5, min: 2, max: 2 }, 
    'icon-167': { size: 167, min: 1, max: 1 },
    'icon-1024': { size: 1024, min: 1, max: 1 }
  }

  const winIcons = [
    { size: 48, sufix: '' }, 
    { size: 62, sufix: '-tile' }, 
    { size: 173, sufix: '-tile' }
  ]

  const androidScreens = {
    'ldpi': { x: 320, y: 200 }, 
    'mdpi': { x: 480, y: 320 }, 
    'hdpi': { x: 800, y: 480 }, 
    'xhdpi': { x: 1280, y: 720 }, 
    'xxhdpi': { x: 1600, y: 960 }, 
    'xxxhdpi': { x: 1920, y: 1280 }
  }

  const iosScreens = {
    'ipad': { x: 1024, y: 768, min: 1, max: 2 }, 
    'iphone': { x: 480, y: 320, min: 1, max: 2 }
  }

  for (let key in androidIcons) {
    let size = androidIcons[key]
    options[`android_icon_${key}`] = {
      folder: 'icon/android',
      prefix: `icon-${size}-${key}`,
      infix: false,
      suffix: '.png',
      sizes: [size]
    }
  }

  for (let key in iosIcons) {
    let meta = iosIcons[key]
    for (let multiplier = meta.min; multiplier <= meta.max; multiplier++) {
      let name = multiplier > 1 ? `ios_icon_${meta.size}_x${multiplier}` : `ios_icon_${meta.size}`
      options[name] = {
        folder: 'icon/ios',
        prefix: multiplier > 1 ? `${key}-${multiplier}x`: `${key}`,
        infix: false,
        suffix: '.png',
        sizes: [meta.size * multiplier]
      }
    }
  }

  for (let index in winIcons) {
    let meta = winIcons[index]
    options[`win_icon_${meta.size}`] = {
      folder: 'icon/windows-phone',
      prefix: `icon-${meta.size}${meta.sufix}`,
      infix: false,
      suffix: '.png',
      sizes: [meta.size]
    }
  }

  for (let key in androidScreens) {
    let meta = androidScreens[key]
    for (let size in sizes) {
      options[`android_screen_${key}_${size}`] = {
        splash: true,
        folder: 'screen/android',
        prefix: `screen-${key}-${size}`,
        infix: false,
        suffix: '.png',
        sizes: [sizes[size](meta, 1)]
      }
    }
  }

  for (let key in iosScreens) {
    let meta = iosScreens[key]
    for (let size in sizes) {
      for (let multiplier = meta.min; multiplier <= meta.max; multiplier++) {
        let name = multiplier > 1 ? `ios_screen_${key}_${size}_x${multiplier}` : `ios_screen_${key}_${size}`
        options[name] = {
          splash: true,
          folder: 'screen/ios',
          prefix: multiplier > 1 ? `screen-${key}-${size}-${multiplier}x` : `screen-${key}-${size}`,
          infix: false,
          suffix: '.png',
          sizes: [sizes[size](meta, multiplier)]
        }
      }
    }
  }

  options['ios_screen_iphone_portrait_568h_2x'] = {
    splash: true,
    folder: 'screen/ios',
    prefix: 'screen-iphone-portrait-568h_2x',
    infix: false,
    suffix: '.png',
    sizes: [[640, 1136]]
  }

  options['win_screen'] = {
    splash: true,
    folder: 'screen/windows-phone',
    prefix: 'screen-portrait',
    infix: false,
    suffix: '.png',
    sizes: [[480, 800]]
  }

  return options
}

const mapOptions = function () {
  return {
    spa: mapIcons(),
    pwa: {
      ...mapIcons(),
      apple: {
        folder: 'icons',
        prefix: 'apple-icon-',
        infix: true,
        suffix: '.png',
        sizes: [152]
      },
      windows: {
        folder: 'icons',
        prefix: 'ms-icon-',
        infix: true,
        suffix: '.png',
        sizes: [144]
      }
    },
    cordova: mapCordovaIcons(),
    electron: {
      defaults: {
        folder: '',
        prefix: 'icon',
        infix: false,
        suffix: '.png',
        sizes: [512]
      },
      appx_logo: {
        folder: '',
        prefix: 'StoreLogo',
        infix: false,
        suffix: '.png',
        sizes: [50]
      },
      appx_square: {
        folder: '',
        prefix: 'Square',
        infix: true,
        suffix: 'Logo.png',
        sizes: [30, 44, 71, 89, 107, 142, 150, 284, 310]
      },
      linux: {
        folder: '',
        prefix: 'linux-',
        infix: true,
        suffix: '.png',
        sizes: [512, 128, 96, 64, 48, 32, 24, 16]
      }
    },
  }
}

const saveConfig = async function (settings) {
  await writeFile({ file: fileName, data: JSON.stringify(settings, null, 2) })
}

/**
 * create the json file who will hold the hash of the generated icons
 * @param  {Object} prompts a object with the answers given by the user while inquired
 * @returns {Promise<Object>} a object who hold the hash of the generated icons
 */
const createConfig = async function (prompts) {
  var modes = { dev: null, build: null }
  for (var key in modes) {
    modes[key] = {
      source: await computeHash(prompts['source_' + key], 'md5', prompts['minify_' + key]),
      targets: {
        spa: null,
        pwa: null,
        cordova: null,
        electron: null
      }
    }
  }

  let settings = {
    modes: modes,
    targets: {
      spa: null,
      pwa: null,
      cordova: null,
      electron: null
    },
    options: mapOptions()
  }

  await saveConfig(settings)
  return settings
}

const getConfig = async function (prompts) {
  if (await exists(fileName)) {
    let data = await readFile({ file: fileName, encoding: 'utf8' })
    let settings = JSON.parse(data)
    if (!settings.options) {
      settings.options = mapOptions()
      await saveConfig(settings)
    }
    return settings
  } else {
    return createConfig(prompts)
  }
}

exports.validatePng = validatePng
exports.computeHash = computeHash
exports.createConfig = createConfig
exports.saveConfig = saveConfig
exports.getConfig = getConfig
