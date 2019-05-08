const isPng = require('is-png')
const readChunk = require('read-chunk')
const { createHmac } = require('crypto')
const { options } = require('../../lib/settings')
const { access, writeFile, readFile, ReadStream } = require('fs-extra')
const fileName = './quasar.icon-factory.json'

/**
 * Check if a given file exists and if the current user has access
 *
 * @param  {string} file - the path of the file to be checked
 * @returns {Promise<boolean>} the result of the operation
 */
const __exists = async function (file) {
  try {
    await access(file)
    return true
  } catch (err) {
    return false
  }
}

/**
 * validate if the `fileName` is a valid png file.
 *
 * @param  {String} fileName the path to the png file to be validated
 * @returns {Promise<Boolean>} the result of the validation
 */
const validatePng = async function (fileName) {
  let fileExists = await __exists(fileName)
  if (!fileExists) {
    throw new Error('File not found.')
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
const mapOptions = function (prompts) {
  return {
    background_color: prompts.background_color,
    theme_color: prompts.theme_color,
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
 * @param  {Object} prompts - an object with the answers given by the user while inquired
 * @returns {Promise<Object>} an object that holds the hash of the generated icons
 */
const createConfig = async function (prompts) {
  var modes = { dev: null, build: null }
  for (var key in modes) {
    modes[key] = {
      source: await computeHash(prompts['source_' + key], 'md5', prompts['minify_' + key]),
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
    targets: {
      spa: null,
      pwa: null,
      cordova: null,
      electron: null
    },
    options: mapOptions(prompts)
  }

  await saveConfig(settings)
  return settings
}

/**
 * get the settings from the disk
 *
 * @param  {Object} prompts - the answers given by the user while installing the extension
 * @returns {Object} an object with the current `settings`
 */
const getConfig = async function (prompts) {
  if (await __exists(fileName)) {
    let data = await readFile(fileName, 'utf8')
    let settings = JSON.parse(data)
    if (!settings.options) {
      settings.options = mapOptions()
      await saveConfig(settings)
    }
    return settings
  } else {
    return createConfig(prompts)
  }
}

exports.validatePng = validatePng
exports.validateHexRGB = validateHexRGB
exports.computeHash = computeHash
exports.createConfig = createConfig
exports.saveConfig = saveConfig
exports.getConfig = getConfig
