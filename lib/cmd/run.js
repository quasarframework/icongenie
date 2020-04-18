const { basename } = require('path')
const glob = require('fast-glob')

const generate = require('./generate')
const { log, warn } = require('../utils/logger')

module.exports = function run (argv) {
  const profileFiles = glob.sync(`${argv.prefix}*.json`, {
    cwd: argv.folder,
    deep: 1,
    absolute: true
  })

  if (profileFiles.length === 0) {
    warn(`No JSON files detected with "${argv.prefix}" prefix in "${argv.folder}" folder!`)
    process.exit(1)
  }

  console.log(` Detected following files:\n`)
  console.log(` * ${argv.folder}`)

  profileFiles.forEach((file, index) => {
    const prefix = index + 1 < profileFiles.length
      ? `├──`
      : `└──`

    console.log(` ${prefix} ${basename(file)}`)
  })

  profileFiles.forEach(profileFile => {
    console.log(`\n\n`)
    log(`--------------------`)
    log(`Running profile file: ${profileFile}`)
    log(`--------------------`)
    console.log(`\n\n`)

    generate({ profile: profileFile })
  })
}
