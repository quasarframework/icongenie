const sharp = require('sharp')

module.exports = function (file, opts, done) {
  const img = sharp(opts.icon)
    .resize(file.resolution[0], file.resolution[1])

  if (file.background === true) {
    img.flatten({
      background: opts.bgcolor
    })
  }

  img.png()
    .toFile(file.absoluteName)
    .then(done)
}
