const { mountCordova, isCordovaFile, verifyCordova } = require('./mount-cordova')

module.exports.mount = function mount (files) {
  mountCordova(files)
}

module.exports.verifyMount = function verifyMount (file) {
  return isCordovaFile(file)
    ? verifyCordova(file)
    : ''
}
