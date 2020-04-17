const { join } = require('path')

const { appDir } = require('./app-paths')

/*
  "asset" is an Object with syntax like any file in /lib/assets/
*/
module.exports = function getAssetsFiles (assets) {
  const files = []

  assets.forEach(entry => {
    const { sizes, ...props } = entry

    if (Array.isArray(sizes)) {
      sizes.forEach(size => {
        const [ width, height ] = Array.isArray(size)
          ? size
          : [ size, size ]

        const computedName = entry.name.replace(/{size}/g, width)
        const relativeName = join(entry.folder, computedName)

        files.push({
          ...props,
          name: computedName,
          relativeName,
          absoluteName: join(appDir, relativeName),
          width,
          height
        })
      })
    }
    else {
      files.push({
        ...props,
        relativeName: join(entry.folder, entry.name),
        absoluteName: join(appDir, entry.folder, entry.name)
      })
    }
  })

  return files
}
