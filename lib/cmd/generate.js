const { existsSync } = require('fs')
const { ensureFileSync } = require('fs-extra')
const { green, grey } = require('chalk')

const { appDir, resolveDir } = require('../utils/app-paths')
const { log, warn } = require('../utils/logger')

const modes = require('../modes')
const generators = require('../generators')
const { mount } = require('../mount')

const getAssetsFiles = require('../utils/get-assets-files')
const getFilesOptions = require('../utils/get-files-options')
const parseArgv = require('../utils/parse-argv')
const mergeObjects = require('../utils/merge-objects')
const getProfileContent = require('../utils/get-profile-content')
const getFileSize = require('../utils/get-file-size')
const validateProfileObject = require('../utils/validate-profile-object')

function printBanner (assetsOf, params) {
  console.log(` Generating files with the following options:
 ====================
 Root folder......... ${green(appDir)}
 Assets of........... ${green(assetsOf)}
 Generator filter.... ${!params.filter ? 'none' : green(params.filter)}
 ${green('Quality level')}....... ${green(`${params.quality}/12`)}
 Theme color......... ${green(params.color)}
 Splashscreen type... ${green(params.splashscreen)}
 ====================
`)
}

function parseAssets (assets, include) {
  let files = []
  let assetsOf = []

  if (include) {
    const embeddedModes = include.filter(
      mode => existsSync(resolveDir(modes[mode].folder))
    )

    embeddedModes.forEach(mode => {
      files = files.concat(
        getAssetsFiles(modes[mode].assets)
      )
    })

    assetsOf = assetsOf.concat(embeddedModes)
  }

  if (assets && assets.length > 0) {
    files = files.concat(getAssetsFiles(assets))
    assetsOf.push('profile')
  }

  return {
    files,
    assetsOf: assetsOf.join(' | ')
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
  const { assetsOf, files } = parseAssets(profile.assets, params.include)

  const fileOptions = getFilesOptions(params)
  let uniqueFiles = getUniqueFiles(files)

  if (params.filter) {
    uniqueFiles = uniqueFiles.filter(
      file => file.handler === params.filter
    )
  }

  if (uniqueFiles.length === 0) {
    warn(`No assets to generate! No mode/include specified, filter too specific or the respective Quasar mode(s) are not installed`)
    return Promise.resolve(0)
  }

  printBanner(assetsOf, params)

  return Promise
    .all(uniqueFiles.map(file => generateFile(file, fileOptions)))
    .then(() => { mount(uniqueFiles) })
    .then(() => uniqueFiles.length)
}

module.exports = function generate (argv) {
  const profile = {
    params: {},
    assets: []
  }

  if (argv.profile) {
    parseArgv(argv, [ 'profile' ])

    const userProfile = getProfileContent(argv.profile)

    if (userProfile.params) {
      const { profile: _, ...params } = argv

      profile.params = mergeObjects(userProfile.params, params)
      parseArgv(profile.params, [ 'include' ])
    }
    if (userProfile.assets) {
      profile.assets = userProfile.assets
    }
  }
  else {
    parseArgv(argv, [ 'mode' ])

    const { mode, ...params } = argv

    profile.params = params
    profile.params.include = mode
  }

  // apply defaults
  const defaults = {
    quality: 5,
    color: '#1976D2',
    splashscreen: 'pure'
  }

  profile.params = mergeObjects(defaults, profile.params)

  parseArgv(profile.params, [
    'quality', 'filter', 'color', 'landscape', 'portrait', 'splashscreen', 'icon'
  ])

  // final thorough validation
  validateProfileObject(profile)

  return generateFromProfile(profile)
    .then(numberOfFiles => {
      console.log(`\n Task done - generated ${numberOfFiles} file(s)!\n`)
    })
}
