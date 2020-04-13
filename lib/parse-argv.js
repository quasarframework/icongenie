const { warn } = require('./logger')

function die (msg, fallbackFn) {
  if (fallbackFn !== void 0) {
    return fallbackFn()
  }
  else {
    warn(msg)
    warn()
    process.exit(1)
  }
}

function mode (value) {
  const { modesList } = require('./modes')

  if (value !== 'all' && !modesList.includes(value)) {
    die(`Invalid mode requested: "${value}"`)
  }
}

function algorithm (value) {
  if (!['pngquant', 'optipng', 'pngcrush', 'zopfli'].includes(value)) {
    die(`Invalid algorithm requested: "${value}"`)
  }
}

function icon (value, argv) {
  if (!value) {
    warn(`No source icon file specified, so using the sample one`)
    argv.icon = join(__dirname, '../samples/app-icon.png')
    return
  }

  const fs = require('fs')
  const { resolve } = require('path')
  const { appDir } = require('./app-paths')

  argv.icon = resolve(appDir, value)

  if (!fs.existsSync(argv.icon)) {
    die(`Path to source icon does not exists: "${value}"`)
  }
}

function splashscreen (value, argv) {
  if (!['capacitor', 'cordova', 'all'].includes(argv.mode)) {
    return
  }

  if (!value) {
    warn(`No splashscreen source file specified, so using the sample one`)
    argv.splashscreen = join(__dirname, '../samples/app-splashscreen.png')
    return
  }

  const fs = require('fs')
  const { resolve } = require('path')
  const { appDir } = require('./app-paths')

  argv.splashscreen = resolve(appDir, value)

  if (!fs.existsSync(argv.splashscreen)) {
    die(`Path to splashscreen source file does not exists: "${value}"`)
  }
}

function type (value) {
  if (!['pure', 'bg', 'overlay'].includes(value)) {
    die(`Invalid algorithm specified: "${value}"`)
  }
}

function bgcolor (value, argv) {
  if (!['capacitor', 'cordova', 'all'].includes(argv.mode)) {
    return
  }

  let hex = value.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
  }
  else if (/^[0-9A-Fa-f]+$/.test(hex) !== true) {
    die(`Invalid bgcolor specified: "${value}"`)
  }

  const num = parseInt(hex, 16)

  argv.bgcolor = { r: num >> 16, g: num >> 8 & 255, b: num & 255 }
}

const parsers = {
  mode,
  algorithm,
  icon,
  splashscreen,
  type,
  bgcolor
}

module.exports = function (argv, list) {
  list.forEach(name => {
    const fn = parsers[name]
    if (fn === void 0) {
      die(`Invalid command parameter parser specified`)
    }

    fn(argv[name], argv)
  })
}
