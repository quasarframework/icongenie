const { createConfig } = require('./utils')

module.exports = function (api) {
  createConfig(api.prompts)
}
