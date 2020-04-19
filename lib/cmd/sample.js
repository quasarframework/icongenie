const { join } = require('path')
const fse = require('fs-extra')
const { green } = require('chalk')

const { samplesDefinition, getSamplePath } = require('../../samples')

function getSamples (type) {
  const sampleEntries = samplesDefinition[type] !== void 0
    ? [ samplesDefinition[type] ]
    : Object.keys(samplesDefinition).map(key => samplesDefinition[key])

  let maxLenFilename = 0
  sampleEntries.forEach(sample => {
    if (sample.file.length > maxLenFilename) {
      maxLenFilename = sample.file.length
    }
  })

  return {
    sampleEntries,
    maxLenFilename
  }
}

module.exports = function sample (type) {
  const dest = process.cwd()
  const { sampleEntries, maxLenFilename } = getSamples(type)

  console.log(` Generating sample file(s):\n`)
  console.log(` * ${dest}`)

  sampleEntries.forEach((sample, index) => {
    fse.copy(
      getSamplePath(sample.file),
      join(dest, sample.file)
    )

    const prefix = index + 1 < sampleEntries.length
      ? `├──`
      : `└──`
    console.log(` ${prefix} ${green(sample.file.padEnd(maxLenFilename + 1, ' '))} -- ${sample.details}`)
  })
}
