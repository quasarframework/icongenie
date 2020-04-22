const { join } = require('path')

const samplesDefinition = {
  icon: {
    file: 'icongenie-icon.png',
    details: 'icon source (1024x1024px)'
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
