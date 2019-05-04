const iconfactory = require('../lib/index.js')
const { copy, ensureDir, existsSync, readFileSync, writeFileSync } = require('fs-extra')
// const fs = require('fs-extra')
const { validatePng, computeHash, getConfig, saveConfig, validateHexRGB } = require('./utils')
const useIntermediateFolders = false
const et = require('elementtree')

/**
 * copy files from the intermediate folder to the your final destination
 * @param  {string} target the location of the intermediate folder
 * @param  {string} modeName the mode than quasar cli is running (eg: `spa`, `pwa`, `electron`, `cordova`)
 * @returns {undefined}
 */
const copyFiles = async (target, modeName) => {
  switch (modeName) {
    case 'spa':
    case 'pwa':
      await copy(target, './src/statics')
      break
    case 'electron':
      await copy(target, './src-electron/icons')
      break;
    case 'cordova':
      await copy(target, './src-cordova/res')
      break
  }
}

/**
 * create
 *
 * @param nodes
 * @returns {Promise<void>}
 */
const renderCordovaConfig = async function (nodes, ) {

}

/**
 * configuring the icon factory extension
 * @param {Object} api the IndexAPI object
 * @param {Object} config quasar.config.js
 * @returns {undefined}
 */
const initialize = async function (api, config) {
  let mode, source, minify, iconConfig, hash
  if (api.ctx.dev) {
    mode = 'dev'
    source = api.prompts.source_dev
    minify = api.prompts.minify_dev
  } else {
    mode = 'build'
    source = api.prompts.source_build
    minify = api.prompts.minify_build
  }

  let modeName = api.ctx.modeName
  if (modeName === 'ssr') {
    modeName = config.ssr.pwa ? 'pwa' : 'spa'
  }
  if (modeName === 'cordova') {
    // detect if plugin exists
    // cordova plugin add cordova-plugin-splashscreen
    let filePath = api.resolve.cordova('config.xml')
    const doc = et.parse(readFileSync(filePath, 'utf-8'))
    const root = doc.getroot()

    const plugins = root.findall('plugin')

    if (plugins.find(node => node.attrib.name ===
      'cordova-plugin-splashscreen')) {

      const android = root.find('platform[@name="android"]')
      const ios = root.find('platform[@name="ios"]')



      if (!android.find('splash[@density="land-hdpi"]')) {
        let splash = et.SubElement(android, 'splash')
        splash.set('density', 'land-hdpi')
        splash.set('src', 'res/screen/android/splash-land-hdpi.png')
      }

      if (!ios.find('splash[@width="320"]')) {
        let splash = et.SubElement(ios, 'splash')
        splash.set('width', '320')
        splash.set('height', '480')
        splash.set('src', 'res/screen/ios/Default~iphone.png')
      }

      // update the config
      // <platform name="android">
      //   <splash src="res/screen/android/splash-land-hdpi.png" density="land-hdpi"/>

      // <platform name="ios">
      //   <splash src="res/screen/ios/Default~iphone.png" width="320" height="480"/>
      //   ...
      //   <splash src="res/screen/ios/Default@2x~universal~anyany.png" />
      const content = doc.write({ indent: 4 })
      writeFileSync(filePath, content, 'utf8')
      console.log('Updated Cordova config.xml')
    } else {
      console.log(`
Splashscreens for Cordova require a Cordova plugin. 
Please go to the src-cordova folder and run:

  $ cordova plugin add cordova-plugin-splashscreen
`)
      process.exit(0)
    }
  }

  let target = ''
  if (useIntermediateFolders) {
    target = './icon-factory/' + mode + '/' + modeName
  } else {
    switch (modeName) {
      case 'spa':
      case 'pwa':
        target = './src/statics'
        break
      case 'electron':
        target = './src-electron/icons'
        break;
      case 'cordova':
        target = './src-cordova/res'
        break
    }
  }

  /**
   * creating the icons in the given target folder.
   * @returns {undefined}s
   */
  let processImages = async function() {
    const options = {
      ...iconConfig.options[modeName],
      background_color: validateHexRGB(iconConfig.options.background_color) ?
        iconConfig.options.background_color : '#000000',
      theme_color: validateHexRGB(iconConfig.options.theme_color) ?
        iconConfig.options.theme_color : '#ffffff'
    }
    await iconfactory[modeName](source, target, minify, options)
    iconConfig.modes[mode].source = hash
    if (useIntermediateFolders) {
      iconConfig.modes[mode].targets[modeName] = hash
    } else {
      iconConfig.targets[modeName] = hash
    }
    saveConfig(iconConfig)
  }

  await validatePng(source)
  iconConfig = await getConfig(api.prompts)
  hash = await computeHash(source, 'md5', minify)
  let targetHash = useIntermediateFolders ?
    iconConfig.modes[mode].targets[modeName] : iconConfig.targets[modeName]
  // async version of exists is deprecated, while access is
  // recommended async method to check if a file exists,
  // that will throw a exception if the file didn't exists,
  // use a try-catch just to check if a file exists

  if (!existsSync(target) || (iconConfig.modes[mode].source !== hash) || (targetHash !== hash)) {
    await ensureDir(target)
    await processImages()
  }
  // should use this for build and dev actually
  // todo: place tmp in module
  if (useIntermediateFolders) {
    await copyFiles(target, modeName, 0)
  }
}

module.exports = function(api) {
  // TODO: check if ssr is on pwa mode without extend quasar conf.
  api.extendQuasarConf(async config => {
    await initialize(api, config)
  })
}
