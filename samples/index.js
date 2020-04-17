const { join } = require('path')

const samplesDefinition = {
  icon: {
    file: 'icongenie-icon.png',
    details: 'icon source (1240x1240px)'
  },

  landscape: {
    file: 'icongenie-landscape.png',
    details: 'landscape splashscreen source (2436x2436px)'
  },

  portrait: {
    file: 'icongenie-portrait.png',
    details: 'portrait splashscreen source (2436x2436px)'
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
