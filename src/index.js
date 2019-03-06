const fs = require('fs-extra')
const iconfactory = require('../lib/index.js')
const { validatePng, computeHash, createConfig } = require('./utils')

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
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }
  if (!fs.existsSync(target + '/' + modeName)) {
    await processImagess()
  } else if (iconConfig.source[mode] !== hash) {
    await processImagess()
  } else if (iconConfig.target[modeName][mode] !== hash) {
    await processImagess()
  }

  // TODO: move icons to the correct place
}

module.exports = function (api, ctx) {
  // TODO: check if ssr is on pwa mode without extend quasar conf.
  api.extendQuasarConf((config) => {
    return initilize(api, ctx, config)
  })
}
