const isPng = require('is-png'),
  readChunk = require('read-chunk'),
  { createHmac } = require('crypto'),
  path = require('path'),
  join = path.join,
  { options } = require('../../lib/settings'),
  { access, writeFile, readFile, ReadStream, existsSync } = require('fs-extra'),
  fileName = './quasar.icon-factory.json'



/**
 * Find the App Dir - cloned from Quasar Core
 *
 * @returns {string | any}
 * @private
 */
const getAppDir = function () {
  let dir = process.cwd()

  while (dir.length && dir[dir.length - 1] !== path.sep) {
    if (existsSync(join(dir, 'quasar.conf.js'))) {
      return dir
    }

    dir = path.normalize(join(dir, '..'))
  }
}

/**
 * Check if a given file exists and if the current user has access
 *
 * @param  {string} file - the path of the file to be checked
 * @returns {Promise<boolean>} the result of the operation
 */
const exists = async function (file) {
  try {
    await access(file)
    return true
  } catch (err) {
    return false
  }
}

/**
 * validate if the `fileName` is a valid png file.
 * be sure to only pass a scoped file here
 *
 * @param  {String} fileName the path to the png file to be validated
 * @returns {Promise<Boolean>} the result of the validation
 */
const validatePng = async function (fileName) {
  let fileExists = await exists(fileName)
  if (!fileExists) {
    throw new Error('File not found. Are you in the root folder of your project?')
  }
  let data = await readChunk(fileName, 0, 8)
  if (!isPng(data)) {
    throw new Error('The selected file is not a valid png.')
  }
  return true
}

/**
 * make sure the prompted RGB HEX really is valid
 *
 * @param  {String} hex - the answer given by the user while installing the extension
 * @returns {Boolean} true if it is a valid 3 or 6 letter RGB HEX
 */
const validateHexRGB = async function (hex) {
  return typeof hex === "string" && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex)
}

/**
 * generating the `algorithm` sum of the `fileName`
 *
 * @param  {String} fileName the path to the png file to be validated
 * @param  {String} algorithm algorithm used to generate the hash
 * @param  {String | Buffer} secret the secret used while generating the hash
 * @returns {Promise<String>} the hash of the given file
 */
const computeHash = async function (fileName, algorithm, secret) {
  if (!Buffer.isBuffer(secret))
    secret = Buffer.from(secret)
  let hmac = createHmac(algorithm, secret)
  await validatePng(fileName)
  return new Promise(resolve => {
    let stream = ReadStream(fileName)
    stream.on('data', function (data) {
      hmac.update(data)
    })
    stream.on('end', function () {
      let hash = hmac.digest('hex')
      return resolve(hash)
    })
  })
}

/**
 * clone the `options` to the `settings` object, inject color choices
 *
 * @param  {Object} prompts - the settings object to be saved
 * @returns {undefined}
 */
const mapOptions = function (api) {
  return {
    background_color: api.prompts.background_color,
    //theme_color: prompts.theme_color,
    splashscreen_type: api.prompts.generate,
    spa: options.spa,
    pwa: options.pwa,
    electron: options.electron,
    cordova: options.cordova
  }
}

/**
 * save the settings object to the disk
 *
 * @param  {Object} settings - the settings object to be saved
 * @returns {undefined}
 */
const saveConfig = async function (settings) {
  await writeFile(fileName, JSON.stringify(settings, null, 2))
}

/**
 * create the json file that will hold the hash of the generated icons
 *
 * @param  {Object} api - an object with the answers given by the user while inquired
 * @returns {Promise<Object>} an object that holds the hash of the generated icons
 */
const createConfig = async function (api) {
  // wish there was another way to do this


  const iconHash = await computeHash(api.resolve.app('app-icon.png'), 'md5', 'icon-factory!!!')
  const splashscreenHash = await computeHash(api.resolve.app('app-splashscreen.png'), 'md5', 'icon-factory!!!')
  const splashType = api.prompts.splash_type || 'generate'
  /*
  api.extendJsonFile('quasar.extensions.json', {
    '@quasar/icon-factory': {
      source: iconHash,
      source_splashscreen: splashscreenHash
    }
  })
  */

  const modes = { dev: null, build: null }
  for (var key in modes) {
    modes[key] = {
      source: iconHash,
      source_splashscreen: splashscreenHash,
      splash_type: splashType,
      targets: {
        spa: null,
        pwa: null,
        cordova: null,
        electron: null
      }
    }
  }

  let settings = {
    modes: modes,
    options: mapOptions(api)
  }

  await saveConfig(settings)
  return settings
}

/**
 * get the settings from the disk
 *
 * @param  {Object} api - pass the api object and prompts
 * @returns {Object} an object with the current `settings`
 */
const getConfig = async function (api) {
  if (await exists(fileName)) {
    let data = await readFile(fileName, 'utf8')
    let settings = JSON.parse(data)
    if (!settings.options) {
      settings.options = mapOptions(api)
      await saveConfig(settings)
    }
    return settings
  } else {
    return createConfig(api)
  }
}

exports.getAppDir = getAppDir
exports.exists = exists
exports.validatePng = validatePng
exports.validateHexRGB = validateHexRGB
exports.computeHash = computeHash
exports.createConfig = createConfig
exports.saveConfig = saveConfig
exports.getConfig = getConfig
