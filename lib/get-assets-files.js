const { join } = require('path')

const { appDir } = require('./app-paths')

/*
  "asset" is an Object with syntax like any file in /lib/assets/
*/
module.exports = function getAssetsFiles (assets) {
  const files = []

  assets.forEach(entry => {
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
          absoluteName: join(appDir, relativeName),
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
        absoluteName: join(appDir, entry.folder, entry.name),
        background: entry.background,
        handler: entry.handler
      })
    }
  })

  return files
}
