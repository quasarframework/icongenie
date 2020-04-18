const sharp = require('sharp')

function getSplashscreen (file, opts) {
  const orientation = file.width >= file.height
    ? 'landscape'
    : 'portrait'

  if (opts.splashscreen === 'pure') {
    return sharp(opts[orientation])
      .withMetadata()
      .flatten({
        background: opts.colorRgb
      })
  }

  if (opts.splashscreen === 'overlay') {
    return sharp(opts[orientation])
      .withMetadata()
      .flatten({
        background: opts.colorRgb
      })
      .composite([
        { input: sharp(opts.icon).toBuffer() }
      ])
  }

  if (opts.splashscreen === 'bg') {
    return sharp(opts.icon)
      .withMetadata()
      .extend({
        top: 726,
        bottom: 726,
        left: 726,
        right: 726,
        background: opts.colorRgb
      }).flatten({
        background: opts.colorRgb
      })
  }
}

module.exports = function (file, opts, done) {
  getSplashscreen(file, opts)
    .resize(file.width, file.height)
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
