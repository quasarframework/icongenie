module.exports = [
  {
    // macos
    handler: 'icns',
    name: 'icon.icns',
    folder: 'src-electron/icons'
  },

  {
    // windows
    handler: 'ico',
    name: 'icon.ico',
    folder: 'src-electron/icons'
  },

  {
    // linux
    handler: 'png',
    name: 'icon.png',
    folder: 'src-electron/icons',
    sizes: [ 512 ]
  }
]
