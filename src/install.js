const { existsSync } = require('fs')

const banner = `If you like this app-extension please leave a star at:
https://github.com/quasarframework/app-extension-icon-factory/stargazers

Please consider becoming a Sponsoring development:
https://donate.quasar.dev`

module.exports = function (api) {
  api.compatibleWith('@quasar/app', '^1.0.0-beta.25')

  if (!existsSync(api.resolve.app('app-icon.png'))) {
    console.log('Creating demo icon.')
    api.render('./templates/icon')
  }

  if (!existsSync(api.resolve.app('app-splashscreen.png'))) {
    console.log('Creating demo splashscreen.')
    api.render('./templates/splashscreen')
  }

  api.setPersistentConf({
    dev: {},
    build: {}
  })

  api.onExitLog(banner)
}
