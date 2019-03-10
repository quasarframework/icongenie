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
      folder: `${mode}/icons`,
      prefix: 'favicon-',
      infix: true,
      suffix: '.png',
      sizes: [16, 32]
    },
    icons: {
      folder: `${mode}/icons`,
      prefix: 'icon-',
      infix: true,
      suffix: '.png',
      sizes: [128, 192, 256, 384, 512]
    },
    quasar: {
      folder: mode,
      prefix: 'quasar-logo',
      infix: false,
      suffix: '.png',
      sizes: [128]
    }
  }
}

const mapOptions = function () {
  return {
    spa: mapIcons('spa'),
    pwa: {
      ...mapIcons('pwa'),
      apple: {
        folder: 'pwa/icons',
        prefix: 'apple-icon-',
        infix: true,
        suffix: '.png',
        sizes: [152]
      },
      windows: {
        folder: 'pwa/icons',
        prefix: 'ms-icon-',
        infix: true,
        suffix: '.png',
        sizes: [144]
      }
    },
    cordova: {
      android_ldpi: {
        folder: 'cordova/android',
        prefix: 'ldpi',
        infix: false,
        suffix: '.png',
        sizes: [36]
      },
      android_mdpi: {
        folder: 'cordova/android',
        prefix: 'mdpi',
        infix: false,
        suffix: '.png',
        sizes: [48]
      },
      android_hdpi: {
        folder: 'cordova/android',
        prefix: 'hdpi',
        infix: false,
        suffix: '.png',
        sizes: [72]
      },
      android_xhdpi: {
        folder: 'cordova/android',
        prefix: 'xhdpi',
        infix: false,
        suffix: '.png',
        sizes: [96]
      },
      android_xxhdpi: {
        folder: 'cordova/android',
        prefix: 'xxhdpi',
        infix: false,
        suffix: '.png',
        sizes: [144]
      },
      android_xxxhdpi: {
        folder: 'cordova/android',
        prefix: 'xxxhdpi',
        infix: false,
        suffix: '.png',
        sizes: [192]
      },
      ios_adhoc_app_store_ios: {
        // iOS 7+
        folder: 'cordova/ios',
        prefix: 'icon-1024',
        infix: false,
        suffix: '.png',
        sizes: [1024]
      },
      ios_watch_appicon40: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon40x40@2x',
        infix: false,
        suffix: '.png',
        sizes: [80]
      },
      ios_watch_appicon44: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon44x44@2x',
        infix: false,
        suffix: '.png',
        sizes: [88]
      },
      ios_watch_appicon86: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon86x86@2x',
        infix: false,
        suffix: '.png',
        sizes: [172]
      },
      ios_watch_appicon98: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon98x98@2x',
        infix: false,
        suffix: '.png',
        sizes: [196]
      },
      ios_watch_appicon24: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon24x24@2x',
        infix: false,
        suffix: '.png',
        sizes: [48]
      },
      ios_watch_appicon27: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon27.5x27.5@2x',
        infix: false,
        suffix: '.png',
        sizes: [55]
      },
      ios_watch_appicon29: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon29x29@2x',
        infix: false,
        suffix: '.png',
        sizes: [58]
      },
      ios_watch_appicon29x3: {
        // iOS Watch
        folder: 'cordova/ios',
        prefix: 'AppIcon29x29@3x',
        infix: false,
        suffix: '.png',
        sizes: [87]
      },
      ios_icon60: {
        // iOS 7+
        folder: 'cordova/ios',
        prefix: 'icon-60',
        infix: false,
        suffix: '.png',
        sizes: [60]
      },
      ios_icon60_2x: {
        // iOS 7+
        folder: 'cordova/ios',
        prefix: 'icon-60@2x',
        infix: false,
        suffix: '.png',
        sizes: [120]
      },
      ios_icon60_3x: {
        // iOS 8+
        folder: 'cordova/ios',
        prefix: 'icon-60@3x',
        infix: false,
        suffix: '.png',
        sizes: [180]
      },
      ios_icon76: {
        // iPad
        folder: 'cordova/ios',
        prefix: 'icon-76',
        infix: false,
        suffix: '.png',
        sizes: [76]
      },
      ios_icon76_2x: {
        // iPad
        folder: 'cordova/ios',
        prefix: 'icon-76@2x',
        infix: false,
        suffix: '.png',
        sizes: [152]
      },
      ios_icon20: {
        // iPad notification icon
        folder: 'cordova/ios',
        prefix: 'icon-20',
        infix: false,
        suffix: '.png',
        sizes: [20]
      },
      ios_icon40: {
        // Spotlight Icon
        folder: 'cordova/ios',
        prefix: 'icon-40',
        infix: false,
        suffix: '.png',
        sizes: [40]
      },
      ios_icon40_2x: {
        // Spotlight Icon
        folder: 'cordova/ios',
        prefix: 'icon-40@2x',
        infix: false,
        suffix: '.png',
        sizes: [80]
      },
      ios_icon: {
        // iPhone / iPod Touch
        folder: 'cordova/ios',
        prefix: 'icon',
        infix: false,
        suffix: '.png',
        sizes: [57]
      },
      ios_icon_2x: {
        // iPhone / iPod Touch
        folder: 'cordova/ios',
        prefix: 'icon@2x',
        infix: false,
        suffix: '.png',
        sizes: [114]
      },
      ios_icon_72: {
        // iPad
        folder: 'cordova/ios',
        prefix: 'icon-72',
        infix: false,
        suffix: '.png',
        sizes: [72]
      },
      ios_icon_72_2x: {
        // iPad
        folder: 'cordova/ios',
        prefix: 'icon-72@2x',
        infix: false,
        suffix: '.png',
        sizes: [144]
      },
      ios_icon_small: {
        // iPhone Spotlight and Settings
        folder: 'cordova/ios',
        prefix: 'icon-small',
        infix: false,
        suffix: '.png',
        sizes: [29]
      },
      ios_icon_small_2x: {
        // iPhone Spotlight and Settings
        folder: 'cordova/ios',
        prefix: 'icon-small@2x',
        infix: false,
        suffix: '.png',
        sizes: [58]
      },
      ios_icon_small_3x: {
        // iPhone Spotlight and Settings
        folder: 'cordova/ios',
        prefix: 'icon-small@3x',
        infix: false,
        suffix: '.png',
        sizes: [87]
      },
      ios_icon_50: {
        // iPad Spotlight & Settings
        folder: 'cordova/ios',
        prefix: 'icon-50',
        infix: false,
        suffix: '.png',
        sizes: [50]
      },
      ios_icon_50_2x: {
        // iPad Spotlight & Settings
        folder: 'cordova/ios',
        prefix: 'icon-50@2x',
        infix: false,
        suffix: '.png',
        sizes: [100]
      },
      ios_icon_167: {
        // iPad Pro
        folder: 'cordova/ios',
        prefix: 'icon-167',
        infix: false,
        suffix: '.png',
        sizes: [167]
      },
      ios_icon_167_halved: {
        // iPad Pro
        folder: 'cordova/ios',
        prefix: 'icon-83.5@2x',
        infix: false,
        suffix: '.png',
        sizes: [167]
      },
      win_storelogo: {
        folder: 'cordova/windows',
        prefix: 'StoreLogo',
        infix: false,
        suffix: '.png',
        sizes: [50]
      },
      win_smalllogo: {
        folder: 'cordova/windows',
        prefix: 'SmallLogo',
        infix: false,
        suffix: '.png',
        sizes: [30]
      },
      win_squarelogo: {
        folder: 'cordova/windows',
        prefix: 'Square',
        infix: true,
        suffix: 'Logo.png',
        sizes: [30, 44, 70, 71, 89, 107, 142, 150, 284, 310]
      },
      win_tile_48: {
        folder: 'cordova/windows',
        prefix: 'Square48x48Logo',
        infix: false,
        suffix: '.png',
        sizes: [48]
      },
      win_tile_62: {
        folder: 'cordova/windows',
        prefix: 'Square62x62Logo',
        infix: false,
        suffix: '.png',
        sizes: [62]
      },
      win_tile_173: {
        folder: 'cordova/windows',
        prefix: 'Square173x173Logo',
        infix: false,
        suffix: '.png',
        sizes: [173]
      },
      win_small_tile_71: {
        folder: 'cordova/windows',
        prefix: 'Square71x71Logo.',
        infix: false,
        suffix: 'scale-100.png',
        sizes: [71]
      },
      win_small_tile_125: {
        folder: 'cordova/windows',
        prefix: 'Square71x71Logo.',
        infix: false,
        suffix: 'scale-125.png',
        sizes: [89]
      },
      win_small_tile_150: {
        folder: 'cordova/windows',
        prefix: 'Square71x71Logo.',
        infix: false,
        suffix: 'scale-150.png',
        sizes: [107]
      },
      win_small_tile_200: {
        folder: 'cordova/windows',
        prefix: 'Square71x71Logo.',
        infix: false,
        suffix: 'scale-200.png',
        sizes: [142]
      },
      win_small_tile_400: {
        folder: 'cordova/windows',
        prefix: 'Square71x71Logo.',
        infix: false,
        suffix: 'scale-400.png',
        sizes: [284]
      },
      win_medium_tile_100: {
        folder: 'cordova/windows',
        prefix: 'Square150x150Logo.',
        infix: false,
        suffix: 'scale-100.png',
        sizes: [150]
      },
      win_medium_tile_125: {
        folder: 'cordova/windows',
        prefix: 'Square150x150Logo.',
        infix: false,
        suffix: 'scale-125.png',
        sizes: [188]
      },
      win_medium_tile_150: {
        folder: 'cordova/windows',
        prefix: 'Square150x150Logo.',
        infix: false,
        suffix: 'scale-150.png',
        sizes: [225]
      },
      win_medium_tile_200: {
        folder: 'cordova/windows',
        prefix: 'Square150x150Logo.',
        infix: false,
        suffix: 'scale-200.png',
        sizes: [300]
      },
      win_medium_tile_400: {
        folder: 'cordova/windows',
        prefix: 'Square150x150Logo.',
        infix: false,
        suffix: 'scale-400.png',
        sizes: [600]
      },
      win_large_tile_100: {
        folder: 'cordova/windows',
        prefix: 'Square310x310Logo.',
        infix: false,
        suffix: 'scale-100.png',
        sizes: [310]
      },
      win_large_tile_125: {
        folder: 'cordova/windows',
        prefix: 'Square310x310Logo.',
        infix: false,
        suffix: 'scale-125.png',
        sizes: [388]
      },
      win_large_tile_150: {
        folder: 'cordova/windows',
        prefix: 'Square310x310Logo.',
        infix: false,
        suffix: 'scale-150.png',
        sizes: [465]
      },
      win_large_tile_200: {
        folder: 'cordova/windows',
        prefix: 'Square310x310Logo.',
        infix: false,
        suffix: 'scale-200.png',
        sizes: [620]
      },
      win_large_tile_400: {
        folder: 'cordova/windows',
        prefix: 'Square310x310Logo.',
        infix: false,
        suffix: 'scale-400.png',
        sizes: [1240]
      },
      win_applist_tile_100: {
        folder: 'cordova/windows',
        prefix: 'Square44x44Logo.',
        infix: false,
        suffix: 'scale-100.png',
        sizes: [44]
      },
      win_applist_tile_125: {
        folder: 'cordova/windows',
        prefix: 'Square44x44Logo.',
        infix: false,
        suffix: 'scale-125.png',
        sizes: [55]
      },
      win_applist_tile_150: {
        folder: 'cordova/windows',
        prefix: 'Square44x44Logo.',
        infix: false,
        suffix: 'scale-150.png',
        sizes: [66]
      },
      win_applist_tile_200: {
        folder: 'cordova/windows',
        prefix: 'Square44x44Logo.',
        infix: false,
        suffix: 'scale-200.png',
        sizes: [88]
      },
      win_applist_tile_400: {
        folder: 'cordova/windows',
        prefix: 'Square44x44Logo.',
        infix: false,
        suffix: 'scale-400.png',
        sizes: [176]
      },
      android_ldpi_screen_portrait: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'ldpi-screen-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[200, 320]]
      },
      android_ldpi_screen_landscape: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'ldpi-screen-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[320, 200]]
      },
      android_mdpi_screen_portrait: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'mdpi-screen-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[320, 480]]
      },
      android_mdpi_screen_landscape: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'mdpi-screen-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[480, 320]]
      },
      android_hdpi_screen_portrait: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'hdpi-screen-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[480, 800]]
      },
      android_hdpi_screen_landscape: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'hdpi-screen-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[800, 480]]
      },
      android_xhdpi_screen_portrait: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'xhdpi-screen-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[720, 1280]]
      },
      android_xhdpi_screen_landscape: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'xhdpi-screen-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[1280, 720]]
      },
      android_xxhdpi_screen_portrait: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'xxhdpi-screen-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[960, 1600]]
      },
      android_xxhdpi_screen_landscape: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'xxhdpi-screen-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[1600, 960]]
      },
      android_xxxhdpi_screen_portrait: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'xxxhdpi-screen-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[1280, 1920]]
      },
      android_xxxhdpi_screen_landscape: {
        splash: true,
        folder: 'cordova/android',
        prefix: 'xxxhdpi-screen-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[1920, 1280]]
      },
      ios_screen_ipad_landscape_2x: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-ipad-landscape-2x',
        infix: false,
        suffix: '.png',
        sizes: [[2048, 1536]]
      },
      ios_screen_ipad_landscape: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-ipad-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[1024, 768]]
      },
      ios_screen_ipad_portrait_2x: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-ipad-portrait-2x',
        infix: false,
        suffix: '.png',
        sizes: [[1536, 2048]]
      },
      ios_screen_ipad_portrait: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-ipad-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[768, 1024]]
      },
      ios_screen_iphone_landscape_2x: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-iphone-landscape-2x',
        infix: false,
        suffix: '.png',
        sizes: [[960, 640]]
      },
      ios_screen_iphone_landscape: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-iphone-landscape',
        infix: false,
        suffix: '.png',
        sizes: [[480, 320]]
      },
      ios_screen_iphone_portrait_2x: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-iphone-portrait-2x',
        infix: false,
        suffix: '.png',
        sizes: [[640, 960]]
      },
      ios_screen_iphone_portrait_568h_2x: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-iphone-portrait-568h-2x',
        infix: false,
        suffix: '.png',
        sizes: [[640, 1136]]
      },
      ios_screen_iphone_portrait: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'screen-iphone-portrait',
        infix: false,
        suffix: '.png',
        sizes: [[320, 480]]
      },
      win_splashscreen_480x800: {
        splash: true,
        folder: 'cordova/windows',
        prefix: 'Splashscreen-480x800',
        infix: false,
        suffix: '.png',
        sizes: [[480, 800]]
      },
      win_splashscreen_620x300: {
        splash: true,
        folder: 'cordova/windows',
        prefix: 'Splashscreen-620x300',
        infix: false,
        suffix: '.png',
        sizes: [[620, 300]]
      },
      win_splashscreen_868x420: {
        splash: true,
        folder: 'cordova/windows',
        prefix: 'Splashscreen-868x420',
        infix: false,
        suffix: '.png',
        sizes: [[868, 420]]
      },
      win_splashscreen_1116x540: {
        splash: true,
        folder: 'cordova/windows',
        prefix: 'Splashscreen-1116x540',
        infix: false,
        suffix: '.png',
        sizes: [[1116, 540]]
      },
      universal: {
        splash: true,
        folder: 'cordova/ios',
        prefix: 'Default@2x~universal',
        infix: false,
        suffix: '.png',
        sizes: [[2732, 2732]]
      }
    },
    electron: {
      defaults: {
        folder: 'electron',
        prefix: 'icon',
        infix: false,
        suffix: '.png',
        sizes: [512]
      },
      appx_logo: {
        folder: 'electron',
        prefix: 'StoreLogo',
        infix: false,
        suffix: '.png',
        sizes: [50]
      },
      appx_square: {
        folder: 'electron',
        prefix: 'Square',
        infix: true,
        suffix: 'Logo.png',
        sizes: [30, 44, 71, 89, 107, 142, 150, 284, 310]
      },
      linux: {
        folder: 'electron',
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
  let settings = {
    source: {
      dev: await computeHash(prompts.source_dev, 'md5', prompts.minify_dev),
      build: await computeHash(prompts.source_build, 'md5', prompts.minify_build)
    },
    target: {
      spa: {},
      pwa: {},
      cordova: {},
      electron: {}
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
