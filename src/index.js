const { join } = require('path')
const { spawnSync } = require('./utils/spawn.js')
const icongenie = require('../lib/index.js')
const settings = require('../lib/settings')
const { copySync, existsSync, readFileSync, writeFileSync } = require('fs-extra')
const { validatePng, computeHash, validateHexRGB } = require('./utils')
const et = require('elementtree')

/**
 * Copy files from the intermediate folder to the your final destination
 *
 * @param  {string} source - the location of the intermediate folder
 * @param  {string} modeName - the running mode (eg: `spa`, `pwa`, `electron`, `cordova`)
 * @param  {string} api - the api object
 * @returns {undefined}
 */
async function copyFiles (source, modeName, api) {
  switch (modeName) {
    case 'spa':
    case 'pwa':
      await copySync(source, api.resolve.app('/src/statics'))
      break
    case 'electron':
      await copySync(source, api.resolve.electron('/icons'))
      break
    case 'cordova':
      await copySync(source, api.resolve.cordova('/res'))
      break
    case 'capacitor':
      await copySync(source, api.resolve.capacitor('.'))
      break
    case 'bex':
      await copySync(source, api.resolve.bex('/icons'))
      break
  }
}

/**
 * Update Cordova config.xml for images
 *
 * @param  {object} api
 * @returns {Promise<void>}
 */
const updateCordovaConfig = async function (api) {
  const filePath = api.resolve.cordova('config.xml')
  const pkgPath = api.resolve.cordova('package.json')
  const doc = et.parse(readFileSync(filePath, 'utf-8'))
  const root = doc.getroot()
  const android = root.find('platform[@name="android"]')
  const ios = root.find('platform[@name="ios"]')

  const cordovaJson = require(pkgPath)
  const plugins = root.findall('plugin')

  // not sure why it can't always be found, checking in both possible places
  if (!cordovaJson.cordova.plugins.hasOwnProperty('cordova-plugin-splashscreen')) {
    console.log(`

Splashscreens for Cordova requires a Cordova plugin
(cordova-plugin-splashscreen) which was not found.

Attempting to install it...
`)

    spawnSync('cordova', [ 'plugin', 'add', 'cordova-plugin-splashscreen' ], {
      cwd: api.resolve.cordova('.')
    }, () => {
      console.log()
      console.error('Failed to install cordova-plugin-splashscreen. Please do it manually.')
      console.log()
    })

    if (!plugins.find(node => node.attrib.name === 'cordova-plugin-splashscreen')) {
      // add the splashscreen but get the right version installed
      delete require.cache[pkgPath]
      const newCordovaJson = require(pkgPath)

      let plugin = et.SubElement(root, 'plugin')
      plugin.set('name', 'cordova-plugin-splashscreen')
      plugin.set('spec', newCordovaJson.dependencies['cordova-plugin-splashscreen'])
      doc.write({ indent: 4 })
    }
  }

  const jobs = settings.options.cordova

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
    } else if (jobs[job].platform === 'ios') {
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
 * Run icon-genie
 *
 * @param {object} api - App Extension API object
 */
async function run (api) {
  const buildMode = api.ctx.dev ? 'dev' : 'build'
  const modeName = api.ctx.modeName === 'ssr'
    ? (api.ctx.mode.pwa ? 'pwa' : 'spa')
    : api.ctx.modeName
  let splashscreenSource, splashscreenHashBasis
  const iconSource = api.resolve.app('app-icon.png')
  if (api.prompts.cordova.splashscreen_type !== 'generate') {
    splashscreenSource = api.resolve.app('app-splashscreen.png')
    splashscreenHashBasis = await computeHash(splashscreenSource, 'md5', 'icon-genie!!!')
  } else {
    splashscreenHashBasis = false
  }
  const target = join(__dirname, '../tmp/' + buildMode + '/' + modeName)

  const prevConfig = api.getPersistentConf(api)[buildMode][modeName] || {}
  const currentConfig = {
    iconHash: await computeHash(iconSource, 'md5', 'icon-genie!!!')
  }

  if (['cordova', 'capacitor'].includes(modeName)) {
    Object.assign(currentConfig, {
      splashscreenHash: splashscreenHashBasis,
      splashscreenType: api.prompts.cordova.splashscreen_type,
      backgroundColor: api.prompts.cordova.background_color
    })
  }

  if (
    api.prompts.build_always === true ||
    !existsSync(target) ||
    Object.keys(currentConfig).some(key => currentConfig[key] !== prevConfig[key])
  ) {
    await validatePng(iconSource)

    const opts = { ...settings.options[modeName] }

    if (modeName === 'cordova') {
      if (api.prompts.cordova.splashscreen_type !== 'generate') {
        await validatePng(splashscreenSource)
      }
      await updateCordovaConfig(api)

      Object.assign(opts, {
        background_color: validateHexRGB(currentConfig.backgroundColor)
          ? currentConfig.backgroundColor
          : '#000000',
        // theme_color: validateHexRGB(api.prompts.theme_color) ?
        //  api.prompts.theme_color : '#ffffff'
        splashscreen_type: currentConfig.splashscreenType
      })
    }
    else if (modeName === 'capacitor') {
      if (api.prompts.cordova.splashscreen_type !== 'generate') {
        await validatePng(splashscreenSource)
      }

      Object.assign(opts, {
        background_color: validateHexRGB(currentConfig.backgroundColor)
          ? currentConfig.backgroundColor
          : '#000000',
        // theme_color: validateHexRGB(api.prompts.theme_color) ?
        //  api.prompts.theme_color : '#ffffff'
        splashscreen_type: currentConfig.splashscreenType
      })
    }

    await icongenie[modeName](
      iconSource,
      target,
      api.prompts['minify_' + buildMode],
      opts,
      splashscreenSource
    )

    api.mergePersistentConf({
      [buildMode]: {
        [modeName]: currentConfig
      }
    })
  }
  copyFiles(target, modeName, api)
}

/**
 * Configuring the icon genie extension
 */
module.exports = function (api) {
  api.compatibleWith('@quasar/app', '^1.0.0')

  api.beforeDev(run)
  api.beforeBuild(run)
}
