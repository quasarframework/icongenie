async function getSplashscreen (file, opts) {
  const size = file.width <= file.height
    ? file.width
    : file.height

  const icon = await opts.icon
    .clone()
    .resize(Math.round(size * 0.4))
    .toBuffer()

  return opts.background
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
  const filename = file.absoluteName.endsWith('.png')
    ? file.absoluteName
    : file.absoluteName + '.png'

  img
    .resize(file.width, file.height)
    .png()
    .toFile(filename)
    .then(() => opts.compression.png(filename))
    .then(done)
}
