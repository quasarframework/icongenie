module.exports = function filterArgvParams (argv) {
  const params = {}

  Object.keys(argv).forEach(key => {
    if (key.length > 1 && key !== 'help') {
      params[key] = argv[key]
    }
  })

  return params
}
