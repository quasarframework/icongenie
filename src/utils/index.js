const
  isPng = require('is-png'),
  readChunk = require('read-chunk'),
  { createHmac } = require('crypto'),
  { ReadStream, existsSync } = require('fs-extra')

/**
 * validate if the `fileName` is a valid png file.
 * be sure to only pass a scoped file here
 *
 * @param  {String} fileName the path to the png file to be validated
 * @returns {Promise<undefined>}
 */
const validatePng = async function (fileName) {
  if (!existsSync(fileName)) {
    console.log('ICONFACTORY: File not found: ' + fileName)
    process.exit(0)
  }

  let data = await readChunk(fileName, 0, 8)

  if (!isPng(data)) {
    console.log('ICONFACTORY: Not a valid png: ' + fileName)
    process.exit(0)
  }
}

/**
 * make sure the prompted RGB HEX really is valid
 *
 * @param  {String} hex - the answer given by the user while installing the extension
 * @returns {Boolean} true if it is a valid 3 or 6 letter RGB HEX
 */
const validateHexRGB = async function (hex) {
  return typeof hex === 'string' && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex)
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
  if (!Buffer.isBuffer(secret)) {
    secret = Buffer.from(secret)
  }
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

exports.validatePng = validatePng
exports.validateHexRGB = validateHexRGB
exports.computeHash = computeHash
