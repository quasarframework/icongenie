const fs = require('fs')
const { resolveDir } = require('./app-paths')

class Mode {
  constructor (name) {
    const cfg = require('./config/' + name)

    this.name = cfg.name
    this.folder = cfg.folder
    this.icon = cfg.icon
    this.splashscreen = cfg.splashscreen
  }

  get hasIcons () {
    return this.icon !== void 0
  }

  get hasSplashscreens () {
    return this.splashscreen !== void 0
  }

  get isInstalled () {
    return fs.existsSync(resolveDir(this.folder))
  }
}

const modesList = [
  'bex',
  'capacitor',
  'cordova',
  'electron',
  'pwa',
  'spa',
  'ssr'
]

module.exports.modesList = modesList
module.exports.Mode = Mode
module.exports.getAllModes = () => modesList.map(modeName => new Mode(modeName))
