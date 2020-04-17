const sharp = require('sharp')
const svgo = require('svgo')
const { writeFile } = require('fs')
const { posterize } = require('potrace')

module.exports = async function (file, opts, done) {
  const img = sharp(opts.icon)
  const buffer = await img.toBuffer()

  const params = {
    color: opts.colorHex,
    steps: 4
  }

  posterize(buffer, params, async (err, svg) => {
    const svgOutput = new svgo({})
    svgOutput.optimize(svg).then(res => {
      writeFile(file.absoluteName, res.data, done)
    })
  })
}
