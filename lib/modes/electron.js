module.exports = [
  {
    // macos
    generator: 'icns',
    name: 'icon',
    folder: 'src-electron/icons'
  },

  {
    // windows
    generator: 'ico',
    name: 'icon',
    folder: 'src-electron/icons'
  },

  {
    // linux
    generator: 'png',
    name: 'icon',
    folder: 'src-electron/icons',
    sizes: [ 512 ]
  }
]
