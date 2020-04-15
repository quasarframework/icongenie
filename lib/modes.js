
module.exports = {
  spa: {
    folder: '/src',
    assets: require('./assets/spa')
  },

  pwa: {
    folder: '/src-pwa',
    assets: require('./assets/pwa')
  },

  ssr: {
    folder: '/src-ssr',
    assets: require('./assets/ssr')
  },

  bex: {
    folder: '/src-bex',
    assets: require('./assets/bex')
  },

  cordova: {
    folder: '/src-cordova',
    assets: require('./assets/cordova')
  },

  capacitor: {
    folder: '/src-capacitor',
    assets: require('./assets/capacitor')
  },

  electron: {
    folder: '/src-electron',
    assets: require('./assets/electron')
  }
}
