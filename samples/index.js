const { join } = require('path')

const samplesDefinition = {
  icon: {
    file: 'icongenie-icon.png',
    details: 'icon source (1240x1240px)'
  },

  splashscreen: {
    file: 'icongenie-splashscreen.png',
    details: 'splashscreen source (2436x2436px)'
  },

  profile: {
    file: 'icongenie-profile.json',
    details: 'custom profile'
  }
}

function getSamplePath (filename) {
  return join(__dirname, './', filename)
}

module.exports.samplesDefinition = samplesDefinition
module.exports.getSamplePath = getSamplePath
