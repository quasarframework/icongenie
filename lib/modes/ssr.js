const spaEntries = require('./spa').entries

module.exports = {
  name: 'ssr',
  folder: 'src-ssr',
  entries: [ ...spaEntries ]
}
