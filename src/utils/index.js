const fs = require('fs-extra')
const util = require('util')
const isPng = require('is-png')
const crypto = require('crypto')
const readChunk = require('read-chunk')
const { options } = require('../../lib/settings')

const fileName = './quasar.icon-factory.json'
/**
 * Check if a given file exists and if the current user had access
 * @param  {string} file the path do the file who will be checked
 * @returns {Promise} a Promise who will be successed resolved if the file exists
 */
const access = util.promisify((file, callback) => {
  fs.access(file, fs.constants.F_OK, callback)
})

/**
 * Check if a given file exists and if the current user had access
 * @param  {string} file the path do the file who will be checked if exists
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
 * write `data` to a `file`
 * @param  {Object} context a object
 * @param  {String | Number | Buffer} context.file the file or stream to be used to store the content
 * @param  {Object} context.data the context to be saved in the file
 * @returns {Promise} a promise who will successed resolve if the file got writed with success
 */
const writeFile = util.promisify((context, callback) => {
  fs.writeFile(context.file, context.data, callback)
})

/**
 * @param  {Object} context a object
 * @param  {String | Number | Buffer} context.file the file or stream to be read
 * @param  {String} context.data the enconding of the file
 * @returns {Promise} a promise who will successed resolve with the context of the readed file
 */
const readFile = util.promisify((context, callback) => {
  fs.readFile(context.file, context.encoding, callback)
})

/**
 * validate if the `fileName` is a valid png file.
 * @param  {String} fileName the path to the png file to be validated
 * @returns {Promise<Boolean>} the result of the validation
 */
const validatePng = async function (fileName) {
  let fileExists = await exists(fileName)
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
 * generating the `algorithm` sum of the `fileName`
 * @param  {String} fileName the path to the png file to be validated
 * @param  {String} algorithm algorithm used to generate the hash
 * @param  {String | Buffer} secret the secret used while generating the hash
 * @returns {Promise<String>} the hash of the given file
 */
const computeHash = async function (fileName, algorithm, secret) {
  if (!Buffer.isBuffer(secret))
    secret = Buffer.from(secret)
  let hmac = crypto.createHmac(algorithm, secret)
  await validatePng(fileName)
  return new Promise(resolve => {
    let stream = fs.ReadStream(fileName)
    stream.on('data', function (data) {
      hmac.update(data)
    })
    stream.on('end', function () {
      let hash = hmac.digest('hex')
      return resolve(hash);
    })
  })
}

/**
 * clone the `options` to the `settings` object
 * @returns {undefined}
 */
const mapOptions = function () {
  return {
    spa: options.spa,
    pwa: options.pwa,
    electron: options.electron,
    cordova: options.cordova
  }
}

/**
 * save the settings object to the disk
 * @param  {Object} settings the settings object to be saved
 * @returns {undefined}
 */
const saveConfig = async function (settings) {
  await writeFile({ file: fileName, data: JSON.stringify(settings, null, 2) })
}

/**
 * create the json file who will hold the hash of the generated icons
 * @param  {Object} prompts a object with the answers given by the user while inquired
 * @returns {Promise<Object>} a object who hold the hash of the generated icons
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
    options: mapOptions()
  }

  await saveConfig(settings)
  return settings
}

/**
 * get the settings from the disk
 * @param  {Object} prompts the answers given by the user while installing the extesion 
 * @returns {Object} a object with the current `settings`
 */
const getConfig = async function (prompts) {
  if (await exists(fileName)) {
    let data = await readFile({ file: fileName, encoding: 'utf8' })
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
exports.computeHash = computeHash
exports.createConfig = createConfig
exports.saveConfig = saveConfig
exports.getConfig = getConfig
