const fs = require('fs-extra')
const iconfactory = require('../lib/index.js')
const { validatePng, computeHash, createConfig } = require('./utils')

const copy = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.copy(src, dest, { overwrite: true }, err => err ? reject(err) : resolve())
  })
}

const copyFiles = async (target, modeName, retries = 0) => {
  switch (modeName) {
    case 'spa':
      await copy(target + '/spa/icon-16x16.png', './src/statics/icons/favicon-16x16.png')
      await copy(target + '/spa/icon-32x32.png', './src/statics/icons/favicon-32x32.png')

      // since pwa mode create a spa folder, so there is a chance of the spa folder didn't have all need icons.
      var root = fs.existsSync(target + '/spa/icon-128x128.png') ? '/spa/' : '/pwa/generic-'
      await copy(target + root + 'icon-128x128.png', './src/statics/quasar-logo.png')
      await copy(target + root + 'icon-128x128.png', './src/statics/icons/icon-128x128.png')
      await copy(target + root + 'icon-192x192.png', './src/statics/icons/icon-192x192.png')
      await copy(target + root + 'icon-256x256.png', './src/statics/icons/icon-256x256.png')
      await copy(target + root + 'icon-384x384.png', './src/statics/icons/icon-384x384.png')
      await copy(target + root + 'icon-512x512.png', './src/statics/icons/icon-512x512.png')  
      break;
    case 'pwa':
      await copy(target + '/spa/icon-16x16.png', './src/statics/icons/favicon-16x16.png')
      await copy(target + '/spa/icon-32x32.png', './src/statics/icons/favicon-32x32.png')

      await copy(target + '/pwa/generic-icon-128x128.png', './src/statics/quasar-logo.png')
      await copy(target + '/pwa/generic-icon-128x128.png', './src/statics/icons/icon-128x128.png')
      await copy(target + '/pwa/generic-icon-192x192.png', './src/statics/icons/icon-192x192.png')
      await copy(target + '/pwa/generic-icon-256x256.png', './src/statics/icons/icon-256x256.png')
      await copy(target + '/pwa/generic-icon-384x384.png', './src/statics/icons/icon-384x384.png')
      await copy(target + '/pwa/generic-icon-512x512.png', './src/statics/icons/icon-512x512.png')

      await copy(target + '/pwa/ms-icon-144x144.png', './src/statics/icons/ms-icon-144x144.png')
      await copy(target + '/pwa/apple-icon-152x152.png', './src/statics/icons/apple-icon-152x152.png')
      break;
    case 'electron':
      await copy(target + '/electron', './src-electron/icons')
      // await copy(target + '/electron/icon.icns', './src-electron/icons/icon.icns')
      // await copy(target + '/electron/icon.ico', './src-electron/icons/icon.ico')
      // await copy(target + '/electron/icon.png', './src-electron/icons/icon.png')
      // await copy(target + '/electron/linux-512x512', './src-electron/icons/linux-512x512')
      break;
    case 'cordova':
      await copy(target + '/cordova/android/ldpi.png', './src-cordova/res/icon/android/icon-36-ldpi.png')
      await copy(target + '/cordova/android/mdpi.png', './src-cordova/res/icon/android/icon-48-mdpi.png')
      await copy(target + '/cordova/android/hdpi.png', './src-cordova/res/icon/android/icon-72-hdpi.png')
      await copy(target + '/cordova/android/xhdpi.png', './src-cordova/res/icon/android/icon-96-xhdpi.png')
      await copy(target + '/cordova/android/xxhdpi.png', './src-cordova/res/icon/android/icon-144-xxhdpi.png')
      await copy(target + '/cordova/android/xxxhdpi.png', './src-cordova/res/icon/android/icon-192-xxxhdpi.png')

      await copy(target + '/cordova/ios/icon@2x.png', './src-cordova/res/icon/ios/icon-57-2x.png')
      await copy(target + '/cordova/ios/icon.png', './src-cordova/res/icon/ios/icon-57.png')
      await copy(target + '/cordova/ios/icon-40@2x.png', './src-cordova/res/icon/ios/icon-40-2x.png')
      await copy(target + '/cordova/ios/icon-40.png', './src-cordova/res/icon/ios/icon-40.png')
      await copy(target + '/cordova/ios/icon-50@2x.png', './src-cordova/res/icon/ios/icon-50-2x.png')
      await copy(target + '/cordova/ios/icon-50.png', './src-cordova/res/icon/ios/icon-50.png')
      await copy(target + '/cordova/ios/icon-60@3x.png', './src-cordova/res/icon/ios/icon-60-3x.png')
      await copy(target + '/cordova/ios/icon-60@2x.png', './src-cordova/res/icon/ios/icon-60-2x.png')
      await copy(target + '/cordova/ios/icon-60.png', './src-cordova/res/icon/ios/icon-60.png')
      await copy(target + '/cordova/ios/icon-72@2x.png', './src-cordova/res/icon/ios/icon-72-2x.png')
      await copy(target + '/cordova/ios/icon-72.png', './src-cordova/res/icon/ios/icon-72.png')
      await copy(target + '/cordova/ios/icon-76@2x.png', './src-cordova/res/icon/ios/icon-76-2x.png')
      await copy(target + '/cordova/ios/icon-76.png', './src-cordova/res/icon/ios/icon-76.png')
      await copy(target + '/cordova/ios/icon-83.5@2x.png', './src-cordova/res/icon/ios/icon-83.5-2x.png')
      await copy(target + '/cordova/ios/icon-167.png', './src-cordova/res/icon/ios/icon-167.png')
      await copy(target + '/cordova/ios/icon-1024.png', './src-cordova/res/icon/ios/icon-1024.png')

      await copy(target + '/cordova/windows/Square48x48Logo.png', './src-cordova/res/icon/windows-phone/icon-48.png')
      await copy(target + '/cordova/windows/Square62x62Logo.png', './src-cordova/res/icon/windows-phone/icon-62-tile.png')
      await copy(target + '/cordova/windows/Square173x173Logo.png', './src-cordova/res/icon/windows-phone/icon-173-tile.png')

      await copy(target + '/cordova/android/hdpi-screen-landscape.png', './src-cordova/res/screen/android/screen-hdpi-landscape.png')
      await copy(target + '/cordova/android/hdpi-screen-portrait.png', './src-cordova/res/screen/android/screen-hdpi-portrait.png')
      await copy(target + '/cordova/android/ldpi-screen-landscape.png', './src-cordova/res/screen/android/screen-ldpi-landscape.png')
      await copy(target + '/cordova/android/ldpi-screen-portrait.png', './src-cordova/res/screen/android/screen-ldpi-portrait.png')
      await copy(target + '/cordova/android/mdpi-screen-landscape.png', './src-cordova/res/screen/android/screen-mdpi-landscape.png')
      await copy(target + '/cordova/android/mdpi-screen-portrait.png', './src-cordova/res/screen/android/screen-mdpi-portrait.png')
      await copy(target + '/cordova/android/xhdpi-screen-landscape.png', './src-cordova/res/screen/android/screen-xhdpi-landscape.png')
      await copy(target + '/cordova/android/xhdpi-screen-portrait.png', './src-cordova/res/screen/android/screen-xhdpi-portrait.png')
      await copy(target + '/cordova/android/xxhdpi-screen-landscape.png', './src-cordova/res/screen/android/screen-xxhdpi-landscape.png')
      await copy(target + '/cordova/android/xxhdpi-screen-portrait.png', './src-cordova/res/screen/android/screen-xxhdpi-portrait.png')
      await copy(target + '/cordova/android/xxxhdpi-screen-landscape.png', './src-cordova/res/screen/android/screen-xxxhdpi-landscape.png')
      await copy(target + '/cordova/android/xxxhdpi-screen-portrait.png', './src-cordova/res/screen/android/screen-xxxhdpi-portrait.png')

      await copy(target + '/cordova/ios/screen-ipad-landscape-2x.png', './src-cordova/res/screen/ios/screen-ipad-landscape-2x.png')
      await copy(target + '/cordova/ios/screen-ipad-landscape.png', './src-cordova/res/screen/ios/screen-ipad-landscape.png')
      await copy(target + '/cordova/ios/screen-ipad-portrait-2x.png', './src-cordova/res/screen/ios/screen-ipad-portrait-2x.png')
      await copy(target + '/cordova/ios/screen-ipad-portrait.png', './src-cordova/res/screen/ios/screen-ipad-portrait.png')
      await copy(target + '/cordova/ios/screen-iphone-landscape-2x.png', './src-cordova/res/screen/ios/screen-iphone-landscape-2x.png')
      await copy(target + '/cordova/ios/screen-iphone-landscape.png', './src-cordova/res/screen/ios/screen-iphone-landscape.png')
      await copy(target + '/cordova/ios/screen-iphone-portrait-2x.png', './src-cordova/res/screen/ios/screen-iphone-portrait-2x.png')
      await copy(target + '/cordova/ios/screen-iphone-portrait-568h-2x.png', './src-cordova/res/screen/ios/screen-iphone-portrait-568h-2x.png')
      await copy(target + '/cordova/ios/screen-iphone-portrait.png', './src-cordova/res/screen/ios/screen-iphone-portrait.png')

      await copy(target + '/cordova/windows/Splashscreen-480x800.png', './src-cordova/res/screen/windows-phone/screen-portrait.png')
      break;
  }
}

