const iconfactory = require('../lib/index.js')
const { copy, ensureDir, existsSync } = require('fs-extra')
const { validatePng, computeHash, getConfig, saveConfig } = require('./utils')
const useIntermediateFolders = false

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
 * configuring the icon factory extension
 * @param {Object} api the IndexAPI object
 * @param {Object} ctx the context object created by the @quasar/cli
 * @param {Object} config quasar.config.js
 * @returns {undefined}
 */
const initialize = async function(api, config) {
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
  if (modeName == 'ssr') {
    modeName = config.ssr.pwa ? 'pwa' : 'spa'
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
  let processImagess = async function() {
    await iconfactory[modeName](source, target, minify, iconConfig.options[modeName])
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
  let targetHash = useIntermediateFolders ? iconConfig.modes[mode].targets[modeName] : iconConfig.targets[modeName]
  // async version of the exists is deprecated, while access is recomended async method to check if a file exists,
  // that will throw a exception if the file didn't exists, use a try-catch just to check if a file exists, didn't had a good smell

  if (!existsSync(target)) {
    await ensureDir(target)
    await processImagess()
  } else if (iconConfig.modes[mode].source !== hash) {
    await processImagess()
  } else if (targetHash !== hash) {
    await processImagess()
  }

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
