const { writeFile } = require('fs')
const sharp = require('sharp')
const png2icons = require('png2icons')

module.exports = async function (file, opts, done) {
  const input = sharp(opts.icon)
  const buffer = await input.toBuffer()
  const output = await png2icons.createICO(buffer, png2icons.BICUBIC, 0, true)

  done(output)
}
