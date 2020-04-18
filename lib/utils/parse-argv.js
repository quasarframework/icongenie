const { existsSync, lstatSync } = require('fs')
const { resolve } = require('path')

const getPngSize = require('./get-png-size')
const { warn } = require('./logger')
const generators = require('../generators')

function die (msg) {
  warn(msg)
  warn()
  process.exit(1)
}

function profile (value) {
  if (value) {
    if (!value.endsWith('.json')) {
      die(`Specified profile (${value}) is not a .json file`)
    }

    const { appDir } = require('./app-paths')

    if (!existsSync(resolve(appDir, value))) {
      die(`Specified profile file (${value}) does not exists`)
    }
  }
}

function mode (value, argv) {
  const possibleValues = Object.keys(require('../modes'))

  if (!value) {
    argv.mode = possibleValues
    return
  }

  const list = value.split(',')

  if (list.includes('all')) {
    argv.mode = possibleValues
    return
  }

  if (list.some(mode => !possibleValues.includes(mode))) {
    die(`Invalid mode requested: "${value}"`)
  }

  argv.mode = list
}

function include (value, argv) {
  if (!value) {
    return
  }

  const possibleValues = Object.keys(require('../modes'))

  if (value.includes('all')) {
    argv.include = possibleValues
    return
  }

  if (value.some(mode => !possibleValues.includes(mode))) {
    die(`Invalid include requested: "${value}"`)
  }
}

function quality (value) {
  const numeric = parseInt(value, 10)
  if (isNaN(numeric)) {
    die(`Invalid quality level number specified`)
  }
  if (numeric < 1 || numeric > 12) {
    die(`Invalid quality level specified (${value}) - should be between 1 - 12`)
  }
}

function filter (value) {
  if (value && !Object.keys(generators).includes(value)) {
    die(`Unknown filter value specified (${value}); there is no such generator`)
  }
}

function icon (value, argv) {
  if (!value) {
    warn(`No source icon file specified, so using the sample one`)

    const { samplesDefinition, getSamplePath } = require('../../samples')
    argv.icon = getSamplePath(samplesDefinition.icon.file)

    return
  }


  const { appDir } = require('./app-paths')

  argv.icon = resolve(appDir, value)

  if (!existsSync(argv.icon)) {
    die(`Path to source icon file does not exists: "${value}"`)
  }

  const { width, height } = getPngSize(argv.icon)

  if (width === 0 && height === 0) {
    die(`Icon source is not a PNG file!`)
  }

  if (width < 64 || height < 64) {
    die(`Icon source file does not have the minimum 64x64px resolution`)
  }

  if (width !== height) {
    die(`Icon source file resolution has width !== height`)
  }
}

function landscape (value, argv) {
  if (!value) {
    if (argv.icon) {
      value = argv.icon
      warn(`No landscape source file specified, so using the icon one`)
    }
    else {
      warn(`No landscape source file specified, so using the sample one`)

      const { samplesDefinition, getSamplePath } = require('../../samples')
      argv.landscape = getSamplePath(samplesDefinition.landscape.file)

      return
    }
  }

  const { appDir } = require('./app-paths')

  argv.landscape = resolve(appDir, value)

  if (!existsSync(argv.landscape)) {
    die(`Path to landscape source file does not exists: "${value}"`)
  }

  const { width, height } = getPngSize(argv.landscape)

  if (width === 0 && height === 0) {
    die(`Landscape source file is not a PNG file!`)
  }

  if (width < 128 || height < 128) {
    die(`Landscape source file does not have the minimum 128x128px resolution`)
  }

  if (width < height) {
    die(`Landscape source file resolution has width < height`)
  }
}

function portrait (value, argv) {
  if (!value) {
    if (argv.icon) {
      value = argv.icon
      warn(`No portrait source file specified, so using the icon one`)
    }
    else {
      warn(`No portrait source file specified, so using the sample one`)

      const { samplesDefinition, getSamplePath } = require('../../samples')
      argv.portrait = getSamplePath(samplesDefinition.portrait.file)

      return
    }
  }

  const { appDir } = require('./app-paths')

  argv.portrait = resolve(appDir, value)

  if (!existsSync(argv.portrait)) {
    die(`Path to portrait source file does not exists: "${value}"`)
  }

  const { width, height } = getPngSize(argv.portrait)

  if (width === 0 && height === 0) {
    die(`Portrait source file is not a PNG file!`)
  }

  if (width < 128 || height < 128) {
    die(`Portrait source file does not have the minimum 128x128px resolution`)
  }

  if (width > height) {
    die(`Portrait source file resolution has width > height`)
  }
}

function splashscreen (value) {
  if (!['pure', 'bg', 'overlay'].includes(value)) {
    die(`Invalid splashscreen type specified: "${value}"`)
  }
}

function color (value) {
  let hex = value.replace(/^#/, '')

  if (
    (hex.length !== 3 && hex.length !== 6) ||
    /^[0-9A-Fa-f]+$/.test(hex) !== true
  ) {
    die(`Invalid theme color specified: "${value}"`)
  }
}

function folder (value, argv) {
  const { appDir } = require('./app-paths')
  const folder = resolve(appDir, value)

  if (!existsSync(folder)) {
    die(`Specified folder (${folder}) does not exists!`)
  }

  if (!lstatSync(folder).isDirectory()) {
    die(`Specified folder (${folder}) is not actually a folder!`)
  }

  argv.folder = folder
}

const parsers = {
  profile,
  mode,
  quality,
  filter,
  color,
  icon,
  landscape,
  portrait,
  splashscreen,

  include, // profile file param
  folder // "run" cmd param
}

module.exports = function (argv, list) {
  list.forEach(name => {
    const fn = parsers[name]
    if (fn === void 0) {
      die(`Invalid command parameter specified (${name})`)
    }

    fn(argv[name], argv)
  })
}
