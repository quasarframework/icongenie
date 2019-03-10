const fs = require('fs-extra')
const util = require('util')
const isPng = require('is-png')
const crypto = require('crypto')
const { options } = require('../../lib/settings')

const fileName = './quasar.icon-factory.json'
const access = util.promisify((file, callback) => {
  fs.access(file, fs.constants.F_OK, callback)
})
const exists = async function (file) {
  try {
    await access(file)
    return true
  } catch (err) {
    return false
  }
}
const writeFile = util.promisify((context, callback) => {
  fs.writeFile(context.file, context.data, callback)
})
const readFile = util.promisify((context, callback) => {
  fs.readFile(context.file, context.encoding, callback)
})

/**
 * validate if the `fileName` is a valid png file.
 * @param  {String} fileName the path to the png file to be validated
 * @returns {Promise<Boolean>} the result of the validation
 */
const validatePng = function (fileName) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(fileName)) {
      return reject('File not found.')
    }

    fs.readFile(fileName, (err, data) => {
      if (err)
        return reject(err.message);
      if (!isPng(data))
        return reject('The selected file is not a valid png.')
      return resolve(true)
    })
  })
}

/**
 * generating the `algorithm` sum of the `fileName`
 * @param  {String} fileName the path to the png file to be validated
 * @param  {String} algorithm algorithm used to generate the hash
 * @param  {String | Buffer} secret the secret used while generating the hash
 * @returns {Promise<String>} the hash of the given file
 */
const computeHash = function (fileName, algorithm, secret) {
  if (!Buffer.isBuffer(secret))
    secret = Buffer.from(secret)
  let hmac = crypto.createHmac(algorithm, secret)
  return validatePng(fileName).then(() => {
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
  })
}

const mapOptions = function () {
  return {
    spa: options.spa,
    pwa: options.pwa,
    electron: options.electron,
    cordova: options.cordova
  }
}

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
