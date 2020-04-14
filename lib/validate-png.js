const readChunk = require('read-chunk')
const isPng = require('is-png')

// "fried" png's - http://www.jongware.com/pngdefry.html
const friedChunk = 'CgBI'

const PNG_STATUS = {
  OK: 1,
  FORMAT_ERROR: 2,
  RESOLUTION_ERROR: 3
}

function getPngSize (buffer) {
  const offset = buffer.toString('ascii', 12, 16) === friedChunk
    ? [ 36, 32 ]
    : [ 20, 16 ]

  return {
    height: buffer.readUInt32BE(offset[0]),
    width: buffer.readUInt32BE(offset[1])
  }
}

function validatePng (file, [ width, height ]) {
  const buffer = readChunk.sync(file, 0, 40)

  if (isPng(buffer) !== true) {
    return PNG_STATUS.FORMAT_ERROR
  }

  const pngSize = getPngSize(buffer)

  if (width !== pngSize.width || height !== pngSize.height) {
    return PNG_STATUS.RESOLUTION_ERROR
  }

  return PNG_STATUS.OK
}

module.exports.PNG_STATUS = PNG_STATUS
module.exports.validatePng = validatePng
