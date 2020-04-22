const sharp = require('sharp')
const svgo = require('svgo')
const { writeFile } = require('fs')
const { posterize } = require('potrace')

module.exports = async function (file, opts, done) {
  const img = sharp(opts.icon)
  const buffer = await img.toBuffer()

  const params = {
    color: opts.svgColor,
    steps: 4,
    threshold: 255
  }

  posterize(buffer, params, async (_, svg) => {
    const svgOutput = new svgo({})
    svgOutput.optimize(svg).then(res => {
      writeFile(file.absoluteName, res.data, done)
    })
  })
}
