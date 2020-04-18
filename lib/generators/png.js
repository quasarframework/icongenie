const sharp = require('sharp')

module.exports = function (file, opts, done) {
  const img = sharp(opts.icon)
    .withMetadata()
    .resize(file.width, file.height)

  if (file.background === true) {
    img.flatten({
      background: opts.colorRgb
    })
  }

  img.png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
