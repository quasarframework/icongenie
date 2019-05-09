const iconfactory = require('../lib/index.js')
const execa = require('execa')
const settings = require('../lib/settings')
const { copy, ensureDir, existsSync, readFileSync, writeFileSync } = require('fs-extra')
// const fs = require('fs-extra')
const { validatePng, computeHash, getConfig, saveConfig, validateHexRGB } = require('./utils')
const useIntermediateFolders = true
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
 * update Cordova config.xml for images
 *
 * @param  {object} api
 * @param  {object} iconConfig
 * @returns {Promise<void>}
 */
const renderCordovaConfig = async function (api, iconConfig) {
  const filePath = api.resolve.cordova('config.xml')
  const doc = et.parse(readFileSync(filePath, 'utf-8'))
  const root = doc.getroot()
  const android = root.find('platform[@name="android"]')
  const ios = root.find('platform[@name="ios"]')

  const cordovaJson = JSON.parse(readFileSync(api.resolve.cordova('package.json'), 'utf-8'))
  const plugins = root.findall('plugin')

  // not sure why it can't always be found, checking in both possible places
  if (!cordovaJson.cordova.plugins.hasOwnProperty(
    'cordova-plugin-splashscreen')) {

    console.log(`

Splashscreens for Cordova requires a Cordova plugin. 
It can't be found in your config.xml

Attempting to install now.

If splashscreen is not available, please go to the src-cordova folder and run:

  $ cordova plugin add cordova-plugin-splashscreen 
  $ cordova plugin save
  
`)
    execa.shellSync(`cd ${api.resolve.cordova('.')} && cordova plugin add cordova-plugin-splashscreen`)
    if(!plugins.find(node => node.attrib.name ===
      'cordova-plugin-splashscreen')) {
      // add the splashscreen but get the right version installed
      const newCordovaJson = JSON.parse(readFileSync(api.resolve.cordova('package.json'), 'utf-8'))

      let plugin = et.SubElement(root, 'plugin')
      plugin.set('name', 'cordova-plugin-splashscreen')
      plugin.set('spec', newCordovaJson.dependencies['cordova-plugin-splashscreen'])
      doc.write({ indent: 4 })
    }
  }


  const jobs = iconConfig.options.cordova || settings.options.cordova
  for (let job in jobs) {
    if (jobs[job].platform === 'android') {
      if (jobs[job].splash === true) {
        if (!android.find(`splash[@density="${jobs[job].density}"]`)) {
          let splash = et.SubElement(android, 'splash')
          splash.set('density', jobs[job].density)
          splash.set('src', `res/${jobs[job].folder}/${jobs[job].prefix}${jobs[job].suffix}`)
          doc.write({ indent: 4 })
        }
      } else { // an icon, not a splash
        if (!android.find(`icon[@density="${jobs[job].density}"]`)) {
          let icon = null
          icon = et.SubElement(android, 'icon')
          icon.set('density', jobs[job].density)
          icon.set('src', `res/${jobs[job].folder}/${jobs[job].prefix}${jobs[job].suffix}`)
          doc.write({ indent: 4 })
        }
      }
    }
    else if (jobs[job].platform === 'ios') {
      if (jobs[job].splash === true) {
        if (!ios.find(`splash[@width="${jobs[job].sizes[0][0]}"][@height="${jobs[job].sizes[0][1]}"]`)) {
          let splash = null
          splash = et.SubElement(ios, 'splash')
          splash.set('width', jobs[job].sizes[0][0])
          splash.set('height', jobs[job].sizes[0][1])
          splash.set('src', `res/${jobs[job].folder}/${jobs[job].prefix}${jobs[job].suffix}`)
          doc.write({ indent: 4 })
        }
      } else { // an icon, not a splash
        if (!ios.find(`icon[@width="${jobs[job].sizes[0]}"]`)) {
          let icon = null
          icon = et.SubElement(ios, 'icon')
          icon.set('width', jobs[job].sizes[0])
          icon.set('height', jobs[job].sizes[0])
          icon.set('src', `res/${jobs[job].folder}/${jobs[job].prefix}${jobs[job].suffix}`)
          doc.write({ indent: 4 })
        }
      }
    }
  }

  const content = doc.write({ indent: 4 })
  writeFileSync(filePath, content, 'utf8')
  console.log('* Updated Cordova config.xml')


}

/**
 * configuring the icon factory extension
 *
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

  let target = ''
  if (useIntermediateFolders) {
    target = './.icon-factory/' + mode + '/' + modeName
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
      background_color: validateHexRGB(api.prompts.background_color) ?
        api.prompts.background_color : '#000000',
      theme_color: validateHexRGB(api.prompts.theme_color) ?
        api.prompts.theme_color : '#ffffff'
    }
    await iconfactory[modeName](source, target, minify, options)
    iconConfig.modes[mode].source = hash
    if (useIntermediateFolders) {
      iconConfig.modes[mode].targets[modeName] = hash
    } else {
      iconConfig.targets[modeName] = hash
    }
    // in case there's been a change
    iconConfig.options.background_color = api.prompts.background_color
    iconConfig.options.theme_color = api.prompts.theme_color
    saveConfig(iconConfig)
  }

  await validatePng(source)
  iconConfig = await getConfig(api.prompts)
  hash = await computeHash(source, 'md5', minify)
  let targetHash = useIntermediateFolders ?
    iconConfig.modes[mode].targets[modeName] : iconConfig.targets[modeName]

  if (!existsSync(target) ||
      (iconConfig.modes[mode].source !== hash) ||
      (targetHash !== hash) ||
      (iconConfig.options.background_color !== api.prompts.background_color) ||
      (iconConfig.options.theme_color !== api.prompts.theme_color) ||
      (api.prompts.build.find(prompt => prompt === 'rebuild_always'))) {
    await ensureDir(target)
    if (modeName === 'cordova') {
      await renderCordovaConfig(api, iconConfig)
    }
    await processImages()
  }
  // should use this for build and dev actually
  // todo: place tmp in module
  if (useIntermediateFolders) {
    await copyFiles(target, modeName)
  }
}

module.exports = function(api) {
  // TODO: check if ssr is on pwa mode without extend quasar conf.
  api.extendQuasarConf(async config => {
    await initialize(api, config)
  })
}
