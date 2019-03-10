const fs = require('fs-extra'),
  deasync = require('deasync'),
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

const copy = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.copy(src, dest, { overwrite: true }, err => (err ? reject(err) : resolve()))
  })
}

const copyFiles = async (target, modeName, retries = 0) => {
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
  fs.ensureDirSync(target)
  let targetHash = useIntermediateFolders ? iconConfig.modes[mode].targets[modeName] : iconConfig.targets[modeName]
  if (!fs.existsSync(target)) {
    await processImagess()
  } else if (iconConfig.modes[mode].source !== hash) {
    await processImagess()
  } else if (targetHash !== hash) {
    await processImagess()
  }

  if (useIntermediateFolders) {
    await copyFiles(target, modeName, 0)
  }
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
