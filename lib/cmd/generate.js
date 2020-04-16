const { existsSync } = require('fs')
const { green } = require('chalk')

const { appDir, resolveDir } = require('../utils/app-paths')
const modes = require('../modes')
const getAssetsFiles = require('../utils/get-assets-files')
const generateFile = require('../utils/generate-file')
const getFilesOptions = require('../utils/get-files-options')

function printBanner (modes, params) {
  console.log(` Generating files with the following options:
 ===========================================
 Root folder........... ${green(appDir)}
 Running mode(s)....... ${green(modes)}
 Generator filter...... ${!params.filter ? 'none' : green(params.filter)}
 ${green('Quality level')}......... ${green(`${params.quality}/12`)}
 SVG theme color....... ${green(params.color)}
 Splashscreen bg....... ${green(params.bgcolor)}
 Splashscreen type..... ${green(params.type)}
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
      files,
      modes: modesList.join(', ')
    }
  }

  return {
    files: getAssetsFiles(assets),
    modes: 'profile assets'
  }
}

/*
  profile: {
    params: {},
    assets: []
  }
*/
module.exports = function generate (profile) {
  const params = profile.params
  const { modes, files } = parseAssets(profile.assets, params.mode)

  printBanner(modes, params)

  const filePaths = {}
  const fileOptions = getFilesOptions(params)

  files.forEach(file => {
    if (
      // unique files only (modes share files):
      filePaths[file.absoluteName] === void 0 &&
      // we have no filter or the resource's handler matches the filter:
      (!params.filter || file.handler === params.filter)
    ) {
      filePaths[file.absoluteName] = true
      generateFile(file, fileOptions)
    }
  })
}
