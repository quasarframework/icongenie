const fs = require('fs')
const { join } = require('path')

const { resolveDir } = require('../app-paths')

class Mode {
  constructor (name, appDir) {
    const cfg = require('./' + name)

    this.name = cfg.name
    this.folder = cfg.folder
    this.entries = cfg.entries

    this.appDir = appDir || ''
  }

  get isInstalled () {
    return fs.existsSync(resolveDir(this.folder))
  }

  get files () {
    const files = []

    this.entries.forEach(entry => {
      if (entry.sizes !== void 0) {
        entry.sizes.forEach(size => {
          const resolution = Array.isArray(size)
            ? size
            : [ size, size ]

          const name = entry.name.replace(/{size}/g, resolution[0])
          const relativeName = join(entry.folder, name)
          files.push({
            name,
            relativeName,
            absoluteName: join(this.appDir, relativeName),
            handler: entry.handler,
            background: entry.background,
            resolution
          })
        })
      }
      else {
        files.push({
          name: entry.name,
          relativeName: join(entry.folder, entry.name),
          absoluteName: join(this.appDir, entry.folder, entry.name),
          background: entry.background,
          handler: entry.handler
        })
      }
    })

    return files
  }
}

const modesList = [
  'spa',
  'pwa',
  'ssr',
  'bex',
  'cordova',
  'capacitor',
  'electron'
]

module.exports.modesList = modesList
module.exports.Mode = Mode
module.exports.getAllModes = appDir => modesList.map(modeName => new Mode(modeName, appDir))