const initilize = async function (api, ctx, config) {
  let mode, source, minify, iconConfig, hash
  if (ctx.dev) {
    mode = 'dev'
    source = api.prompts.source_dev
    minify = api.prompts.minify_dev
  } else {
    mode = 'build'
    source = api.prompts.source_build
    minify = api.prompts.minify_build
  }
  
  let modeName = ctx.modeName
  if (modeName == 'ssr') {
    modeName = config.ssr.pwa ? 'pwa' : 'spa'
  }

  let target = './icon-factory/' + mode
  let processImagess = async function () {
    await iconfactory[modeName](source, target, minify)
    iconConfig.source[mode] = hash
    iconConfig.target[modeName][mode] = hash
    fs.writeFile(configFileName, JSON.stringify(iconConfig, null, 2), (err) => {
      if (err) throw err
    })
  }

  let configFileName = './quasar.icon-factory.json'
  await validatePng(source)
  if (fs.existsSync(configFileName)) {
    iconConfig = await new Promise(resolve => {
      fs.readFile(configFileName, "utf8", (err, data) => {
        let _config = JSON.parse(data)
        resolve(_config)
      })
    })
  } else {
    iconConfig = await createConfig(api.prompts)
  }

  hash = await computeHash(source, 'md5', minify)
  fs.ensureDirSync(target)
  if (!fs.existsSync(target + '/' + modeName)) {
    await processImagess()
  } else if (iconConfig.source[mode] !== hash) {
    await processImagess()
  } else if (iconConfig.target[modeName][mode] !== hash) {
    await processImagess()
  }

  await copyFiles(target, modeName, 0)
  // TODO: move icons to the correct place
}

module.exports = function (api, ctx) {
  // TODO: check if ssr is on pwa mode without extend quasar conf.
  api.extendQuasarConf(async (config) => {
    await initilize(api, ctx, config)
  })
}
