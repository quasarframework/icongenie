const { dirname } = require('path')

const imagemin = require('imagemin')
const pngquant = require('imagemin-pngquant')

const { BICUBIC2, HERMITE, BEZIER, BICUBIC, BILINEAR, NEAREST_NEIGHBOR } = require('png2icons')

// compression level 0 - 11
//   - best is 11
//   - poorest is 1
//   - no compression is 0

module.exports.getIcoCompression = function getIcoCompression (level) {
  switch (level) {
    case 0:
    case 1:
      return HERMITE // quite slow, high quality
    case 2:
    case 3:
      return BEZIER // quite slow, high quality
    case 4:
    case 5:
      return BICUBIC2 // fast, good to very good quality
    case 6:
    case 7:
      return BICUBIC // slower, good to very good quality
    case 8:
    case 9:
      return BILINEAR // fast, quality OK
    case 10:
    case 11:
      return NEAREST_NEIGHBOR // fastest, mediocre to OK quality
  }
}

module.exports.getPngCompression = function getPngCompression (level) {
  if (level === 0) {
    return () => {}
  }

  const plugins = [
    pngquant({
      quality: [ 0.6, 0.8 ],
      speed: 12 - level // 1 - 11
    })
  ]

  return async function minifyFile (filename) {
    return imagemin([ filename ], {
      destination: dirname(filename),
      plugins
    })
  }
}
