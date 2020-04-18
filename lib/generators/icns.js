const sharp = require('sharp')
const { writeFile } = require('fs')
const png2icons = require('png2icons')

module.exports = async function (file, opts, done) {
  const icon = sharp(opts.icon).withMetadata()
  const buffer = await icon.toBuffer()
  const output = await png2icons.createICNS(buffer, opts.compression.ico, 0)

  writeFile(file.absoluteName, output, done)
}
