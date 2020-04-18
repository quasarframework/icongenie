const { existsSync } = require('fs')
const { ensureFileSync } = require('fs-extra')
const { green, grey } = require('chalk')

const { appDir, resolveDir } = require('../utils/app-paths')
const { log } = require('../utils/logger')

const modes = require('../modes')
const generators = require('../generators')
const { mount } = require('../mount')

const getAssetsFiles = require('../utils/get-assets-files')
const getFilesOptions = require('../utils/get-files-options')
const parseArgv = require('../utils/parse-argv')
const mergeObjects = require('../utils/merge-objects')
const getProfile = require('../utils/get-profile')
const getFileSize = require('../utils/get-file-size')

function printBanner (modes, params) {
  console.log(` Generating files with the following options:
 ===========================================
 Root folder........... ${green(appDir)}
 Running mode(s)....... ${green(modes)}
 Generator filter...... ${!params.filter ? 'none' : green(params.filter)}
 ${green('Quality level')}......... ${green(`${params.quality}/12`)}
 Theme color........... ${green(params.color)}
 Splashscreen type..... ${green(params.splashscreen)}
 ===========================================
`)
}

function parseMode (mode) {
  const list = mode === 'all'
    ? Object.keys(modes)
    : [ mode ]

  return list.filter(mode => existsSync(resolveDir(modes[mode].folder)))
}

function parseAssets (assets, mode) {
  if (assets.length === 0) {
    let files = []
    const modesList = parseMode(mode)

    modesList.forEach(mode => {
      files = files.concat(
        getAssetsFiles(modes[mode].assets)
      )
    })

    return {
      files: files,
      modes: modesList.join(', ')
    }
  }

  return {
    files: getAssetsFiles(assets),
    modes: 'profile assets'
  }
}

function getUniqueFiles (files) {
  const filePaths = {}
  const uniqueFiles = []

  files.forEach(file => {
    if (filePaths[file.absoluteName] === void 0) {
      filePaths[file.absoluteName] = true
      uniqueFiles.push(file)
    }
  })

  return uniqueFiles
}

function generateFile (file, opts) {
  // ensure that the file (and its folder) exists
  ensureFileSync(file.absoluteName)

  return new Promise(resolve => {
    // use the appropriate generator to handle the file creation
    generators[file.handler](file, opts, () => {
      const size = `(${getFileSize(file.absoluteName)})`
      const type = (file.handler + ':').padEnd(13, ' ')

      log(`Generated ${type} ${green(file.relativeName)} ${grey(size)}`)
      resolve()
    })
  })
}

function generateFromProfile (profile) {
  const params = profile.params
  const { modes, files } = parseAssets(profile.assets, params.mode)

  const fileOptions = getFilesOptions(params)
  let uniqueFiles = getUniqueFiles(files)

  if (params.filter) {
    uniqueFiles = uniqueFiles.filter(
      file => file.handler === params.filter
    )
  }

  if (uniqueFiles.length === 0) {
    warn(`No assets to generate!`)
    return
  }

  printBanner(modes, params)

  mount(uniqueFiles)

  return Promise.all(
    uniqueFiles.map(file => generateFile(file, fileOptions))
  )
}

module.exports = function generate (argv) {
  const profile = {
    params: {},
    assets: []
  }

  if (argv.profile) {
    // verify "profile" param
    parseArgv(argv, [ 'profile' ])

    const userProfile = getProfile(argv.profile)

    if (userProfile.params) {
      profile.params = mergeObjects(userProfile.params, argv)
    }
    if (userProfile.assets) {
      profile.assets = userProfile.assets
    }
  }
  else {
    profile.params = { ...argv }
  }

  // apply defaults
  const defaults = {
    mode: 'all',
    quality: 5,
    color: '#1976D2',
    splashscreen: 'pure'
  }

  profile.params = mergeObjects(defaults, profile.params)

  // ensure all params are valid
  parseArgv(profile.params, [
    'mode', 'quality', 'filter', 'color', 'landscape', 'portrait', 'splashscreen', 'icon'
  ])

  return generateFromProfile(profile)
}
