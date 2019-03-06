const fs = require('fs-extra')
const iconfactory = require('../lib/index.js')
const { validatePng, computeHash, createConfig } = require('./utils')

const copy = (src, dest) => {
  return new Promise((resolve, reject) => {
    fs.copy(src, dest, { overwrite: true }, err => (err ? reject(err) : resolve()))
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
      break
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
      await copy(
        target + '/pwa/apple-icon-152x152.png',
        './src/statics/icons/apple-icon-152x152.png'
      )
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
    await iconfactory[modeName](source, target, minify)
    iconConfig.source[mode] = hash
    iconConfig.target[modeName][mode] = hash
    fs.writeFile(configFileName, JSON.stringify(iconConfig, null, 2), err => {
      if (err) throw err
    })
  }

  let configFileName = './quasar.icon-factory.json'
  await validatePng(source)
  if (fs.existsSync(configFileName)) {
    iconConfig = await new Promise(resolve => {
      fs.readFile(configFileName, 'utf8', (err, data) => {
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

module.exports = function(api, ctx) {
  // TODO: check if ssr is on pwa mode without extend quasar conf.
  api.extendQuasarConf(async config => {
    await initialize(api, ctx, config)
  })
}
