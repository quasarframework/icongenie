const sharp = require('sharp')

const { getPngCompression, getIcoCompression } = require('./get-compression')

function getRgbColor (color) {
  let hex = color.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const num = parseInt(hex, 16)

  return {
    r: num >> 16,
    g: num >> 8 & 255,
    b: num & 255,
    alpha: 1
  }
}

module.exports = async function getFilesOptions ({
  quality,

  icon,
  landscape,
  portrait,

  pngColor,
  splashscreenColor,

  ...opts
}) {
  const qualityLevel = parseInt(quality, 10)
  const sharpIcon = sharp(icon).withMetadata()

  return {
    ...opts,

    icon: sharpIcon,
    iconBuffer: await sharpIcon.toBuffer(),
    landscape: sharp(landscape).withMetadata(),
    portrait: sharp(portrait).withMetadata(),

    compression: {
      ico: getIcoCompression(qualityLevel),
      png: getPngCompression(qualityLevel),
    },

    pngColor: getRgbColor(pngColor),
    splashscreenColor: getRgbColor(splashscreenColor)
  }
}
