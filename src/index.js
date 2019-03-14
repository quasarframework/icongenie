const fs = require('fs-extra'),
  deasync = require('deasync'),
  util = require('util'),
  iconfactory = require('../lib/index.js')

const { validatePng, computeHash, getConfig, saveConfig } = require('./utils')
const useIntermediateFolders = false

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

/**
 * @param  {Object} context a object
 * @param  {string} context.src the source - a directory or a file to be copied
 * @param  {string} context.dest the destination - where the copy of the sources will be created.
 * @returns {Promise} the result of the copy operation
 */
const copy = util.promisify((context, callback) => {
  fs.copy(context.src, context.dest, { overwrite: true }, callback)
})

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
      await copy({ src: target, dest: './src/statics' })
      break
    case 'electron':
      await copy({ src: target, dest: './src-electron/icons' })
      break;
    case 'cordova':
      await copy({ src: target, dest: './src-cordova/res' })
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
   * @returns {undefined}
   */
  let processImagess = async function() {
    await iconfactory[modeName](source, target, minify, iconConfig.options[modeName], true)
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
  if (!fs.existsSync(target)) {
    fs.ensureDirSync(target)
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

module.exports = async function(api, ctx) {
  // TODO: check if ssr is on pwa mode without extend quasar conf.
  api.extendQuasarConf(async config => {
    let done = false
    await initialize(api, ctx, config)
  })
}
