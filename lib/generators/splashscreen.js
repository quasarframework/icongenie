const sharp = require('sharp')

function getSplashscreen (file, opts) {
  const orientation = file.width >= file.height
    ? 'landscape'
    : 'portrait'

  if (opts.splashscreenType === 'pure') {
    return sharp(opts[orientation])
      .withMetadata()
      .flatten({
        background: opts.splashscreenColor
      })
  }

  if (opts.splashscreenType === 'overlay') {
    return sharp(opts[orientation])
      .withMetadata()
      .flatten({
        background: opts.splashscreenColor
      })
      .composite([
        { input: sharp(opts.icon).toBuffer() }
      ])
  }

  if (opts.splashscreenType === 'bg') {
    return sharp(opts.icon)
      .withMetadata()
      .extend({
        top: 726,
        bottom: 726,
        left: 726,
        right: 726,
        background: opts.splashscreenColor
      }).flatten({
        background: opts.splashscreenColor
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
