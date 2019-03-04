const fs = require('fs')
const isPng = require('is-png')
const crypto = require('crypto')

const _validatePng = function (value) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(value)) {
      return reject("file don't found")
    }
  
    fs.readFile(value, (err, data) => {
      if (err)
        return reject(err.message);
      if (!isPng(data))
        return reject("the selected file isn't a valid png")
      return resolve(true)
    })
  })
}

const _computeHash = function (file, algorithm, secret) {
  let hmac = crypto.createHmac(algorithm, Buffer.from(secret))
  return _validatePng(file).then(() => {
    return new Promise(resolve => {
      let stream = fs.ReadStream(file)
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

exports.validatePng = _validatePng
exports.computeHash = _computeHash

exports.createConfig = async function (prompts) {
  let json = {
    source: {
      dev: await _computeHash(prompts.source_dev, 'md5', prompts.minify_dev),
      build: await _computeHash(prompts.source_build, 'md5', prompts.minify_build)
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
