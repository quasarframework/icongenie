const { green, grey } = require('chalk')
const { ensureFileSync } = require('fs-extra')

const { log } = require('./logger')
const getFileSize = require('./get-file-size')
const generators = require('./generators')

module.exports = function generateFile (file, opts) {
  // ensure that the file (and its folder) exists
  ensureFileSync(file.absoluteName)

  // generate
  generators[file.handler](file, opts, () => {
    log(`Generated: ${green(file.relativeName)} ${grey(`(${file.handler} - ${getFileSize(file.absoluteName)})`)}`)
  })
}
