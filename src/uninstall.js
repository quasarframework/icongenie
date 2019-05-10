const { unlinkSync } = require('fs-extra')

module.exports = function(api) {
  unlinkSync(api.resolve.app('quasar.icon-factory.json'))
}
