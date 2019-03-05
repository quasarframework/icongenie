const fs = require('fs')
const isPng = require('is-png')
const crypto = require('crypto')

/**
 * validate if the `fileName` is a valid png file.
 * @param  {String} fileName the path to the png file to be validated
 * @returns {Promise<Boolean>} the result of the validation
 */
const validatePng = function (fileName) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(fileName)) {
      return reject("file don't found")
    }
  
    fs.readFile(fileName, (err, data) => {
      if (err)
        return reject(err.message);
      if (!isPng(data))
        return reject("the selected file isn't a valid png")
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

exports.validatePng = validatePng
exports.computeHash = computeHash

/**
 * create the json file who will hold the hash of the generated icons
 * @param  {Object} prompts a object with the answers given by the user while inquired
 * @returns {Promise<Object>} a object who hold the hash of the generated icons
 */
exports.createConfig = async function (prompts) {
  let json = {
    source: {
      dev: await computeHash(prompts.source_dev, 'md5', prompts.minify_dev),
      build: await computeHash(prompts.source_build, 'md5', prompts.minify_build)
    },
    target: {
      spa: {},
      pwa: {},
      cordova: {},
      electron: {}
    }
  }
  fs.writeFile('./quasar.icon-factory.json', JSON.stringify(json, null, 2), (err) => {
    if (err) throw err
  })
  return json
}
