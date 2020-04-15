const { join } = require('path')
const fse = require('fs-extra')
const { green } = require('chalk')

const samples = [
  { file: 'app-icon.png', resolution: '1240x1240' },
  { file: 'app-splashscreen.png', resolution: '2436x2436' }
]

const samplesLen = samples.length

module.exports = function sample () {
  const source = join(__dirname, '../../samples')
  const dest = process.cwd()

  console.log(` Generating sample source files:\n`)
  console.log(` * ${dest}`)

  samples.forEach((sample, index) => {
    fse.copy(
      join(source, sample.file),
      join(dest, sample.file)
    )

    const prefix = index + 1 < samplesLen
      ? `├──`
      : `└──`
    console.log(` ${prefix} ${green(sample.file.padEnd(22, ' '))} -- ${sample.resolution}px`)
  })
}
