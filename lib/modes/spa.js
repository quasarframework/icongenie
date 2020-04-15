module.exports = {
  name: 'spa',
  folder: '/src',
  entries: [
    {
      handler: 'png',
      name: 'app-logo-{size}x{size}.png',
      folder: 'src/statics',
      sizes: [ 128 ]
    },

    {
      handler: 'png',
      name: 'apple-icon-{size}x{size}.png',
      folder: 'src/statics/icons',
      sizes: [ 120, 152, 167, 180 ]
    },

    {
      handler: 'png',
      name: 'favicon-{size}x{size}.png',
      folder: 'src/statics/icons',
      sizes: [ 16, 32, 96 ]
    },

    {
      handler: 'ico',
      name: 'favicon.ico',
      folder: 'src/statics/icons'
    },

    {
      handler: 'png',
      name: 'icon-{size}x{size}.png',
      folder: 'src/statics/icons',
      sizes: [ 128, 192, 256, 384, 512 ]
    },

    {
      handler: 'png',
      name: 'ms-icon-{size}x{size}.png',
      folder: 'src/statics/icons',
      sizes: [ 144 ]
    },

    {
      handler: 'svg',
      name: 'safari-pinned-tab.svg',
      folder: 'src/statics/icons'
    }
  ]
}
