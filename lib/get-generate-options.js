
function getBgColor (bgcolor) {
  let hex = bgcolor.replace(/^#/, '')

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

module.exports = function ({ bgcolor, ...opts }) {
  return {
    ...opts,
    bgcolor: getBgColor(bgcolor)
  }
}
