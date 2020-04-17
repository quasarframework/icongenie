const { existsSync } = require('fs')
const { green, red, underline } = require('chalk')

const { appDir, resolveDir } = require('../utils/app-paths')
const modes = require('../modes')
const { verifyMount } = require('../mount')
const getAssetsFiles = require('../utils/get-assets-files')
const getPngSize = require('../utils/get-png-size')

function getFileStatus (file) {
  if (!existsSync(file.absoluteName)) {
    return red('ERROR: missing!')
  }

  if (file.handler === 'png' || file.handler === 'splashscreen') {
    const { width, height } = getPngSize(file.absoluteName)

    if (width === 0 && height === 0) {
      return red('ERROR: not a png!')
    }

    if (width !== file.width || height !== file.height) {
      return red('ERROR: incorrect resolution!')
    }
  }

  return green('SIZE OK')
}

function printMode (modeName, files) {
  console.log(` ${green(underline(`Mode ${modeName.toUpperCase()}`))} \n`)

  files.forEach(file => {
    console.log(` ${getFileStatus(file)} - ${(file.handler + ':').padEnd(13, ' ')} ${file.relativeName} ${verifyMount(file)}`)
  })

  console.log()
}

function printBanner (modes, params) {
  console.log(` VERIFYING with the following options:
 ===========================================
 Root folder........... ${green(appDir)}
 Running mode(s)....... ${green(modes)}
 Assets filter......... ${!params.filter ? 'none' : green(params.filter)}
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
    const filesMap = []
    const modesList = parseMode(mode)

    modesList.forEach(mode => {
      filesMap.push({
        name: mode,
        files: getAssetsFiles(modes[mode].assets)
      })
    })

    return {
      filesMap,
      modes: modesList.join(', ')
    }
  }

  return {
    modes: 'profile assets',
    filesMap: [
      { name: 'profile assets', files: getAssetsFiles(assets) }
    ]
  }
}

/*
  profile: {
    params: {},
    assets: []
  }
*/
module.exports = function verify (profile) {
  const params = profile.params
  const { modes, filesMap } = parseAssets(profile.assets, params.mode)

  printBanner(modes, params)

  filesMap.forEach(entry => {
    const files = params.filter
      ? entry.files.filter(file => file.handler === params.filter)
      : entry.files

    if (files.length > 0) {
      printMode(entry.name, files)
    }
  })
}

