const fs = require('fs')
const crypto = require('crypto')

const computeHash = function (file, algorithm, secret) {
  let hmac = crypto.createHmac(algorithm, Buffer.from(secret))
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
}

const initialize = async function (prompts) {
  let json = {
    source: {
      dev: await computeHash(prompts.source_dev, 'sha512', prompts.minify_dev),
      build: await computeHash(prompts.source_build, 'sha512', prompts.minify_build)
    },
    target: {
      spa: {},
      pwa: {},
      cordova: {},
      electron: {}
    }
  }
  console.log(JSON.stringify(json, null, 2))
  fs.writeFile('./quasar.icon-factory.json', JSON.stringify(json, null, 2), (err) => {
    if (err) throw err
  })
}

module.exports = function (api) {
  initialize(api.prompts)
}
