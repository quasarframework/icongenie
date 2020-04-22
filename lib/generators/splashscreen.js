async function getSplashscreen (file, opts) {
  const orientation = file.width >= file.height
    ? 'landscape'
    : 'portrait'

  if (opts.splashscreenType === 'pure') {
    return opts[orientation]
      .clone()
      .flatten({
        background: opts.splashscreenColor
      })
  }

  // else opts.splashscreenType === 'overlay'
  const size = file.width <= file.height
    ? file.width
    : file.height

  const icon = await opts.icon
    .clone()
    .resize(Math.round(size * 0.4))
    .toBuffer()

  return opts[orientation]
    .clone()
    .flatten({
      background: opts.splashscreenColor
    })
    .composite([
      { input: icon }
    ])
}

module.exports = async function (file, opts, done) {
  const img = await getSplashscreen(file, opts)

  img
    .resize(file.width, file.height)
    .png()
    .toFile(file.absoluteName)
    .then(() => opts.compression.png(file.absoluteName))
    .then(done)
}
