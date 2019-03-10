const fs = require('fs-extra'),
  deasync = require('deasync'),
  iconfactory = require('../lib/index.js')

const { validatePng, computeHash, getConfig, saveConfig } = require('./utils')

console.log=(function() {
  // log, log, its big its heavy its wood.
  // represent the icon-factory

  let log = console.log
  return function () {
    log.apply(console, arguments)
    process.stdout.write(`★`)
  }
})()

console.log('★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★')
console.log(' [icon-factory] ★ The star means your icons are factory produced ★')
console.log('★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★')

const copy = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.copy(src, dest, { overwrite: true }, err => (err ? reject(err) : resolve()))
  })
}

const copyFiles = async (target, modeName, retries = 0) => {
  switch (modeName) {
    case 'spa':
      await copy(target + '/spa', './src/statics')
      break
    case 'pwa':
      await copy(target + '/pwa', './src/statics')
      break;
    case 'electron':
      await copy(target + '/electron', './src-electron/icons')
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
      break
  }
}

const initialize = async function(api, ctx, config) {
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
  let processImagess = async function() {
    await iconfactory[modeName](source, target, minify, iconConfig.options[modeName])
    iconConfig.source[mode] = hash
    iconConfig.target[modeName][mode] = hash
    saveConfig(iconConfig)
  }

  await validatePng(source)
  iconConfig = await getConfig(api.prompts)
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

module.exports = function(api, ctx) {
  // TODO: check if ssr is on pwa mode without extend quasar conf.
  api.extendQuasarConf(config => {
    let done = false
    initialize(api, ctx, config).then(() => {
      done = true
    })
    deasync.loopWhile(() => !done)
  })
}
