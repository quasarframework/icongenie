const spaEntries = require('./spa').entries

module.exports = {
  name: 'pwa',
  folder: 'src-pwa',
  entries: [ ...spaEntries ]
}
