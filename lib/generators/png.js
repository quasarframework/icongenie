module.exports = function (file, opts, done) {
  const img = opts.icon
    .clone()
    .resize(file.width, file.height)

  if (file.background === true) {
    img.flatten({
      background: opts.pngColor
    })
  }

  const filename = file.absoluteName.endsWith('.png')
    ? file.absoluteName
    : file.absoluteName + '.png'

  img.png()
    .toFile(filename)
    .then(() => opts.compression.png(filename))
    .then(done)
}
