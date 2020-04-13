module.exports = {
  name: 'electron',
  folder: 'src-electron',
  entries: [
    {
      handler: 'png',
      name: 'icon.png',
      folder: 'src-electron/icons',
      sizes: [ 512 ]
    },

    {
      handler: 'png',
      name: 'StoreLogo.png',
      folder: 'src-electron/icons',
      sizes: [ 50 ]
    },

    {
      handler: 'png',
      name: 'Square{size}x{size}.png',
      folder: 'src-electron/icons',
      sizes: [
        30, 44, 71, 89, 107, 142, 150, 284, 310
      ]
    },

    {
      handler: 'png',
      name: 'linux-{size}x{size}.png',
      folder: 'src-electron/icons',
      sizes: [
        16, 24, 32, 48, 64, 96, 128, 512
      ]
    }
  ]
}
