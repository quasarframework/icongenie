const { basename } = require('path')
const glob = require('fast-glob')

const generate = require('./generate')
const { log, warn } = require('../utils/logger')

module.exports = async function run (argv) {
  const profileFiles = glob.sync(`${argv.prefix}*.json`, {
    cwd: argv.folder,
    deep: 1,
    absolute: true
  })

  const numberOfFiles = profileFiles.length

  if (numberOfFiles === 0) {
    warn(`No JSON files detected with "${argv.prefix}" prefix in "${argv.folder}" folder!`)
    process.exit(1)
  }

  console.log(` Detected ${numberOfFiles} file(s):\n`)
  console.log(` * ${argv.folder}`)

  profileFiles.forEach((file, index) => {
    const prefix = index + 1 < profileFiles.length
      ? `├──`
      : `└──`

    console.log(` ${prefix} ${basename(file)}`)
  })

  for (let i = 0; i < numberOfFiles; i++) {
    const profile = profileFiles[i]

    console.log(`\n`)
    log(`--------------------`)
    log(`Running profile file: ${profile}`)
    log(`--------------------`)
    console.log(`\n`)

    await generate({ profile })
  }
}
