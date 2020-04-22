const { writeFile } = require('fs')
const png2icons = require('png2icons')

module.exports = async function (file, opts, done) {
  const output = await png2icons.createICO(opts.iconBuffer, opts.compression.ico, 0, true)
  const filename = file.absoluteName.endsWith('.ico')
    ? file.absoluteName
    : file.absoluteName + '.ico'

  writeFile(filename, output, done)
}
