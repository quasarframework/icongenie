const { green } = require('chalk')
const { writeFile } = require('fs')
const { dirname } = require('path')

const { log } = require('./logger')
const { ensureDir } = require('fs-extra')

const generators = {
  png: require('./generators/png'),
  favicon: require('./generators/favicon'),
  splashscreen: require('./generators/splashscreen'),
  svg: require('./generators/svg')
}

module.exports = function generateFile (file, opts) {
  // ensure folder exists
  ensureDir(dirname(file.absoluteName))

  // generate
  generators[file.handler](file, opts, output => {
    writeFile(file.absoluteName, output, () => {
      log(`Generated ${file.handler}: ${green(file.relativeName)}...`)
    })
  })
}
