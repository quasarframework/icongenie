const chalk = require('chalk')

module.exports = function (banner, color = 'green') {
  return function (msg) {
    console.log(
      msg ? ` ${chalk[color](banner)} ${msg}` : ''
    )
  }
}

module.exports.warn = function (msg) {
  console.log(
    msg ? chalk.red(` ⚠️  ${msg}`) : ''
  )
}

module.exports.log = function (msg) {
  console.log(
    msg ? ` ${chalk.green('*')} ${msg}` : ''
  )
}
