const { green, grey } = require('chalk')
const { ensureFileSync } = require('fs-extra')

const { log } = require('./logger')
const getFileSize = require('./get-file-size')

const generators = {
  png: require('./generators/png'),
  ico: require('./generators/ico'),
  icns: require('./generators/icns'),
  splashscreen: require('./generators/splashscreen'),
  svg: require('./generators/svg')
}

module.exports = function generateFile (file, opts) {
  // ensure that the file (and its folder) exists
  ensureFileSync(file.absoluteName)

  // generate
  generators[file.handler](file, opts, () => {
    log(`Generated: ${green(file.relativeName)} ${grey(`(${file.handler} - ${getFileSize(file.absoluteName)})`)}`)
  })
}
