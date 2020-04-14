const sharp = require('sharp')

function getSplashscreen (opts) {
  if (opts.type === 'pure') {
    return sharp(opts.splashscreen).flatten({
      background: opts.bgcolor
    })
  }

  if (opts.type === 'overlay') {
    return sharp(opts.splashscreen)
      .flatten({
        background: opts.bgcolor
      })
      .composite([
        { input: sharp(opts.icon).toBuffer() }
      ])
  }

  if (opts.type === 'bg') {
    return sharp(opts.icon).extend({
      top: 726,
      bottom: 726,
      left: 726,
      right: 726,
      background: opts.bgcolor
    }).flatten({
      background: opts.bgcolor
    })
  }
}

module.exports = function (file, opts, done) {
  getSplashscreen(opts)
    .resize(file.resolution[0], file.resolution[1])
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
